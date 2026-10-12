import { CreateStaffInput, StaffUser } from "@/types/staff";
import { api } from "./api";
import { ListAdmissionResponse } from "@/types/adimission";
import { CreateTestimonialPayload, Testimonial, UpdateTestimonialPayload, UpdateTestimonialStatusPayload } from "@/types/testimonial";
import { CreateProgramPayload, Program, UpdateProgramPayload, UpdateProgramStatusPayload } from "@/types/program";
import { CreatePhotoPayload, Photo, ReplacePhotoImagePayload, UpdatePhotoPayload } from "@/types/photo";
import { CreateEventPayload, EventRecord, UpdateEventPayload } from "@/types/event";
import { Blog, CreateBlogPayload, ReplaceBlogImagePayload, UpdateBlogPayload } from "@/types/blog";

export interface Envelop<T> {
  success: boolean;
  data: T;
}


export interface LisAdmissionParams {
  search?: string;
  program?: string;   // "All" | "Admins" | "Teachers" | "Operators"
  status?: string; // "All" | "Active" | "Inactive"
}

export const createStaffRequest = async (
  input: CreateStaffInput,
): Promise<StaffUser> => {
  const form = new FormData();
  form.append("fullName", input.fullName);
  form.append("email", input.email);
  form.append("password", input.password);
  form.append("role", input.role);
  form.append("about", input.about);
  form.append("status", input.status);
  form.append("image", input.image);

  const { data } = await api.post<Envelop<{ staff: StaffUser }>>("/staff", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.staff;
};



export const ListAddmissionRecordsRequest = async (
  params: LisAdmissionParams = {}
): Promise<ListAdmissionResponse> => {
  const { data } = await api.get<Envelop<ListAdmissionResponse>>(
    "/addmission/all-adimission",
    { params }
  );
  return data.data;
};


export const deleteAdmissionRequest = async (id: string): Promise<void> => {
  await api.delete(`/addmission/application/delete/${id}`);
};




// ============================ admin testimonial api request =========================================

// this is the admin http sequest
export const createTestimonialRequest = async (
  payload: CreateTestimonialPayload,
): Promise<Testimonial> => {
  const { data } = await api.post<Envelop<Testimonial>>(
    `/testimonial/create-testimonial`,
    payload,
  );
  return data.data;
};


// this is the admin http sequest
/** PATCH /testimonial/:id */
export const updateTestimonialRequest = async (
  id: string,
  payload: UpdateTestimonialPayload,
): Promise<Testimonial> => {
  const { data } = await api.patch<Envelop<Testimonial>>(
    `/testimonial/update/${id}`,
    payload,
  );
  return data.data;
};



// this is the admin http sequest
/** PATCH /testimonial/:id/status */
export const updateTestimonialStatusRequest = async (
  id: string,
  payload: UpdateTestimonialStatusPayload,
): Promise<Testimonial> => {
  const { data } = await api.patch<Envelop<Testimonial>>(
    `/testimonial/testimonials/${id}/status`,
    payload,
  );
  return data.data;
};


// this is the admin http sequest
/** DELETE /testimonial/:id */
export const deleteTestimonialRequest = async (id: string): Promise<void> => {
  await api.delete(`/testimonial/delete/${id}`);
};






// ====================================== create programs ==============================================


export const createProgramRequest = async (
  payload: CreateProgramPayload,
): Promise<Program> => {
  const { data } = await api.post<Envelop<Program>>(
    `/programs/create-program`,
    payload,
  );
  return data.data;
};


export const updadteProgramRequest = async (id: string, payload: UpdateProgramPayload,): Promise<Program> => {
  const { data } = await api.patch<Envelop<Program>>(`/programs/update/${id}`, payload);
  return data.data
}






// this is the admin http sequest
/** DELETE /testimonial/:id */
export const deleteProgramRequest = async (id: string): Promise<void> => {
  await api.delete(`/testimonial/delete/${id}`);
};




// ==================== photos api is starting from here only admin can perfrom this tasks=======================
export const createPhotoRequest = async (
  payload: CreatePhotoPayload,
): Promise<Photo> => {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("category", payload.category);
  form.append("imageDescription", payload.imageDescription);
  if (payload.status) form.append("status", payload.status);
  form.append("image", payload.image);

  const { data } = await api.post<{ success: boolean; message: string; data: Photo }>(
    "/photo/create-photo",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
};





export const updatePhotoRequest = async (
  id: string,
  payload: UpdatePhotoPayload,
): Promise<Photo> => {
  const { data } = await api.patch<{ success: boolean; message: string; data: Photo }>(
    `/photo/update/${id}`,
    payload,
  );
  return data.data;
};





export const replacePhotoImageRequest = async (
  id: string,
  payload: ReplacePhotoImagePayload,
): Promise<Photo> => {
  const form = new FormData();
  form.append("image", payload.image);

  const { data } = await api.patch<{ success: boolean; message: string; data: Photo }>(
    `/photo/replace/${id}/image`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
};




export const deletePhotoRequest = async (id: string): Promise<void> => {
  await api.delete(`/photo/delete/${id}`);
};




// ============================== events api only for admin is start from here=======================================
export const createEventRequest = async (
  payload: CreateEventPayload,
): Promise<EventRecord> => {
  const { data } = await api.post<Envelop<EventRecord>>(
    `/events/create-event`,
    payload,
  );
  return data.data;
};

/** PATCH /events/update/:id  (ADMIN only) */
export const updateEventRequest = async (
  id: string,
  payload: UpdateEventPayload,
): Promise<EventRecord> => {
  const { data } = await api.patch<Envelop<EventRecord>>(
    `/events/update/${id}`,
    payload,
  );
  return data.data;
};

/** DELETE /events/delete/:id  (ADMIN only) */
export const deleteEventRequest = async (id: string): Promise<void> => {
  await api.delete(`/events/delete/${id}`);
};

// ========================= admin blog api start from here ===========================
export const createBlogRequest = async (
  payload: CreateBlogPayload,
): Promise<Blog> => {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("postDate", payload.postDate);
  form.append("author", payload.author);
  form.append("shortIntroduction", payload.shortIntroduction);
  form.append("article", payload.article);
  if (payload.status) form.append("status", payload.status);
  form.append("image", payload.image);

  const { data } = await api.post<Envelop<Blog>>(
    `/blog/create-blog`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
};

/** PATCH /blog/:id  (metadata only) */
export const updateBlogRequest = async (
  id: string,
  payload: UpdateBlogPayload,
): Promise<Blog> => {
  const { data } = await api.patch<Envelop<Blog>>(
    `/blog/update/${id}`,
    payload,
  );
  return data.data;
};

/** PATCH /blog/:id/image  (multipart, image only) */
export const replaceBlogImageRequest = async (
  id: string,
  payload: ReplaceBlogImagePayload,
): Promise<Blog> => {
  const form = new FormData();
  form.append("image", payload.image);

  const { data } = await api.patch<Envelop<Blog>>(
    `/blog/replace/${id}/image`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
};

/** DELETE /blog/:id */
export const deleteBlogRequest = async (id: string): Promise<void> => {
  await api.delete(`/blog/delete/${id}`);
};