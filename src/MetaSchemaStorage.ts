import { SchemaObj } from "convict";
import { ConfigOptions } from "decorators/Config";

export default class MetaSchemaStorage {

    private schemaRepo = [];

    /**
     * Get the loaded schema from the storage
     */
    public getSchema() {
        return this.schemaRepo;
    }

    /**
     * Add the schema of one property to the saved class
     * @param className
     * @param propertyName
     * @param schemaObj
     */
    // tslint:disable-next-line: ban-types
    public addSchemaProp<T>(target: new () => T, propertyName: string, schemaObj: SchemaObj | Function ): void {
        const repoItem: any = this.setClass(target);
        repoItem.schema[propertyName] = schemaObj;
    }

    /**
     * initializes a class into the repo
     * @param target
     */
    public setClass<T>(target: new () => T, isEntry: boolean = false, opts: ConfigOptions = {}): any {
        const className = target.name;

        // we absolutely need the items index so try to get it
        // we will add the new class if it is not in the repo in the case we get an error thrown
        let itemIndex: number;
        try {
            itemIndex = this.getClassIndex(className);
        } catch (error) {
            this.schemaRepo.push({
                as: target.name,
                dir: 'config',
                schema: {},
                parser: null,
                target
            });
            itemIndex = this.getClassIndex(className);
        } finally {
            this.schemaRepo[itemIndex].isEntry = isEntry;
            this.schemaRepo[itemIndex] = Object.assign(this.schemaRepo[itemIndex],opts);
        }
        return this.schemaRepo[itemIndex];
    }

    /**
     * Finds a class in the repo by the class name
     * @param className
     */
    public findByClassName(className: string) {
        const items = this.schemaRepo.filter((item) => {
            return item.target.name === className;
        });
        if (!items || items.length !== 1) {
            throw new Error(`Could not find the ${className} class in the repo`);
        }
        return items[0];
    }

    /**
     * Finds a class in the repo by the class name
     * @param className
     */
    public findByAlias(alias: string) {
        const items =  this.schemaRepo.filter((item) => {
            return (item.as === alias || item.target.name === alias);
        });
        if (!items || items.length !== 1) {
            throw new Error(`Could not find the class for ${alias} in the repo`);
        }
        return items[0];
    }

    /**
     * Recursivly sets the schema
     * @param schema
     */
    public parseSchema(alias: string): any {

        // initiate an object for convicts schema and get the raw class meta
        const convictSchema: any = {};
        const classMeta = this.findByAlias(alias);

        // use the class meta to build the convict schema
        Object.keys(classMeta.schema).forEach((key: string) => {
            // if the value in the class schema is a function then we have a submodel to recurse
            if (classMeta.schema[key] instanceof Function) {
                convictSchema[key] = this.parseSchema(classMeta.schema[key].name);
            }
            // otherwise just a simple convict schema def
            else {
                convictSchema[key] = classMeta.schema[key];
            }
        });
        return convictSchema;
    }

    /**
     * Empties out the storage so no schemas will exist.
     */
    public clearRepo(): void {
        this.schemaRepo = [];
    }

    /**
     * Finds the index of a class in the repo
     * @param className The name of the class you are looking for.
     */
    private getClassIndex(className: string) {
        const index = this.schemaRepo.findIndex((item: any) => {
            return item.target.name === className;
        });
        if (index === -1) {
            throw new Error(`Could not find the ${className} class in the repo`);
        }
        return index;
    }

}
