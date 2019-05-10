import {Property, Config} from "../../";

@Config
export default class MyConfig {

    @Property({
        doc: 'The name of the thing',
        default: 'Convict',
        env: 'MY_CONFIG_NAME'
    })
    name: string;

}