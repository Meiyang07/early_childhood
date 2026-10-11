// src/hook/usePublic.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/api";
import {
  AddAdmission,
  listStaffRequest,
  type ListStaffParams,
  type ListStaffResponse,
} from "@/lib/public.api";
import { CreateAdmissionPayload, CreateAdmissionResponse } from "@/types/adimission";
import { toast } from "sonner";


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

