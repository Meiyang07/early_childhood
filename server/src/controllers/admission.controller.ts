// src/controllers/application.controller.ts
import type { Request, Response } from "express";
import { HttpError } from "../middleware/errorHandler.js";
import type { QueryFilter } from "mongoose";
import type { CreateApplicationInput, ListApplicationQuery } from "../validators/addmission.js";
import Admission, { type IApplication } from "../models/Admission.js";





function escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}




/**
 * @desc    Submit a new admission application
 * @route   POST /api/applications
 * @access  Public
 */
export async function createApplication(
    req: Request,
    res: Response
): Promise<void> {
    // 1. Data has already been validated by the `validate` middleware,
    //    but we cast it here for TypeScript's benefit.
    const validatedData = req.body as CreateApplicationInput;

    // 2. Optional: Prevent duplicate applications for the same child by the same parent
    const existing = await Admission.findOne({
        "childInfo.fullName": validatedData.childInfo.fullName,
        "childInfo.dateOfBirth": validatedData.childInfo.dateOfBirth,
        "guardianInfo.email": validatedData.guardianInfo.email,
    }).lean();

    if (existing) {
        throw new HttpError(
            409,
            "An application for this child has already been submitted by this email."
        );
    }

    // 3. Create the Application
    const application = await Admission.create(validatedData);

    res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: application,
    });
}







/**
 * @desc    Get all applications (Admin Dashboard)
 * @route   GET /api/applications
 * @access  Private (Admin)
 */
export async function getAllApplications(
    req: Request,
    res: Response
): Promise<void> {



    const { search, status, program } = req.query as unknown as ListApplicationQuery;



    // ---- Filtered query (what the grid shows) ----
    const filter: QueryFilter<IApplication> = {};

    if (status && status !== "All") {
        filter.status = status;
    }

    if (program && program !== "All") {
        filter["childInfo.applyingForProgram"] = program;
    }

    if (search) {
        const rx = new RegExp(escapeRegex(search), "i");
        filter.$or = [
            { "childInfo.fullName": rx },
            { "guardianInfo.fullName": rx },
            { "guardianInfo.email": rx },
            { "guardianInfo.phoneNumber": rx },
        ];
    }

    const [applications, countAgg] = await Promise.all([
        Admission.find(filter)
            .sort({ submittedAt: -1 }) // Newest first
            .lean(),
        // Global counts for the status tab badges (unaffected by search filter)
        Admission.aggregate<{ _id: string; count: number }>([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
    ]);

    // Map the aggregation results into a friendly object
    const byStatus = countAgg.reduce<Record<string, number>>((acc, c) => {
        acc[c._id] = c.count;
        return acc;
    }, {});

    const counts = {
        All: Object.values(byStatus).reduce((a, b) => a + b, 0),
        Pending: byStatus.Pending ?? 0,
        Reviewed: byStatus.Reviewed ?? 0,
        Accepted: byStatus.Accepted ?? 0,
        Rejected: byStatus.Rejected ?? 0,
        Waitlisted: byStatus.Waitlisted ?? 0,
    };

    res.status(200).json({
        success: true,
        data: { applications, counts },
    });
}



export async function deleteApplication(
  req:Request,
  res: Response
): Promise<void> {
  

  

  // 3. Validate application ID
  const { id: applicationId } = req.params;

  if (!applicationId) {
    throw new HttpError(400, 'Application ID is required.');
  }

 

  // 4. Find and delete atomically
  const deletedApplication = await Admission.findOneAndDelete({
    _id:applicationId,
  }).lean();

  // 5. Handle not found
  if (!deletedApplication) {
    throw new HttpError(404, 'Application not found.');
  }

  

  // 7. Success response
  res.status(200).json({
    success: true,
    message: 'Application deleted successfully.',
    data: {
      applicationId,
      deletedAt: new Date().toISOString(),
    },
  });
}