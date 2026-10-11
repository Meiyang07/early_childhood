export interface CreateStaffInput {
  fullName: string;
  email: string;
  password: string;
  role: string;
  about: string;
  status: string;
  image: File; // browser File
}

export interface StaffUser {
  fullName: string;
  email: string;
  image: string;
  imagePublicId: string;
  role: string;
  about: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}