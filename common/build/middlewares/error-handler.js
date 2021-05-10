"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var custom_error_1 = require("../errors/custom-error");
// import { DatabaseConnectionError } from "../errors/database-connection-error";
// import { RequestValidationError } from "../errors/request-validation-error";
var errorHandler = function (err, req, res, next) {
    console.log('Something went wrong', err);
    // { errors: { message: string, field?:string}[]}
    // if (err instanceof RequestValidationError) {
    //     console.log('handling error as request validation eerror');
    //     const formattedErrors = err.errors.map(error => ({
    //         message: error.msg, field: error.param
    //     }))
    //     // return res.status(400).send({errors: formattedErrors});
    //     return res.status(err.statusCode).send({errors: err.serializeErrors()});
    // }
    // if (err instanceof DatabaseConnectionError) {
    //     console.log('handling error as db connection error')
    //     // return res.status(500).send({errors: [{ message: err.reason}]});
    //     return res.status(err.statusCode).send({errors: err.serializeErrors()});
    // }
    if (err instanceof custom_error_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    console.error(err);
    res.status(400).send({
        errors: [{ message: err.message || 'something went wrong' }]
    });
};
exports.errorHandler = errorHandler;
