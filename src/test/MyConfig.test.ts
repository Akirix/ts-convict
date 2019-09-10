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

const builder: ConvictModel = new ConvictModel();

@suite
export class MyConfigTest {

    public static before() {
        // console.log('Running the MyConfig Test');
        builder.loadConfigClasses([
            'src/test/model/**.*s'
        ]);
    }


    @test
    public testSchemaStorageHasSchemas() {

        const shouldBeInStorage = {
            name: {
                doc: 'The name of the thing',
                default: 'Convict',
                env: 'MY_CONFIG_NAME'
            },
            "subConfig": SubConfig
        };

        const theStorage = getMetaSchemaStorage();
        const isInStorage = theStorage.getClassSchema('MyConfig');

        /*console.log("In the storage");
        console.dir(isInStorage);
        console.log("Should be in storage");
        console.dir(shouldBeInStorage);*/

        assert.deepStrictEqual(
            shouldBeInStorage.name,
            isInStorage.name,
            'Expected the schemas to be the same.'
        );
    }

    @test
    public testTheClassWasSavedAndRetrievable() {
        assert.deepEqual(
            builder.getClass('MyConfig'),
            MyConfig,
            'Expected the class to be an instance of MyConfig'
        );
    }

    @test
    public testGettingValidConfig() {
        const myRawConfig: MyConfig = {
            name: 'Bubbles',
            subConfig: {
                foo: 4
            }
        };
        const myValidConfig: MyConfig = builder.create<MyConfig>('MyConfig', myRawConfig);
        // console.log("My Valid config");
        // console.dir(myValidConfig);
        //make sure we got a proper serialized type back
        assert.strictEqual(
            (myValidConfig instanceof MyConfig),
            true,
            'Expected the config to be an instance of MyConifg'
        );
        assert.strictEqual(myValidConfig.subConfig instanceof SubConfig, true, "The subconfig should be an instanceof SubConfig. It is of type: " + typeof myValidConfig.subConfig);

        //make sure the value in the config took precedence over the default
        assert.equal(
            myValidConfig.name,
            'Bubbles',
            'Expected the name to be Bubbles on MyConifg'
        );
    }

    @test
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