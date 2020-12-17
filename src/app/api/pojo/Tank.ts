/* tslint:disable */
import {PooAppPojo} from './PooAppPojo';
import {Group} from './Group';
import {Client} from './Client';
import {TankType} from './TankType';

export class Tank extends PooAppPojo {
    public name: string;
    public noUse: Date;
    public client: Client;
    public plate: string;
    public tankType: TankType;



}
