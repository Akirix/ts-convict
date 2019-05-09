import * as path from "path";
import * as fs from "fs";

/**
 * Originally written by pleerlock from typeorm. Modified for this case. 
 */
export default class PlatformTools {

    static getGlobalVariable(): any {
        return global;
    }

    static load(name: string): any {
        return require(name);
    }

    /**
     * Normalizes given path. Does "path.normalize".
     */
    static pathNormalize(pathStr: string): string {
        return path.normalize(pathStr);
    }

    /**
     * Gets file extension. Does "path.extname".
     */
    static pathExtname(pathStr: string): string {
        return path.extname(pathStr);
    }

    /**
     * Resolved given path. Does "path.resolve".
     */
    static pathResolve(pathStr: string): string {
        return path.resolve(pathStr);
    }

    /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     */
    static fileExist(pathStr: string): boolean {
        return fs.existsSync(pathStr);
    }

    static readFileSync(filename: string): Buffer {
        return fs.readFileSync(filename);
    }

    static appendFileSync(filename: string, data: any): void {
        fs.appendFileSync(filename, data);
    }

    static async writeFile(path: string, data: any): Promise<void> {
        return new Promise<void>((ok, fail) => {
            fs.writeFile(path, data, (err) => {
                if (err) fail(err);
                ok();
            });
        });
    }

    /**
     * Gets environment variable.
     */
    static getEnvVariable(name: string): any {
        return process.env[name];
    }

}