// src/lib/public.api.ts
import { StaffUser } from "@/types/staff";
import { Envelop } from "./admin.api";
import { api } from "./api";
import { CreateAdmissionEnvelop, CreateAdmissionPayload, CreateAdmissionResponse } from "@/types/adimission";
import {  ListTestimonialParams, ListTestimonialResponse } from "@/types/testimonial";
import { ListProgramParams, ListProgramsResponse } from "@/types/program";
import { ListPhotoParams, ListPhotosResponse, Photo } from "@/types/photo";
import { EventDetails, EventRecord, ListEventParams, ListEventsResponse } from "@/types/event";
import { Blog, ListBlogParams, ListBlogsResponse } from "@/types/blog";

export interface ListStaffParams {
  search?: string;
  role?: string;   // "All" | "Admins" | "Teachers" | "Operators"
  status?: string; // "All" | "Active" | "Inactive"
}

export interface StaffCounts {
  All: number;
  Admins: number;
  Teachers: number;
  Operators: number;
}

export interface ListStaffResponse {
  staff: StaffUser[];
  counts: StaffCounts;
}

export const listStaffRequest = async (
  params: ListStaffParams = {},
): Promise<ListStaffResponse> => {
  const { data } = await api.get<Envelop<ListStaffResponse>>(
    "/staff/staff-all",
    { params },
  );
  return data.data;
};






// this is the public api http post request 
export const AddAdmission = async (
  payload: CreateAdmissionPayload,
): Promise<CreateAdmissionResponse> => {
  const { data } = await api.post<CreateAdmissionEnvelop>(
    "/addmission/create-adimission",
    payload,
  );
  return data.data;
}



// ===================== Testimonial list ===============================

// this is the public api request for list testimonial
export const listTestimonialsRequest = async (
  params: ListTestimonialParams = {},
): Promise<ListTestimonialResponse> => {
  const { data } = await api.get<ListTestimonialResponse>(
    "/testimonial/list-testimonial",
    { params },
  );
  return data;
};




// ========================= program public api start from here ============================
export const listProgramRequest = async (params: ListProgramParams = {}): Promise<ListProgramsResponse> => {
  const { data } = await api.get<ListProgramsResponse>("/programs/list-program", { params });
  return data;
}





// =============================== photos public api start from here ==============================
export const listPhotosRequest = async (
  params: ListPhotoParams = {},
): Promise<ListPhotosResponse> => {
  const { data } = await api.get<ListPhotosResponse>(
    "photo/list-photo",
    { params },
  );
  return data;
};



/** GET /photo/:id */
export const getPhotoByIdRequest = async (id: string): Promise<Photo> => {
  const { data } = await api.get<Photo>(`/photo/single-photo/${id}`);
  return data;
};




// ==================== public api request of event is start from here =====================
export const listEventsRequest = async (
  params: ListEventParams = {},
): Promise<ListEventsResponse> => {
  const { data } = await api.get<ListEventsResponse>(
    `/events/list-event`,
    { params },
  );
  return data;
};

/** GET /events/singe-event/:id  (note: the route name has a typo — "singe", not "single") */
export const getEventByIdRequest = async (id: string): Promise<EventRecord> => {
  const { data } = await api.get<EventDetails>(
    `/events/single-event/${id}`,
  );

  
  return data.data;
};



// ============================== public blog api start from here =======================
export const listBlogsRequest = async (
  params: ListBlogParams = {},
): Promise<ListBlogsResponse> => {
  const { data } = await api.get<ListBlogsResponse>(
    `/blog/list-blog`,
    { params },
  );
  return data;
};

/** GET /blog/:id  (adjust the path to match your actual route) */
export const getBlogByIdRequest = async (id: string): Promise<Blog> => {
  const { data } = await api.get<Envelop<Blog>>(`/blog/single-blog/${id}`);
  return data.data;
};
