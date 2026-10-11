import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/lib/api";
import type { CreateStaffInput, StaffUser } from "@/types/staff";
import { createStaffRequest, deleteAdmissionRequest, LisAdmissionParams, ListAddmissionRecordsRequest} from "@/lib/admin.api";
import { ListAdmissionResponse } from "@/types/adimission";

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