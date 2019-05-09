
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

}