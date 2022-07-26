import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@pr-tickets/common';
import cookieSession from 'cookie-session';

const app = express();
// to make sure express is aware it is behind proxy of ingress nginx
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false // process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

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
    console.log("check error wat");
    throw new NotFoundError();
});

app.use(errorHandler);

export  { app };