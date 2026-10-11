import { CreateStaffInput, StaffUser } from "@/types/staff";
import { api } from "./api";
import { ListAdmissionResponse } from "@/types/adimission";

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

