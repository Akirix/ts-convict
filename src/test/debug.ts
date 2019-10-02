import { ConvictModel } from '../index';

const builder: ConvictModel = new ConvictModel([
    'src/test/scenarios/**/**.model.*s'
]);;

const myRawConfig: any = {
    name: 'Bubbles',
    subConfig: {
        foo: 4
    }
};

const convictSchema: any = builder.getSchemaFor('SubNoMainParent');
console.log('The convict schema');
console.dir(convictSchema);

const myValidConfig = builder.create('SubNoMainParent', myRawConfig);

console.log('Got a valid config');
console.dir(myValidConfig);
