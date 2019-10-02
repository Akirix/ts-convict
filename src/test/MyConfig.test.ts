/**
 * @module test/models
 */
import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import "mocha";
import MyConfig from './model/MyConfig';
import { ConvictModel } from '../index';
import { getMetaSchemaStorage } from '../index';
import SubConfig from "./model/SubConfig";

let builder: ConvictModel;

@suite
export class MyConfigTest {

    public static before() {
        // console.log('Running the MyConfig Test');
        builder = new ConvictModel([
            'src/test/model/**.*s'
        ]);
    }


    @test
    public testSchemaStorageHasSchemas() {

        const shouldBeInStorage = {
            as: 'foo',
            dir: 'config',
            target: MyConfig,
            isEntry: true,
            parser: null,
            schema: {
                name: {
                    doc: 'The name of the thing',
                    default: 'Convict',
                    env: 'MY_CONFIG_NAME'
                },
                subConfig: SubConfig
            }
        };

        const theStorage = getMetaSchemaStorage();
        const isInStorage: any = theStorage.findByAlias('foo');

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

    @test
    public testGettingValidConfigRecursed() {
        const myRawConfig: any = {
            name: 'Bubbles',
            subConfig: {
                foo: 4
            }
        };
        const myValidConfig: MyConfig = builder.createSimple<MyConfig>('foo', myRawConfig);
        console.log("My Valid config");
        console.dir(myValidConfig);
        //make sure we got a proper serialized type back
        assert.strictEqual(
            (myValidConfig instanceof MyConfig),
            true,
            'Expected the config to be an instance of MyConifg'
        );
        assert.strictEqual(
            myValidConfig.subConfig instanceof SubConfig,
            true,
            "The subconfig should be an instanceof SubConfig. It is of type: " + typeof myValidConfig.subConfig);

        //make sure the value in the config took precedence over the default
        assert.equal(
            myValidConfig.name,
            'Bubbles',
            'Expected the name to be Bubbles on MyConifg'
        );
    }

    @test.skip
    public testGettingValidDefaultConfig() {
        const myValidConfig: MyConfig = builder.create<MyConfig>('MyConfig');
        //make sure the value is set to the default value
        assert.equal(
            myValidConfig.name,
            'Convict',
            'Expected the name to be Bubbles on MyConifg'
        );
    }

}
