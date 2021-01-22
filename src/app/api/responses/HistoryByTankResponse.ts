import {PooAppResponse} from './PooAppResponse';
import {History} from '../pojo/History';


export class HistoryByTankResponse extends PooAppResponse {
    public history: History[];
}
