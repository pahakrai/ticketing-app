import express, { Request, Response } from 'express';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@pr-tickets/common';
import {body} from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

const router = express.Router();

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Run query to look at all order. Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.
    // if we find an order from that means the ticket *is* reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError("Ticket is already reserved");
    }

    // calculate the expiration time for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the databse
    const order = Order.build({
        userId: req.currentUser?.id,
        status: OrderStatus.Create,
        expiresAt: expiration,
        ticket
    });
    await order.save();

    // publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    });

    res.status(201).send(order);
});

export { router as newOrderRouter};