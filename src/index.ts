import 'reflect-metadata';
import PlatformTools from './PlatformTools';
import MetaSchemaStorage from "./MetaSchemaStorage";

export * from './decorators/Property';
export * from './decorators/Config';
export * from './ConvictModel';

/**
 * Gets schema storage from the global
 */
export function getMetaSchemaStorage(): MetaSchemaStorage {

    const globalScope = PlatformTools.getGlobalVariable();
    if (!globalScope.convictMetaSchemaStorage) {
        globalScope.convictMetaSchemaStorage = new MetaSchemaStorage();
    }
    return globalScope.convictMetaSchemaStorage;
}