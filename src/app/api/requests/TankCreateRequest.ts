export class TankCreateRequest implements PooAppRequest {
    public name: string;
    public plate: string;
    public type: number;


    constructor() {
        this.name = '';
        this.plate = '';
        this.type = 0;
    }

    getBody() {
        return {
            name: this.name,
            plate: this.plate,
            type: this.type
        };
    }

    validate(): boolean {
        const error = new Error();
        // @ts-ignore
        error.code = 'VAL_FAIL';
        if (!this.name && !this.type || this.type <=0) {
            error.message = 'fields_empty';
            throw error;
        }
        return true;
    }

    clean() {
        this.name = '';
        this.plate = '';
        this.type = 0;
    }

}
