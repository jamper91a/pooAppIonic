export class HistoryGetByTankRequest implements PooAppRequest {
    public tank: number;


    constructor() {
        this.tank = 0;
    }

    getBody() {
        return {
            tank: this.tank
        };
    }

    validate(): boolean {
        const error = new Error();
        // @ts-ignore
        error.code = 'VAL_FAIL';
        if (this.tank <= 0) {
            error.message = 'fields_empty';
            throw error;
        }
        return true;
    }

    clean() {
        this.tank = 0;
    }

}
