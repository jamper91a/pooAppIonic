/* tslint:disable */
import {PooAppPojo} from './PooAppPojo';
import {Group} from './Group';
import {Client} from './Client';

export class User extends PooAppPojo {
    public email: string;
    public password: string;
    public name: string;
    public client: Client;
    public group: Group;



}
