// src/lib/public.api.ts
import { StaffUser } from "@/types/staff";
import { Envelop } from "./admin.api";
import { api } from "./api";
import { CreateAdmissionEnvelop, CreateAdmissionPayload, CreateAdmissionResponse, ListAdmissionResponse } from "@/types/adimission";

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



export const AddAdmission = async (
  payload: CreateAdmissionPayload,
): Promise<CreateAdmissionResponse> => {
  const { data } = await api.post<CreateAdmissionEnvelop>(
    "/addmission/create-adimission",
    payload,
  );
  return data.data;
}