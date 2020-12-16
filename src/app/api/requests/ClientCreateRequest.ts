export class ClientCreateRequest implements PooAppRequest {
    public email: string;
    public password: string;
    public name: string;


    constructor() {
        this.email = '';
        this.password = '';
        this.name = '';
    }

    getBody() {
        return {
            email: this.email,
            password: this.password,
            name: this.name
        };
    }

    validate(): boolean {
        const error = new Error();
        // @ts-ignore
        error.code = 'VAL_FAIL';
        if (!this.email && !this.password && !this.name) {
            error.message = 'fields_empty';
            throw error;
        }
        return true;
    }

    clean() {
        this.email = '';
        this.password = '';
        this.name = '';
    }

}
