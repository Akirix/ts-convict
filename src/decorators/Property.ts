import { getMetaSchemaStorage } from '../';
import { SchemaObj } from 'convict';

/**
 * Anotate a config schema class property with this anotation.
 * @param schemaObj The convict schema object.
 */
// tslint:disable-next-line: ban-types
export function Property<T>(schemaObj: SchemaObj | Function) {
    return (target: any, propertyName: string) => {

        let type: any;
        // if type is not given explicitly then try to guess it
        const reflectMetadataType = Reflect && (Reflect as any).getMetadata ? (Reflect as any).getMetadata("design:type", target, propertyName) : undefined;
        if (!type && reflectMetadataType) {
            type = reflectMetadataType;
            // console.log("And the type is: " + type);
        }
        // const className: string = target.constructor.name;
        // console.log("And the class is: ", target.constructor.name);

        getMetaSchemaStorage().addSchemaProp(target.constructor,propertyName,schemaObj);
        console.log('The property annotation ran');
    };
}
