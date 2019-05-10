/**
 * @module test/models
 */
import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import "mocha";
import MyConfig from './model/MyConfig';
import ConvictModel from '../ConvictModel';
import {getMetaSchemaStorage} from '../index';

const builder: ConvictModel = new ConvictModel();

@suite
export class MyConfigTest {
    
    public static before() {
        console.log('Running the MyConfig Test');
        builder.loadConfigClasses([
            'src/test/model/MyConfig.*s'
        ]);
    }


    @test
    public testSchemaStorageHasSchemas() {

        const shouldBeInStorage = {
            name: {
                doc: 'The name of the thing',
                default: 'Convict',
                env: 'MY_CONFIG_NAME'
            }
        };

        const theStorage = getMetaSchemaStorage();
        const isInStorage = theStorage.getClassSchema('MyConfig');

        assert.deepEqual(
            shouldBeInStorage,
            isInStorage, 
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
        const myRawConfig = {
            name: 'Bubbles'
        };
        const myValidConfig: MyConfig = builder.create<MyConfig>('MyConfig',myRawConfig);
        
        //make sure we got a prooper serialized type back
        assert.equal(
            (myValidConfig instanceof MyConfig),
            true,
            'Expected the config to be an instance of MyConifg'
        );

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