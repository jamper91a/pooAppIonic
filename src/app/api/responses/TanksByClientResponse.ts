import {PooAppResponse} from './PooAppResponse';
import {History} from '../pojo/History';
import {Tank} from '../pojo/Tank';

class TankAux extends Tank{
    public history: History;
    public lastTime: History;
}
export class TanksByClientResponse extends PooAppResponse {
    public tanks: TankAux[];
}
