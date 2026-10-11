// src/routes/event.routes.ts
import { Router } from "express";

import {
    createEvent,
    listEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} from "../controllers/event.controller.js";
import { validate } from "../middleware/validate.js";
import { createEventSchema, eventIdParamSchema, listEventQuerySchema, updateEventSchema } from "../validators/event.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const eventRouter = Router();

// ---------- LIST ----------
eventRouter.get(
    "/list-event",
    validate({ query: listEventQuerySchema }),
    asyncHandler(listEvents)
);

// ---------- CREATE ----------
eventRouter.post(
    "/create-event",
    requireAuth,
    requireRole("ADMIN"),
    validate({ body: createEventSchema }),
    asyncHandler(createEvent)
);

// ---------- GET BY ID ----------
eventRouter.get(
    "/:id",
    validate({ params: eventIdParamSchema }),
    asyncHandler(getEventById)
);

// ---------- UPDATE ----------
eventRouter.patch(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate({ params: eventIdParamSchema, body: updateEventSchema }),
    asyncHandler(updateEvent)
);

// ---------- DELETE ----------
eventRouter.delete(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate({ params: eventIdParamSchema }),
    asyncHandler(deleteEvent)
);

export default eventRouter;