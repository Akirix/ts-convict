import {Property, Config} from "../../";

@Config
export default class SubConfig {

    @Property({
        doc: 'The foo',
        default: 0,
        env: 'SUB_CONFIG_FOO'
    })
    public foo: number;

}