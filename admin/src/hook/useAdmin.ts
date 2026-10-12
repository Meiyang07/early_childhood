import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/lib/api";
import type { CreateStaffInput, StaffUser } from "@/types/staff";
import { createBlogRequest, createEventRequest, createPhotoRequest, createProgramRequest, createStaffRequest, createTestimonialRequest, deleteAdmissionRequest, deleteBlogRequest, deleteEventRequest, deletePhotoRequest, deleteProgramRequest, deleteTestimonialRequest, LisAdmissionParams, ListAddmissionRecordsRequest, replaceBlogImageRequest, replacePhotoImageRequest, updadteProgramRequest, updateBlogRequest, updateEventRequest, updatePhotoRequest, updateTestimonialRequest, updateTestimonialStatusRequest } from "@/lib/admin.api";
import { ListAdmissionResponse } from "@/types/adimission";
import { CreateTestimonialPayload, KEY, Testimonial, UpdateTestimonialPayload, UpdateTestimonialStatusPayload } from "@/types/testimonial";
import { CreateProgramPayload, Program, PROGRAMS_KEY, UpdateProgramPayload } from "@/types/program";
import { CreatePhotoPayload, Photo, PHOTOS_KEY, ReplacePhotoImagePayload, UpdatePhotoPayload } from "@/types/photo";
import { CreateEventPayload, EventRecord, EVENTS_KEY, UpdateEventPayload } from "@/types/event";
import { Blog, BLOGS_KEY, CreateBlogPayload, ReplaceBlogImagePayload, UpdateBlogPayload } from "@/types/blog";

export const admissionKeys = {
  all: ["admission", "admin"] as const,
  list: (params: Record<string, unknown> = {}) =>
    [...admissionKeys.all, params] as const,
};


export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation<StaffUser, ApiError, CreateStaffInput>({
    mutationFn: createStaffRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff added");
    },
    onError: (err) => toast.error(err.message),
  });
}


export function useListAdimission(params: LisAdmissionParams = {}) {
  return useQuery<ListAdmissionResponse, ApiError>({
    queryKey: ['adimission', "admin", params],
    queryFn: () => ListAddmissionRecordsRequest(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}


export function useDeleteAdmission() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteAdmissionRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: admissionKeys.all });
      toast.success("Application removed");
    },
    onError: (err) => toast.error(err.message),
  });
}



// ============================ admin testimonial hook ==============================
// ---------- CREATE ----------
export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation<Testimonial, ApiError, CreateTestimonialPayload>({
    mutationFn: createTestimonialRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      toast.success("Testimonial created");
    },
    onError: (err) => toast.error(err.message ?? "Failed to create testimonial"),
  });
}

// ---------- UPDATE ----------
export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation<
    Testimonial,
    ApiError,
    { id: string; payload: UpdateTestimonialPayload }
  >({
    mutationFn: ({ id, payload }) => updateTestimonialRequest(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      toast.success("Testimonial updated");
    },
    onError: (err) => toast.error(err.message ?? "Failed to update testimonial"),
  });
}

// ---------- UPDATE STATUS ----------
export function useUpdateTestimonialStatus() {
  const qc = useQueryClient();
  return useMutation<
    Testimonial,
    ApiError,
    { id: string; payload: UpdateTestimonialStatusPayload }
  >({
    mutationFn: ({ id, payload }) =>
      updateTestimonialStatusRequest(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [KEY] });
      toast.success(`Status set to ${vars.payload.status}`);
    },
    onError: (err) => toast.error(err.message ?? "Failed to update status"),
  });
}

// ---------- DELETE ----------
export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteTestimonialRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      toast.success("Testimonial deleted");
    },
    onError: (err) => toast.error(err.message ?? "Failed to delete testimonial"),
  });
}




// ======================== programs api start from here ony admin can perform this tasks=======================

export function useCreatePrograms() {
  const qc = useQueryClient();
  return useMutation<Program, ApiError, CreateProgramPayload>({
    mutationFn: createProgramRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROGRAMS_KEY] });
      toast.success("Program created");
    },
    onError: (err) => toast.error(err.message ?? "Failed to create program"),
  });
}


