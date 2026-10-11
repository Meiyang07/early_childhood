import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createTestimonialSchema, listTestimonialQuerySchema, testimonialIdParamSchema, updateTestimonialSchema, updateTestimonialStatusSchema } from "../validators/testimonial.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { createTestimonial, deleteTestimonial, listTestimonials, updateTestimonial, updateTestimonialStatus } from "../controllers/testimonials.controller.js";


export const testimonialRouter = Router();


testimonialRouter.post("/testimonial-create", requireAuth, requireRole("ADMIN"), validate({ body: createTestimonialSchema }), asyncHandler(createTestimonial));

// Update testimonial content
testimonialRouter.patch(
    "/testimonials/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate({
        params: testimonialIdParamSchema,
        body: updateTestimonialSchema,
    }),
    asyncHandler(updateTestimonial)
);




// Update only the status (approve / reject / revert to pending)
testimonialRouter.patch(
    "/testimonials/:id/status",
    requireAuth,
    requireRole("ADMIN"),
    validate({
        params: testimonialIdParamSchema,
        body: updateTestimonialStatusSchema,
    }),
    asyncHandler(updateTestimonialStatus)
);



// Delete
testimonialRouter.delete(
    "/testimonials/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate({ params: testimonialIdParamSchema }),
    asyncHandler(deleteTestimonial)
);


// Get endpoints
testimonialRouter.get("/list-testimonial", validate({ query: listTestimonialQuerySchema }), asyncHandler(listTestimonials))