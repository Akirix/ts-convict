import {Property, Config} from "../../../";
import WithMainChild from './WithMainChild.model';
import * as yaml from 'js-yaml';

@Config({
    as: 'foo',
    dir: 'src/test/data',
    parser: {
        extension: ['yml', 'yaml'],
        parse: yaml.safeLoad
    }
})
export default class WithMainParent {

    @Property({
        doc: 'The name of the thing',
        default: 'Convict',
        env: 'MY_CONFIG_NAME'
    })
    public name: string;

    @Property(WithMainChild)
    public subConfig: WithMainChild;

}
