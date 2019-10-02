/**
 * @module test/models
 */
import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import "mocha";
import SimpleFlat from './scenarios/simple_flat/SimpleFlat.model';
import { getMetaSchemaStorage, getConvictModel, ConvictModel, Property } from '../index';

let builder: ConvictModel;

class InternalClass {
    @Property({
        doc: 'An embedded config class',
        default: 'blorb'
    })
    public message: string;
}

@suite('Testing the basics')
export class BasicsTest {

    public static before() {
        // console.log('Running the MyConfig Test');
        builder = getConvictModel([
            'src/test/scenarios/simple_flat/**.model.*s',
            InternalClass
        ]);
    }

    @test('Test the schema storage actually has classes')
    public testSchemaStorageHasSchemas() {

        const shouldBeInStorage = {
            as: 'SimpleFlat',
            dir: 'config',
            target: SimpleFlat,
            isEntry: false,
            parser: null,
            schema: {
                name: {
                    doc: 'The name of the thing',
                    default: 'Convict',
                    env: 'MY_CONFIG_NAME',
                    format: String
                }
            }
        };

        const theStorage = getMetaSchemaStorage();
        let isInStorage: any;
        assert.doesNotThrow(() => {
            isInStorage = theStorage.findByAlias('SimpleFlat');
        }, 'Should not get an error when finding a valid class in the repo');

        /* console.log("In the storage");
        console.dir(isInStorage);
        console.log("Should be in storage");
        console.dir(shouldBeInStorage); */
        assert.deepStrictEqual(isInStorage,shouldBeInStorage);
        assert.strictEqual(
            isInStorage.as,
            shouldBeInStorage.as,
            'Expected the schemas to be the same.'
        );
        assert.strictEqual(isInStorage.dir,shouldBeInStorage.dir);
    }

    @test('Find an internal loaded class in the repo')
    public testLoadedInternalClass() {
        const shouldBeInStorage = {
            as: 'InternalClass',
            dir: 'config',
            target: InternalClass,
            isEntry: false,
            parser: null,
            schema: {
                message: {
                    doc: 'An embedded config class',
                    default: 'blorb',
                    format: String
                }
            }
        };
        const theStorage = getMetaSchemaStorage();
        let isInStorage: any;
        assert.doesNotThrow(() => {
            isInStorage = theStorage.findByAlias('InternalClass');
        }, 'Should not get an error when finding the loaded internal class in the repo');

        /* console.log("In the storage");
        console.dir(isInStorage);
        console.log("Should be in storage");
        console.dir(shouldBeInStorage); */
        assert.deepStrictEqual(isInStorage,shouldBeInStorage);
        assert.strictEqual(
            isInStorage.as,
            shouldBeInStorage.as,
            'Expected the schemas to be the same.'
        );
        assert.strictEqual(isInStorage.dir,shouldBeInStorage.dir);
    }

    @test('Proper error when class not in repo')
    public noClassInRepo() {
        assert.throws(() => {
            return getMetaSchemaStorage().findByAlias('someNotRealClass')
        }, Error, 'An error should have been thrown if the class does not exist in the repo');
    }

}
