import {importClassesFromDirectories} from "./DirectoryExportedClassesLoader";
import ConfUtils from "./ConfUtils";
import convict, { SchemaObj } from 'convict';
import {getMetaSchemaStorage} from './index';

/**
 *
 */
export class ConvictModel {

    private classRepo: any;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    // tslint:disable-next-line: ban-types
    constructor(entities: Array<(Function|string)> | null = null) {

        this.classRepo = {};
        if (entities !== null) {
            this.loadConfigClasses(entities);
        }

    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Builds the main schema object
     */
    // tslint:disable-next-line: ban-types
    public loadConfigClasses(entities: Array<(Function|string)>) {

        const [entityClasses, entityDirectories] = ConfUtils.splitClassesAndStrings(entities || []);
        [...entityClasses, ...importClassesFromDirectories(entityDirectories)].forEach((configClass: ()=>void) => {
            this.classRepo[configClass.name] = configClass;
        });

    }

    /**
     * Get one of the classes from the repo
     * @param className
     */
    public getClass(className: string) {
        return this.classRepo[className];
    }

    /**
     * Create a validated config from the schema and config
     * @param className
     * @param config
     */
    public createSimple<T>(className: string, config: T = {} as T) {
        // console.log("Running for class: ", this.getClass(className));
        // gets the schema for the class from the global registry
        const classSchema: SchemaObj = getMetaSchemaStorage().getClassSchema(className);
        const configClass: T = new (this.getClass(className))();
        const convictSchema = {};
        const flatConfig = {};
        Object.keys(classSchema).forEach((key: string) => {
            if (classSchema[key] instanceof Function) {
                const subConfigClass = classSchema[key]();
                configClass[key] = this.create(subConfigClass.name, (key in config) ? config[key] : {});
            } else {
                convictSchema[key] = classSchema[key];
                if (key in config) {
                    flatConfig[key] = config[key];
                }
            }
        });
        // now apply the actual data of the config to the schema and validate with convict itself
        // console.log("Loading this schema and config", convictSchema, flatConfig);
        const client: convict.Config<any> = convict(convictSchema);
        client.load(flatConfig);
        client.validate( { allowed: 'strict' } );

        // get all the validated values with defaults and apply them to a brand new serialized instance from your model class
        const validConfig: T = client.getProperties();
        return Object.assign( configClass ,validConfig);
    }

    /**
     * Create a validated config.
     * @param className
     * @param config
     */
    public create<T>(alias: string, config: any | string = {}) {

        //if just a string then we need the actual class
        const classSchema = getMetaSchemaStorage().findByAlias(alias);
        let configModel: T = new classSchema.target();
        let convictSchema = {};

        // recursively set up the schema a
        [configModel,convictSchema] = this.setModel<typeof classSchema.target>(classSchema,configModel,convictSchema);
        const client: convict.Config<any> = convict(convictSchema);

        // either load the file or the data for the config
        if (typeof config === 'string') {
            client.loadFile(config);
        } else {
            client.load(config);
        }

        // validate all the data is just right
        client.validate( { allowed: 'strict' } );
        const rawConfig = client.getProperties();
        console.log('The convictmodel before assign is is ', configModel);
        configModel = Object.assign( configModel ,rawConfig);
        console.log('The convictmodel after assign is is ', configModel);
        return configModel;
    }

    /**
     * Recursive fx to set the schema and new sub schema objects to the main config class object
     * @param classSchema
     * @param configClass
     * @param convictSchema
     */
    private setModel<T>(classSchema: any, configModel: T, convictSchema: any): [T,any] {

        Object.keys(classSchema.schema).forEach((key: string) => {

            // if the value in the class schema is a function then we have a submodel to recurse
            if (classSchema.schema[key] instanceof Function) {

                const subConfigClass = classSchema.schema[key]();
                const subClassSchema = this.getClassSchema(subConfigClass.name);
                let subConfigModel: typeof subConfigClass = new subConfigClass();
                let subSchema = {};
                [subConfigModel,subSchema] = this.setModel<typeof subConfigClass>(subClassSchema,subConfigModel,subSchema);
                convictSchema[key] = subSchema;
                configModel[key] = subConfigModel;
            }
            // otherwise just a simple convict schema def
            else {
                convictSchema[key] = classSchema[key];
            }
        });
        return [configModel, convictSchema];
    }

    /**
     * Finds the schema for the specified class
     * @param className The name of the class with a schema
     */
    private getClassSchema(className: string): SchemaObj {
        return getMetaSchemaStorage().findByClassName(className);
    }

}
