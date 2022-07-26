import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus, TicketCreatedEvent } from "@pr-tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order } from '../../../models/order';

const setup = async () => {
    //  crate an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = await Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const order = await Order.build({
        status: OrderStatus.Create,
        userId: 'asdff',
        expiresAt: new Date(),
        ticket
    });
    await order.save();

     // crate fake data event
     const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, ticket, order, data, msg};
};


it('updates the order status to cancelled', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an order cancelled event', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});