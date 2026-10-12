export interface ListAdmissionResponse {
  applications: AdmissionApplication[];
  counts: AdmissionCounts;
}

export interface AdmissionCounts {
  All: number;
  Pending: number;
  Reviewed: number;
  Accepted: number;
  Rejected: number;
  Waitlisted: number;
}

export interface AdmissionApplication {
  _id: string;
  childInfo: ChildInfo;
  guardianInfo: GuardianInfo;
  additionalInfo: AdditionalInfo;
  status: AdmissionStatus;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ChildInfo {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  applyingForProgram: string;
}

export interface GuardianInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
}

export interface AdditionalInfo {
  previousSchool: string;
  medicalConditions: string;
  referralSource: string;
}

export type AdmissionStatus =
  | "Pending"
  | "Reviewed"
  | "Accepted"
  | "Rejected"
  | "Waitlisted";

export const ADMISSION_STATUSES: AdmissionStatus[] = [
  "Pending",
  "Reviewed",
  "Accepted",
  "Rejected",
  "Waitlisted",
];


export const PROGRAMS = [
  "All",
  "Nursery",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
];


export interface CreateAdmissionPayload {
  childInfo: {
    fullName: string;
    dateOfBirth: string;      // ISO date string
    gender: string;
    applyingForProgram: string;
  };
  guardianInfo: {
    fullName: string;
    phoneNumber: string;
    email: string;
    homeAddress: string;
  };
  additionalInfo: {
    previousSchool: string;
    medicalConditions: string;
    referralSource: string;
  };
}

export interface CreateAdmissionResponse {
  _id: string;
  id: string;
  childInfo: ChildInfo & { age?: number };
  guardianInfo: GuardianInfo;
  additionalInfo: AdditionalInfo;
  status: AdmissionStatus;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateAdmissionEnvelop {
  success: boolean;
  message: string;
  data: CreateAdmissionResponse;
}