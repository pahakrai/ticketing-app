import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";
// import { RequestValidationError } from "../errors/request-validation-error";


export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
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

    if(err instanceof CustomError) {
        return res.status(err.statusCode).send({errors: err.serializeErrors()});
    }

    console.error(err);
    
    res.status(400).send({
        errors: [{ message: err.message || 'something went wrong'}]
    });
};