export function useUpdateProgram() {
  const qc = useQueryClient();
  return useMutation<
    Program,
    ApiError,
    { id: string; payload: UpdateProgramPayload }
  >({
    mutationFn: ({ id, payload }) => updadteProgramRequest(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROGRAMS_KEY] });
      toast.success("Program updated");
    },
    onError: (err) => toast.error(err.message ?? "Failed to update program"),
  });
}



export function useDeleteProgram() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteProgramRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROGRAMS_KEY] });
      toast.success("Program deleted");
    },
    onError: (err) => toast.error(err.message ?? "Failed to delete program"),
  });
}




// ============================= admin photos api ===========================================
export function useCreatePhoto() {
  const qc = useQueryClient();
  return useMutation<Photo, ApiError, CreatePhotoPayload>({
    mutationFn: createPhotoRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PHOTOS_KEY] });
      toast.success("Photo created");
    },
    onError: (err) => toast.error(err.message ?? "Failed to create photo"),
  });
}




// ---------- UPDATE METADATA ----------
export function useUpdatePhoto() {
  const qc = useQueryClient();
  return useMutation<
    Photo,
    ApiError,
    { id: string; payload: UpdatePhotoPayload }
  >({
    mutationFn: ({ id, payload }) => updatePhotoRequest(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PHOTOS_KEY] });
      toast.success("Photo updated");
    },
    onError: (err) => toast.error(err.message ?? "Failed to update photo"),
  });
}




// ---------- REPLACE IMAGE ----------
export function useReplacePhotoImage() {
  const qc = useQueryClient();
  return useMutation<
    Photo,
    ApiError,
    { id: string; payload: ReplacePhotoImagePayload }
  >({
    mutationFn: ({ id, payload }) => replacePhotoImageRequest(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PHOTOS_KEY] });
      toast.success("Photo image replaced");
    },
    onError: (err) =>
      toast.error(err.message ?? "Failed to replace image"),
  });
}




// ---------- DELETE ----------
export function useDeletePhoto() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deletePhotoRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PHOTOS_KEY] });
      toast.success("Photo deleted");
    },
    onError: (err) => toast.error(err.message ?? "Failed to delete photo"),
  });
}





// ================= event admin hook start from here =======================
export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation<EventRecord, ApiError, CreateEventPayload>({
    mutationFn: createEventRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EVENTS_KEY] });
      toast.success("Event created");
    },
    onError: (err) => toast.error(err.message ?? "Failed to create event"),
  });
}

// ---------- UPDATE ----------
export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation<
    EventRecord,
    ApiError,
    { id: string; payload: UpdateEventPayload }
  >({
    mutationFn: ({ id, payload }) => updateEventRequest(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EVENTS_KEY] });
      toast.success("Event updated");
    },
    onError: (err) => toast.error(err.message ?? "Failed to update event"),
  });
}

// ---------- DELETE ----------
export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteEventRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EVENTS_KEY] });
      toast.success("Event deleted");
    },
    onError: (err) => toast.error(err.message ?? "Failed to delete event"),
  });
}



// =============== admin blog hook start from here ===========================================

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation<Blog, ApiError, CreateBlogPayload>({
    mutationFn: createBlogRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BLOGS_KEY] });
      toast.success("Blog created");
    },
    onError: (err) => toast.error(err.message ?? "Failed to create blog"),
  });
}

// ---------- UPDATE METADATA ----------
export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation<
    Blog,
    ApiError,
    { id: string; payload: UpdateBlogPayload }
  >({
    mutationFn: ({ id, payload }) => updateBlogRequest(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BLOGS_KEY] });
      toast.success("Blog updated");
    },
    onError: (err) => toast.error(err.message ?? "Failed to update blog"),
  });
}

// ---------- REPLACE IMAGE ----------
export function useReplaceBlogImage() {
  const qc = useQueryClient();
  return useMutation<
    Blog,
    ApiError,
    { id: string; payload: ReplaceBlogImagePayload }
  >({
    mutationFn: ({ id, payload }) => replaceBlogImageRequest(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BLOGS_KEY] });
      toast.success("Blog image replaced");
    },
    onError: (err) =>
      toast.error(err.message ?? "Failed to replace image"),
  });
}

// ---------- DELETE ----------
export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteBlogRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BLOGS_KEY] });
      toast.success("Blog deleted");
    },
    onError: (err) => toast.error(err.message ?? "Failed to delete blog"),
  });
}