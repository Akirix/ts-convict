/**
 * @module test/models
 */
import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import "mocha";
import { getConvictModel, ConvictModel } from '../../../index';
import DifferentTypes from './DifferentTypes.model';

let builder: ConvictModel;

@suite('Test a config with different types all set incorrectly')
export class DifferentTypesTest {

    public static before() {
        // console.log('Running the MyConfig Test');
        builder = getConvictModel([
            'src/test/scenarios/different_types/**.model.*s'
        ]);
    }

    @test('Test to make sure all the default values are valid')
    public testDefaultTypes() {
        let config: DifferentTypes;
        assert.doesNotThrow(() => {
            config = builder.createSimple('DifferentTypes');
        }, 'The default values should not give an error');
        assert.strictEqual(config.name,'Convict', 'The port should be Convict');
        assert.strictEqual(config.daysTillApocalypse,1, 'The daysTillApocalypse should be 1');
        assert.strictEqual(config.host,'127.0.0.1', 'The host should be 127.0.0.1');
        assert.strictEqual(config.port,8080, 'The port should be 8080');
    }

    @test('Test when value is of type string')
    public testStringType() {

        // make sure a valid value can be given
        // first make sure a valid config with an int can be given
        assert.doesNotThrow(() => {
            builder.createSimple('DifferentTypes', {
                name: 'chicken'
            });
        }, 'The value was a string so there should not be an error');

        assert.throws(() => {
            try {
                builder.createSimple('DifferentTypes', {
                    name: 3
                });
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'name:  should be of type String: value was 3'
                );
                throw error;
            }
        }, 'There should be an error since name should be a string');
    }

    @test('Test when value is of type int')
    public testIntType() {

        // first make sure a valid config with an int can be given
        assert.doesNotThrow(() => {
            builder.createSimple('DifferentTypes', {
                daysTillApocalypse: 5
            });
        }, 'The value was an int so there should not be an error');

        // make sure you don't get an int error because we gave a negative number
        assert.doesNotThrow(() => {
            builder.createSimple('DifferentTypes', {
                daysTillApocalypse: -7
            });
        }, 'There should not be an error since daysTillApocalypse was given a negative');

        // make sure you get a not an int error because we gave a string
        assert.throws(() => {
            try {
                builder.createSimple('DifferentTypes', {
                    daysTillApocalypse: 'not a number'
                });
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'daysTillApocalypse: must be an integer'
                );
                throw error;
            }
        }, 'There should be an error since daysTillApocalypse was given a string');

        // make sure you get a not an int error because we gave a double
        assert.throws(() => {
            try {
                builder.createSimple('DifferentTypes', {
                    daysTillApocalypse: 3.2
                });
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'daysTillApocalypse: must be an integer'
                );
                throw error;
            }
        }, 'There should be an error since daysTillApocalypse was given a double');

    }

    @test('Test when values is of type ipaddress')
    public testIpType() {

        // now make sure a valid IP can be given to host
        assert.doesNotThrow(() => {
            builder.createSimple('DifferentTypes',{
                host: '72.210.64.112'
            });
        }, 'The value was a valid IP so there should be no error');

        // now make sure the ipaddress type does not allow some jibberish
        assert.throws(() => {
            try {
                builder.createSimple('DifferentTypes', {
                    host: 'somejibberish'
                });
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'host: must be an IP address: value was "somejibberish"'
                );
                throw error;
            }
        }, 'There should be an error because host was set to somejibberish');
    }

    @test('Test when value is of type port')
    public testPortType() {

        // now make sure a valid port can be given to port
        assert.doesNotThrow(() => {
            builder.createSimple('DifferentTypes',{
                port: 5050
            });
        }, '5050 is a valid port so there should be no error');

        // make sure port as a string works too
        assert.doesNotThrow(() => {
            builder.createSimple('DifferentTypes',{
                port: "3020"
            });
        }, '3020 is a valid port as a string so there should be no error');

        // now make sure the port type does not allow some jibberish
        assert.throws(() => {
            try {
                builder.createSimple('DifferentTypes', {
                    port: 'somejibberish'
                });
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'port: ports must be within range 0 - 65535'
                );
                throw error;
            }
        }, 'There should be an error because port was set to somejibberish');

        // make sure we can't set a port out of range
        assert.throws(() => {
            try {
                builder.createSimple('DifferentTypes', {
                    port: 66535
                });
            } catch (error) {
                assert.strictEqual(
                    error.message,
                    'port: ports must be within range 0 - 65535'
                );
                throw error;
            }
        }, 'The port should have an error because 66535 is greater than 65535');

    }

}
