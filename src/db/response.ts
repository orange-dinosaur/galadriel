export class DbResponse {
    status: number;
    message: string;
    data?: any;

    constructor(status: number, message: string, data?: any) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    toPlainObject() {
        return {
            status: this.status,
            message: this.message,
            data: this.data,
        };
    }
}
