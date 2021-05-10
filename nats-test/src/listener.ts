import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import {TicketCreatedListener} from './events/ticket-created-listener';

console.clear();
const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

client.on('connect', () => {
    console.log('Listener connected to NATS');


    client.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    // const options = client
    //     .subscriptionOptions()
    //     .setManualAckMode(true)
    //     .setDeliverAllAvailable()
    //     .setDurableName('accounting-service');
    // const subscription = client.subscribe('ticket:created',
    //  'orders-service-queue-group',
    //   options);

    // subscription.on('message', (msg: Message) => {
    //     console.log('Message Received');
    //     const data = msg.getData();
    //     if (typeof data === 'string') {
    //         console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
    //     }

    //     msg.ack();
    // });

    new TicketCreatedListener(client).listen();
});

process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());




