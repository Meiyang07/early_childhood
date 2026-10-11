// src/controllers/event.controller.ts
import type { Request, Response } from "express";
import { createEventSchema, eventIdParamSchema, listEventQuerySchema, updateEventSchema } from "../validators/event.js";
import {Event} from "../models/Event.js"


// ---------- CREATE ----------
export const createEvent = async (req: Request, res: Response) => {
  const data = createEventSchema.parse(req.body);
  const event = await Event.create(data);
  return res.status(201).json({
    success: true,
    message: "Event created successfully.",
    data: event,
  });
};

// ---------- LIST ----------
export const listEvents = async (req: Request, res: Response) => {
  const { search, status, from, to, when, page, limit } =
    listEventQuerySchema.parse(req.query);

  const filter: Record<string, any> = {};

  if (status !== "All") filter.status = status;

  // date range
  if (from || to) {
    filter.eventDate = {};
    if (from) filter.eventDate.$gte = from;
    if (to) filter.eventDate.$lte = to;
  }

  // upcoming / past relative to now
  const now = new Date();
  if (when === "upcoming") filter.eventDate = { ...(filter.eventDate || {}), $gte: now };
  if (when === "past") filter.eventDate = { ...(filter.eventDate || {}), $lt: now };

  // text search across title, details, location
  if (search && search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    filter.$or = [{ title: regex }, { details: regex }, { location: regex }];
  }

  const skip = (page - 1) * limit;

  // Sort: upcoming → soonest first; past → most recent first; default → newest created
  const sort: Record<string, 1 | -1> =
    when === "upcoming"
      ? { eventDate: 1 }
      : when === "past"
      ? { eventDate: -1 }
      : { createdAt: -1 };

  const [events, total] = await Promise.all([
    Event.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Event.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: "Events fetched successfully.",
    data: events,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
    filters: {
      search: search || null,
      status,
      when,
      from: from ?? null,
      to: to ?? null,
    },
  });
};

// ---------- GET BY ID ----------
export const getEventById = async (req: Request, res: Response) => {
  const { id } = eventIdParamSchema.parse(req.params);
  const event = await Event.findById(id).lean();
  if (!event) {
    return res
      .status(404)
      .json({ success: false, message: "Event not found." });
  }
  return res.status(200).json({ success: true, data: event });
};




// ---------- UPDATE ----------
export const updateEvent = async (req: Request, res: Response) => {
  const { id } = eventIdParamSchema.parse(req.params);
  const data = updateEventSchema.parse(req.body);

  const event = await Event.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!event) {
    return res
      .status(404)
      .json({ success: false, message: "Event not found." });
  }

  return res.status(200).json({
    success: true,
    message: "Event updated successfully.",
    data: event,
  });
};



// ---------- DELETE ----------
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = eventIdParamSchema.parse(req.params);
  const event = await Event.findByIdAndDelete(id).lean();
  if (!event) {
    return res
      .status(404)
      .json({ success: false, message: "Event not found." });
  }
  return res
    .status(200)
    .json({ success: true, message: "Event deleted successfully." });
};