// src/types/event.ts

export const EVENTS_KEY = "events";

export type EventStatus = "published" | "draft";
export type EventWhenFilter = "All" | "upcoming" | "past";

// ⬅ renamed from Event to EventRecord to avoid collision with the DOM Event
export interface EventRecord {
  _id: string;
  title: string;
  eventDate: string;
  time: string;
  location: string;
  details: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListEventParams {
  search?: string;
  status?: "All" | EventStatus;
  when?: EventWhenFilter;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface ListEventsResponse {
  success: boolean;
  message: string;
  data: EventRecord[];
  pagination: Pagination;
  filters: {
    search: string | null;
    status: string;
    when: string;
    from: string | null;
    to: string | null;
  };
}

export interface CreateEventPayload {
  title: string;
  eventDate: string;
  time: string;
  location: string;
  details: string;
  status?: EventStatus;
}


export interface EventDetails{
  success:true,
  data:EventRecord,
}


export type UpdateEventPayload = Partial<CreateEventPayload>;

export interface UpdateEventStatusPayload {
  status: EventStatus;
}