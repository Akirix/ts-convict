
export default class MetaSchemaStorage {

    private schemaRepo = {};

    public addSchemaProp(className: string, propertyName: string, schemaObj: SchemaObj): void {

        this.schemaRepo[className][propertyName] = schemaObj;

    }

}