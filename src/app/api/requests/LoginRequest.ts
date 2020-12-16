export class LoginRequest implements PooAppRequest {
    public email: string;
    public password: string;


    constructor() {
        this.email = '';
        this.password = '';
    }

    getBody() {
        return {
            email: this.email,
            password: this.password
        };
    }

    validate(): boolean {
        const error = new Error();
        // @ts-ignore
        error.code = 'VAL_FAIL';
        if (!this.email && !this.password) {
            error.message = 'fields_empty';
            throw error;
        }
        return true;
    }

    clean() {
        this.email = '';
        this.password = '';
    }

}
