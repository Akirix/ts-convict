/**
 * @module test/models
 */
import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import "mocha";
import MyConfig from './model/MyConfig';
import ConfigMetadataBuilder from '../ConfigMetadataBuilder';

@suite
export class MyConfigTest {
    
    public static before() {
        console.log('Running the MyConfig Test');
    }


    @test
    public testerupper() {
        assert.equal( 1, 1, "Expected to be 1" );
    }

    @test
    public testConfigLoader() {
        const builder: ConfigMetadataBuilder = new ConfigMetadataBuilder();
        builder.loadConfigClasses([
            'src/test/model/**/*.*s'
        ]);

        console.log(builder.create('foo'));

        assert.equal( 1, 1, "Expected to be 1" );
    }

}