import {Property} from "../../../";

export default class DifferentTypes {

    @Property({
        doc: 'The name of the thing',
        default: 'Convict'
    })
    public name: string;

    @Property({
        doc: 'The amount of days till the apocalypse',
        format: "int",
        default: 1
    })
    public daysTillApocalypse: number;

    @Property({
        doc: 'The host',
        default: '127.0.0.1',
        format: "ipaddress"
    })
    public host: string;

    @Property({
        doc: 'some port',
        default: 8080,
        format: "port"
    })
    public port: number;

}
