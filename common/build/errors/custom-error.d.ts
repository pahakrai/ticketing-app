export declare abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor(msg: string);
    abstract serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
