import {Property, Config} from "../../";
import SubConfig from './SubConfig'

@Config({
    as: 'foo'
})
export default class MyConfig {

    @Property({
        doc: 'The name of the thing',
        default: 'Convict',
        env: 'MY_CONFIG_NAME'
    })
    public name: string;

    @Property(
        () => SubConfig
    )
    public subConfig: SubConfig;

}
