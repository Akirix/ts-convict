import {importClassesFromDirectories} from "./DirectoryExportedClassesLoader";
import ConfUtils from "./ConfUtils";
import convict, { SchemaObj } from 'convict';
import {getMetaSchemaStorage} from './index';

/**
 * 
 */
export default class ConvictModel {

    private classRepo: any;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(entities: Array<(()=>|string)> | null = null) {

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
     * Cfreate a validated config from the schema and config
     * @param className 
     * @param config 
     */
    public create<T>(className: string, config: T = {} as T) {
        const classSchema: SchemaObj = getMetaSchemaStorage().getClassSchema(className);
        const client: convict.Config<any> = convict(classSchema);
        client.load(config);
        client.validate( { allowed: 'strict' } );
        const validConfig: T = client.getProperties();
        return Object.assign( new (this.getClass(className))() ,validConfig);
    }

}