import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@pr-tickets/common";
import { Message } from 'node-nats-streaming';
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Create,
        userId: 'asdffk',
        expiresAt: 'asdfff',
        ticket: {
            id: 'asdfasdf',
            price: 10
        }
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it('replicates the order info', async () => {
    const { listener,  data, msg } = await setup();
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { listener, data, msg }  = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});