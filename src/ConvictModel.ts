import {importClassesFromDirectories} from "./DirectoryExportedClassesLoader";
import ConfUtils from "./ConfUtils";
import convict from 'convict';
import {getMetaSchemaStorage} from './index';

/**
 * 
 */
export default class ConvictModel {

    private classRepo: any;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(entities: (Function|string)[] | null = null) {

        this.classRepo = {};
        if (entities !== null) this.loadConfigClasses(entities);

    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Builds the main schema object
     */
    public loadConfigClasses(entities: (Function|string)[]) {

        const [entityClasses, entityDirectories] = ConfUtils.splitClassesAndStrings(entities || []);
        [...entityClasses, ...importClassesFromDirectories(entityDirectories)].forEach((configClass: Function) => {
            this.classRepo[configClass.name] = configClass;
        });

    }

    public getClass(className: string) {
        return this.classRepo[className];
    }

    public create<T>(className: string, config: T = {} as T) {
        const classSchema: SchemaObj = getMetaSchemaStorage().getClassSchema(className);
        const client: convict.Config<any> = convict(classSchema);
        client.load(config);
        client.validate( { allowed: 'strict' } );
        const validConfig: T = client.getProperties();
        return Object.assign(new (this.getClass(className)),validConfig);
    }

}