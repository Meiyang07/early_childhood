// src/types/auth.ts
export interface AuthUser {
  id: string;
  email: string;
  username: string;   
  role: string;
  image?: string;
  status?: string;
  createdAt?: string;
}

export interface LoginInput {
  email: string; 
  password: string;
}