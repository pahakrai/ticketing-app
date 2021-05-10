import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {Ticket} from '../../models/ticket';
import {Order} from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { setOriginalNode } from 'typescript';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    return ticket;
}


it('fetches the order', async() => {
    // Create a tickets
    const ticket = await buildTicket();

    const user = global.signin();

    // Create oorder
    const {body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    // Make request to fetch the order
    const {body: fetchOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    // Make sure we only got the orders for User #2
    expect(fetchOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async() => {
    // Create a tickets
    const ticket = await buildTicket();

    const user = global.signin();

    // Create one order as User #1
    const {body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    // Make request to fetch the order
    const {body: fetchOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});
