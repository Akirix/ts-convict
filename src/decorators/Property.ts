import { getMetaSchemaStorage } from '../';
import { SchemaObj } from 'convict';

/**
 * Anotate a config schema class property with this anotation.
 * @param schemaObj The convict schema object.
 */
export function Property(schemaObj: SchemaObj | (new () => {})) {
    return (target: any, propertyName: string) => {

        if ((typeof schemaObj === 'object') && (typeof schemaObj.format === 'undefined')) {
            // if type is not given explicitly then try to guess it
            const reflectMetadataType = Reflect && (Reflect as any).getMetadata ? (Reflect as any).getMetadata("design:type", target, propertyName) : undefined;
            if (reflectMetadataType) {
                schemaObj.format = reflectMetadataType;
            }
        }

        // const className: string = target.constructor.name;
        // console.log("And the class is: ", target.constructor.name);

        getMetaSchemaStorage().addSchemaProp(target.constructor,propertyName,schemaObj);
    };
}
