import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {Ticket} from '../../models/ticket';
import {Order, OrderStatus} from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    return ticket;
}


it('marks an order as cancelled', async() => {
    // Create three tickets
    const ticket = await buildTicket();

    const user = global.signin();

    // Create one order 
    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
        ticketId: ticket.id
    })
    .expect(201);

    // Make request to fetch the order
    const {body: deletedOrder} = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

    // expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


it('emits a order cancelled event', async () => {
   
    // Create three tickets
    const ticket = await buildTicket();

    const user = global.signin();

    // Create one order 
    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
        ticketId: ticket.id
    })
    .expect(201);

    // Make request to fetch the order
    const {body: deletedOrder} = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});