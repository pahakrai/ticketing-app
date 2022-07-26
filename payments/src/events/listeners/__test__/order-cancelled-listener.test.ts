import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledEvent, OrderStatus } from "@pr-tickets/common";
import { Message } from 'node-nats-streaming';
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Create,
        price: 10,
        userId: 'asdfldlf',
        version: 0
    });
    await order.save();

    // Create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: 'asdfasdf'
        }
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order };
}

it('updates the status of the order', async () => {
    const { listener,  data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(data.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('acks the message', async () => {
    const { listener, data, msg }  = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});