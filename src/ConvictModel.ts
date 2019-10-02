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
        [...entityClasses, ...importClassesFromDirectories(entityDirectories)].forEach((_configClass: ()=>void) => {});

    }

    /**
     * Create a validated config from the schema and config
     * @param className
     * @param config
     */
    public createSimple<T>(alias: string, config: T = {} as T) {
        // console.log("Running for class: ", this.getClass(className));
        // gets the schema for the class from the global registry
        const classMeta: any = getMetaSchemaStorage().findByAlias(alias);
        const configModel: T = new classMeta.target();
        const flatSchema = {};
        const flatConfig = {};
        // convict.addParser(classSchema.parser);
        Object.keys(classMeta.schema).forEach((key: string) => {
            if (classMeta.schema[key] instanceof Function) {
                configModel[key] = this.createSimple(classMeta.schema[key].name, (key in config) ? config[key] : {});
            } else {
                flatSchema[key] = classMeta.schema[key];
                if (key in config) {
                    flatConfig[key] = config[key];
                }
            }
        });
        // now apply the actual data of the config to the schema and validate with convict itself
        // console.log("Loading this schema and config", convictSchema, flatConfig);
        const client: convict.Config<any> = convict(flatSchema);
        client.load(flatConfig);
        client.validate( { allowed: 'strict' } );

        // get all the validated values with defaults and apply them to a brand new serialized instance from your model class
        const validConfig: T = client.getProperties();
        return Object.assign( configModel ,validConfig);
    }

    /**
     * Create a validated config.
     * @param className
     * @param config
     */
    public create<T>(alias: string, config: any | string = {}): T {

        //if just a string then we need the actual class
        const classMeta = getMetaSchemaStorage().findByAlias(alias);

        if (classMeta.parser) {
            convict.addParser(classMeta.parser);
        }

        // recursively set up the schema a
        const convictSchema = this.getSchemaFor(alias);
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
        const configModel: T = this.applyDataToModel(classMeta,rawConfig);
        return configModel;
    }

    /**
     * Returns the entire convict schema for a specified alias
     * @param alias
     */
    public getSchemaFor(alias: string) {
        return getMetaSchemaStorage().parseSchema(alias);
    }

    public clear() {
        return getMetaSchemaStorage().clearRepo();
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
     * Applies data from a valid config to the actual model
     *
     */
    private applyDataToModel(classMeta: string | any, config: any = {}): any {

        if (typeof classMeta === 'string') {
            classMeta = getMetaSchemaStorage().findByAlias(classMeta);
        }
        const model: any = new classMeta.target();
        Object.keys(classMeta.schema).forEach((key: string) => {
            // if the value in the class schema is a function then we have a submodel to recurse
            if (classMeta.schema[key] instanceof Function) {
                model[key] = this.applyDataToModel(
                    classMeta.schema[key].name,
                    (key in config) ? config[key] : {}
                );
            }
            // otherwise just a simple convict schema def
            else {
                if (key in config) {
                    model[key] = config[key];
                }
            }
        });
        return model;
    }

    /**
     * Finds the schema for the specified class
     * @param className The name of the class with a schema
     */
    private getClassSchema(className: string): SchemaObj {
        return getMetaSchemaStorage().findByClassName(className);
    }

}
