import { URLS } from "@/constants/urls";
import api from "../api";
import {
  UserRegister,
  UserLogin,
  UserLoginResponse,
  UserResponse,
} from "../schema/user"; 
import { CreateUser } from "@/schema";

// --- Signin (Register) ---
export const signin = async (data: CreateUser) => {
  const response = await api.post<UserResponse,CreateUser>(URLS.users, data);
  return { data: response.data }; // <- wrap to match previous pattern
};

// --- Login ---
export const login = async (data: UserLogin) =>
  (await api.post<UserLoginResponse,UserLogin>(URLS.login, data)).data;

// --- Apple OAuth login ---
export const appleLogin = async (data: { idToken: string }) =>
  (await api.post<any, { idToken: string }>(URLS.appleLogin, data)).data;

// --- Change Password ---
export type ChangePasswordParams = {
  email: string;
  oldpassword: string;
  newpassword: string;
};

export type ChangePasswordResponse = {
  message: string;
  success?: boolean;
};

export const changePassword = async (
  data: ChangePasswordParams,
  token: string
) => {
  const response = await api.post<ChangePasswordResponse,ChangePasswordParams>(
    URLS.updatePassword,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
// --- Update User ---
export type UpdateUserParams = {
  name?: string;
  email?: string;
  age?: number | null;
  avatar?: string;
};

export type UpdateUserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  age?: number | null;
  avatar?: string;
};

export const updateUser = async (
  userId: string,
  data: UpdateUserParams
) => {
  const response = await api.patch<UpdateUserResponse, UpdateUserParams>(
    URLS.userById(userId),
    data
  );
  return response.data;
};