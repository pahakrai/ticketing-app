import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';

import { currentUser, errorHandler, NotFoundError } from '@pr-tickets/common';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';


const app = express();
// to make sure express is aware it is behind proxy of ingress nginx
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);
app.use(currentUser);
app.use(createChargeRouter);


// // without async
// app.all('*', () => {
//     throw new NotFoundError();
// });

// // with async
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// });

// with async and import express-async-errors
// as without express-async-errors would throw error
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export  { app };