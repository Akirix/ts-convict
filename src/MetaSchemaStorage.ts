import { SchemaObj } from "convict";

export default class MetaSchemaStorage {

    private schemaRepo = {};

    /**
     * Get the loaded schema from the storage
     */
    public getSchema() {
        return this.schemaRepo;
    }

    /**
     * Add the schema of one property to the saved class
     * @param className 
     * @param propertyName 
     * @param schemaObj 
     */
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