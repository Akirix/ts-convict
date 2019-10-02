/**
 * @module test/models
 */
import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import "mocha";
import SimpleFlat from './SimpleFlat.model';
import { getConvictModel, ConvictModel } from '../../../index';

let builder: ConvictModel;

@suite('Test a config with only simple values')
export class SimpleFlatTest {

    public static before() {
        // console.log('Running the MyConfig Test');
        builder = getConvictModel([
            'src/test/scenarios/simple_flat/**.model.*s'
        ]);
    }

    @test('Test getting a simple flat config')
    public validConfig() {
        const myRawConfig: any = {
            name: 'Bubbles'
        };
        const myValidConfig: SimpleFlat = builder.createSimple<SimpleFlat>('SimpleFlat', myRawConfig);
        //make sure we got a proper serialized type back
        assert.strictEqual(
            (myValidConfig instanceof SimpleFlat),
            true,
            'Expected the config to be an instance of MyConifg'
        );

        //make sure the value in the config took precedence over the default
        assert.strictEqual(
            myValidConfig.name,
            'Bubbles',
            'Expected the name to be Bubbles on MyConifg'
        );
    }

    @test('Test getting a simple flat default config')
    public testGettingValidDefaultConfig() {
        const myValidConfig: SimpleFlat = builder.createSimple<SimpleFlat>('SimpleFlat');
        //make sure we got a proper serialized type back
        assert.strictEqual(
            (myValidConfig instanceof SimpleFlat),
            true,
            'Expected the config to be an instance of MyConifg'
        );
        //make sure the value is set to the default value
        assert.equal(
            myValidConfig.name,
            'Convict',
            'Expected the name to be Bubbles on MyConifg'
        );
    }

}
