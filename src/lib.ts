import MetaSchemaStorage from "MetaSchemaStorage";

function getGlobalVariable(): any {
    return global;
}

/**
 * Gets schema storage from the global
 */
export function getMetaSchemaStorage(): MetaSchemaStorage {

    const globalScope = getGlobalVariable();
    if (!globalScope.convictMetaSchemaStorage)
        globalScope.convictMetaSchemaStorage = new MetaSchemaStorage();

    return globalScope.convictMetaSchemaStorage;
}
