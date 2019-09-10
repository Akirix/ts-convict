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
    public create<T>(className: string, config: T = {} as T) {
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

}