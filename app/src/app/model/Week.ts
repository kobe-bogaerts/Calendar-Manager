import { EventInput } from '@fullcalendar/core';

export interface Week{
    uid?: string;
    beginDate: any;
    endDate: any;
    data: EventInput[];
}