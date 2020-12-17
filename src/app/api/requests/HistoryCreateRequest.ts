export class HistoryCreateRequest implements PooAppRequest {
    public lat: number;
    public lon: number;
    public tank: number;


    constructor() {
        this.lat = 0;
        this.lon = 0;
        this.tank = 0;
    }

    getBody() {
        return {
            lat: this.lat,
            lon: this.lon,
            tank: this.tank
        };
    }

    validate(): boolean {
        const error = new Error();
        // @ts-ignore
        error.code = 'VAL_FAIL';
        if (this.lat <= 0 || this.lon <= 0 || this.tank <= 0) {
            error.message = 'fields_empty';
            throw error;
        }
        return true;
    }

    clean() {
        this.lat = 0;
        this.lon = 0;
        this.tank = 0;
    }

}
