import { Publisher, Subjects, TicketUpdatedEvent } from '@pr-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
