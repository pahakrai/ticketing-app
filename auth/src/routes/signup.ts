import express, {Request, Response} from 'express';
import { body } from "express-validator";
import jwt from 'jsonwebtoken';

import { User } from "../models/user";
import { BadRequestError, validateRequest } from '@pr-tickets/common';

const router = express.Router();
router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters')
], validateRequest, async (req: Request, res: Response)  => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //      // return res.status(400).send(errors.array());
    //     // throw new Error('Invalid Email or Password');
    //     throw new RequestValidationError(errors.array())
    // }
    const {email, password} = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        console.log("User Exists");
        throw new BadRequestError("User Exists");
    }

    const user  = User.build({ email, password });
    await user.save();
     // if (!email || typeof email !== 'string') {
    //     res.status(400).send('Provide a valid email');
    // }
    // new User({email, password})

    // GENERATE JWT
    // if(!process.env.JWT_KEY) {
    //     throw new Error('laksjfd');
    // }
    const userJwt = jwt.sign(
        {
            id: user.id,
            email: user.email
        }, 
        process.env.JWT_KEY!
    );

    // store it on session object
    req.session = { jwt : userJwt};
   
    console.log("creating user");
  
    res.status(201).send(user);
});

export { router as signupRouter };