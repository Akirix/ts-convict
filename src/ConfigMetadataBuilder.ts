import {importClassesFromDirectories} from "./DirectoryExportedClassesLoader";
import ConfUtils from "./ConfUtils";

/**
 * 
 */
export default class ConfigMetadataBuilder {

    private classRepo: Function[];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor() {
        
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Builds the main schema object
     */
    public loadConfigClasses(entities: (Function|string)[]) {
        // todo: instead we need to merge multiple metadata args storages

        const [entityClasses, entityDirectories] = ConfUtils.splitClassesAndStrings(entities || []);

        this.classRepo = [...entityClasses, ...importClassesFromDirectories(entityDirectories)];
        
    }

    public create(className: string) {
        return this.classRepo;
    }

}