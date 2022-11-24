import axios from "axios";
import GLOBAL_CONFIG from "./globals";

export const BASE_URL = "https://forum-api.dicoding.dev/v1";
export const ENDPOINTS = {
  getAllThreads: "/threads",
  login: "/login",
  getProfile: "/users/me",
};

export type Response<T> = {
  status: "fail" | "success";
  message: string;
  data: T;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Thread = {
  id: string;
  title: string;
  body: string;
  category?: string;
  createdAt: string;
  ownerId: User["id"];
  upVotesBy: User["id"][];
  downVotesBy: User["id"][];
  totalComments: number;
};

export type ILogin = {
  email: string;
  password: string;
};

export const getToken = () => {
  return localStorage.getItem(GLOBAL_CONFIG.API_LOCAL_KEY);
};
export const setToken = (token: string) => {
  localStorage.setItem(GLOBAL_CONFIG.API_LOCAL_KEY, token);
};

const withAuth = (token: string) => {
  if (!token) {
    throw new Error("No token please login!");
  }

  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllThreads = async () => {
  try {
    const response = await axios.get<Response<{ threads: Thread[] }>>(
      BASE_URL + ENDPOINTS.getAllThreads
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed getting all threads: ${response.data.message}`);
    }

    return response.data.data.threads;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "unhandled error" };
  }
};

export const login = async ({ email, password }: ILogin) => {
  try {
    const response = await axios.post<Response<{ token: string }>>(
      BASE_URL + ENDPOINTS.login,
      { email, password }
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed login: ${response.data.message}`);
    }

    setToken(response.data.data.token);
    return response.data.data.token;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "unhandled error" };
  }
};

export const getProfile = async (token: string) => {
  try {
    const response = await withAuth(token).get<Response<{ user: User }>>(
      BASE_URL + ENDPOINTS.getProfile
    );

    if (response.data.status === "fail") {
      localStorage.removeItem(GLOBAL_CONFIG.API_LOCAL_KEY);
      throw new Error(`Failed fetching authed user: ${response.data.message}`);
    }

    return response.data.data.user;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "unhandled error" };
  }
};
