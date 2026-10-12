// src/hook/usePublic.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/api";
import {
  AddAdmission,
  getBlogByIdRequest,
  getEventByIdRequest,
  getPhotoByIdRequest,
  listBlogsRequest,
  listEventsRequest,
  listPhotosRequest,
  listProgramRequest,
  listStaffRequest,
  listTestimonialsRequest,
  type ListStaffParams,
  type ListStaffResponse,
} from "@/lib/public.api";
import { CreateAdmissionPayload, CreateAdmissionResponse } from "@/types/adimission";
import { toast } from "sonner";
import { KEY, ListTestimonialParams, ListTestimonialResponse } from "@/types/testimonial";
import { ListProgramParams, ListProgramsResponse, PROGRAMS_KEY } from "@/types/program";
import { ListPhotoParams, ListPhotosResponse, Photo, PHOTOS_KEY } from "@/types/photo";
import { EventRecord, EVENTS_KEY, ListEventParams, ListEventsResponse } from "@/types/event";
import { Blog, BLOGS_KEY, ListBlogParams, ListBlogsResponse } from "@/types/blog";


export function useListStaff(params: ListStaffParams = {}) {
  return useQuery<ListStaffResponse, ApiError>({
    queryKey: ["staff", "public", params],
    queryFn: () => listStaffRequest(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}


export function useCreateAdmission() {
  const qc = useQueryClient();

  return useMutation<CreateAdmissionResponse, ApiError, CreateAdmissionPayload>({
    mutationFn: AddAdmission,
    onSuccess: (created) => {
      // Refresh every admission list query (all filters/programs/statuses)
      qc.invalidateQueries({ queryKey: ["adimission"] });
      qc.invalidateQueries({ queryKey: ["admission"] }); // in case of corrected spelling
      toast.success(
        `Application for ${created.childInfo.fullName} submitted`,
      );
    },
    onError: (err) => toast.error(err.message ?? "Failed to submit application"),
  });
}


// ======================= testimonial public hook ===========================================

export function useListTestimonials(params: ListTestimonialParams = {}) {
  return useQuery<ListTestimonialResponse, ApiError>({
    queryKey: [KEY, "list", params],
    queryFn: () => listTestimonialsRequest(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}



// ================================ progra public hook start from here =====================

export function useListPrograms(params: ListProgramParams = {}) {
  return useQuery<ListProgramsResponse, ApiError>({
    queryKey: [PROGRAMS_KEY, "list", params],
    queryFn: () => listProgramRequest(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}





// ================ photos==============================
export function useListPhotos(params: ListPhotoParams = {}) {
  return useQuery<ListPhotosResponse, ApiError>({
    queryKey: [PHOTOS_KEY, "list", params],
    queryFn: () => listPhotosRequest(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}


export function usePhotoById(id: string | undefined) {
  return useQuery<Photo, ApiError>({
    queryKey: [PHOTOS_KEY, "detail", id],
    queryFn: () => getPhotoByIdRequest(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}


// =============== public event hook start from here====================
export function useListEvents(params: ListEventParams = {}) {
  return useQuery<ListEventsResponse, ApiError>({
    queryKey: [EVENTS_KEY, "list", params],
    queryFn: () => listEventsRequest(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

// ---------- GET BY ID ----------
export function useEventById(id: string | undefined) {
  return useQuery<EventRecord, ApiError>({
    queryKey: [EVENTS_KEY, "detail", id],
    queryFn: () => getEventByIdRequest(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}


// ==================== public blog hook start from here====================
export function useListBlogs(params: ListBlogParams = {}) {
  return useQuery<ListBlogsResponse, ApiError>({
    queryKey: [BLOGS_KEY, "list", params],
    queryFn: () => listBlogsRequest(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

// ---------- GET BY ID ----------
export function useBlogById(id: string | undefined) {
  return useQuery<Blog, ApiError>({
    queryKey: [BLOGS_KEY, "detail", id],
    queryFn: () => getBlogByIdRequest(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}