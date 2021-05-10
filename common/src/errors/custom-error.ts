export abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor (msg: string) {
        super(msg);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): { message: string; field?: string}[];
}