import { Parser } from 'convict';
import { getMetaSchemaStorage } from '../';

export interface ConfigOptions {
    as?: string;

    /**
     * A directory relative to NODE_PATH or cwd()
     */
    dir?: string;

    /**
     * Any convict parsers you would like to use to load the config
     */
    parser?: Parser | Parser[];
}

/**
 * Tell me its a config
 * @param constructor
 */
export function Config<T>(opts: ConfigOptions = {}) {
    return (constructor: new () => T) => {
        console.log('The class annotation ran',opts);
        if (typeof opts.as === 'undefined') {
            opts.as = constructor.name;
        }
        if (typeof opts.dir === 'undefined') {
            opts.dir = 'config';
        }
        getMetaSchemaStorage().setClass(constructor, true, opts);
    };
}
