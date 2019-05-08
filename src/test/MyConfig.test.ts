/**
 * @module test/models
 */
import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import "mocha";
import MyConfig from './model/MyConfig';

@suite
export class MyConfigTest {
    public static before() {
        console.log('Running the MyConfig Test');
    }


    @test
    public testerupper() {
        assert.equal( 1, 1, "Expected to be 1" );
    }

}