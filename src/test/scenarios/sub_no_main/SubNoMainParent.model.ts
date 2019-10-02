import {Property} from "../../../";
import SubNoMainChild from './SubNoMainChild.model';

export default class SubNoMainParent {

    @Property({
        doc: 'The name of the thing',
        default: 'Convict',
        env: 'MY_CONFIG_NAME'
    })
    public name: string;

    @Property(SubNoMainChild)
    public subConfig: SubNoMainChild;

}
