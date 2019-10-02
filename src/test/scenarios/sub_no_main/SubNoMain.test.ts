/**
 * @module test/models
 */
import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import "mocha";
import SubNoMainParent from './SubNoMainParent.model';
import SubNoMainChild from "./SubNoMainChild.model";
import { getConvictModel, ConvictModel } from '../../../index';

let builder: ConvictModel;

/**
 * tests a model with a submodel but no Config annotation
 */
@suite('Test a config with a subconfig but no Config annotation')
export class SubNoMainTest {

    public static before() {
        // console.log('Running the MyConfig Test');
        builder = getConvictModel([
            'src/test/scenarios/sub_no_main/**.model.*s'
        ]);
    }

    @test('Get a valid config from json values')
    public validConfig() {
        const myRawConfig: any = {
            name: 'Bubbles',
            subConfig: {
                bar: 7
            }
        };
        const myValidConfig: SubNoMainParent = builder.createSimple<SubNoMainParent>('SubNoMainParent', myRawConfig);
        //make sure we got a proper serialized type back
        assert.strictEqual(
            (myValidConfig instanceof SubNoMainParent),
            true,
            'Expected the config to be an instance of MyConifg'
        );

        //make sure the value in the config took precedence over the default
        assert.strictEqual(
            myValidConfig.name,
            'Bubbles',
            'Expected the name to be Bubbles on MyConifg'
        );

        // make sure the subconfig class was properly instantiated
        assert.strictEqual(
            (myValidConfig.subConfig instanceof SubNoMainChild),
            true,
            'Expected the subconfig to be an instanceof SubConfig'
        );

        // make sure the value 7 was on bar
        assert.strictEqual(
            myValidConfig.subConfig.bar,
            7,
            'The bar should have been 7'
        );
    }

    @test('Gert a valid default config')
    public testGettingValidDefaultConfig() {
        const myValidConfig: SubNoMainParent = builder.createSimple<SubNoMainParent>('SubNoMainParent');
        //make sure the value is set to the default value
        assert.equal(
            myValidConfig.name,
            'Convict',
            'Expected the name to be Bubbles on MyConifg'
        );

        // make sure the subconfig class was properly instantiated
        assert.strictEqual(
            (myValidConfig.subConfig instanceof SubNoMainChild),
            true,
            'Expected the subconfig to be an instanceof SubConfig'
        );

        // make sure the value 7 was on bar
        assert.strictEqual(
            myValidConfig.subConfig.bar,
            0,
            'The bar should have been 0 as the default'
        );
    }

}
