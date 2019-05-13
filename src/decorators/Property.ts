import { getMetaSchemaStorage } from '../';

/**
 * Anotate a config schema class property with this anotation. 
 * @param schemaObj The convict schema object. 
 */
export function Property(schemaObj: SchemaObj) {
    console.log('The decorator will run');
    return (target: object, propertyName: string) => {
        
        let type: any;
        // if type is not given explicitly then try to guess it
        const reflectMetadataType = Reflect && (Reflect as any).getMetadata ? (Reflect as any).getMetadata("design:type", target, propertyName) : undefined;
        if (!type && reflectMetadataType) {
            type = reflectMetadataType;
        }
        const className: string = target.constructor.name;

        getMetaSchemaStorage().addSchemaProp(className,propertyName,schemaObj);

    };
}