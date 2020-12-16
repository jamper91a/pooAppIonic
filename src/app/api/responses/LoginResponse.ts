import {PooAppResponse} from './PooAppResponse';
import {User} from '../pojo/User';


export class LoginResponse extends PooAppResponse {
    public user: User;
    public token: string;
}
