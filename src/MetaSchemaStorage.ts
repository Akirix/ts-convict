
export default class MetaSchemaStorage {

    private schemaRepo = {};

    public getSchema() {
        return this.schemaRepo;
    }

    public addSchemaProp(className: string, propertyName: string, schemaObj: SchemaObj): void {

        if (!this.schemaRepo.hasOwnProperty(className)) {
            this.schemaRepo[className] = {};
        }
        this.schemaRepo[className][propertyName] = schemaObj;

    }

    /**
     * Returns a saved Schema Object from the storage. 
     * @param className The name of the loaded class. 
     */
    public getClassSchema(className: string): SchemaObj|null {
        return (this.schemaRepo.hasOwnProperty(className)) ? this.schemaRepo[className] : null;
    }

    /**
     * Empties out the storage so no schemas will exist. 
     */
    public clearRepo(): void {
        this.schemaRepo = {};
    }

}