import * as path from "path";
import * as fs from "fs";

/**
 * Originally written by pleerlock from typeorm. Modified for this case. 
 */
export default class PlatformTools {

    /**
     * Gets the global variable
     */
    public static getGlobalVariable(): any {
        return global;
    }

    /**
     * Load up a module from source
     * @param name 
     */
    public static load(name: string): any {
        return require(name);
    }

    /**
     * Normalizes given path. Does "path.normalize".
     */
    public static pathNormalize(pathStr: string): string {
        return path.normalize(pathStr);
    }

    /**
     * Gets file extension. Does "path.extname".
     */
    public static pathExtname(pathStr: string): string {
        return path.extname(pathStr);
    }

    /**
     * Resolved given path. Does "path.resolve".
     */
    public static pathResolve(pathStr: string): string {
        return path.resolve(pathStr);
    }

    /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     */
    public static fileExist(pathStr: string): boolean {
        return fs.existsSync(pathStr);
    }

    /**
     * Get a file from disk synchronously
     * @param filename 
     */
    public static readFileSync(filename: string): Buffer {
        return fs.readFileSync(filename);
    }

    /**
     * Append file sync
     * @param filename 
     * @param data 
     */
    public static appendFileSync(filename: string, data: any): void {
        fs.appendFileSync(filename, data);
    }

    /**
     * Write a file to disk
     * @param path 
     * @param data 
     */
    public static async writeFile(path: string, data: any): Promise<void> {
        return new Promise<void>((ok, fail) => {
            fs.writeFile(path, data, (err) => {
                if (err) {
                    fail(err);
                }
                ok();
            });
        });
    }

    /**
     * Gets environment variable.
     */
    public static getEnvVariable(name: string): any {
        return process.env[name];
    }

}