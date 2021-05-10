import { Publisher, Subjects, TicketCreatedEvent } from '@pr-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
