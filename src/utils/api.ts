import axios, { AxiosError } from "axios";
import GLOBAL_CONFIG from "./globals";

export const BASE_URL = "https://forum-api.dicoding.dev/v1";
export const ENDPOINTS = {
  getAllThreads: "/threads",
  getThreadDetail: "/threads/:id",
  createThread: "/threads",
  login: "/login",
  getProfile: "/users/me",
  getAllUsers: "/users",
  registerUser: "/register",
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
  category: string;
  createdAt: string;
  ownerId: User["id"];
  upVotesBy: User["id"][];
  downVotesBy: User["id"][];
  totalComments: number;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  owner: User;
  upVotesBy: User["id"][];
  downVotesBy: User["id"][];
};

export type ThreadDetail = Omit<Thread, "ownerId" | "totalComments"> & {
  owner: User;
  comments: Comment[];
};

export type ILogin = {
  email: string;
  password: string;
};

export type IThread = {
  title: Thread["title"];
  body: Thread["body"];
  category: Thread["category"];
};

export type IRegister = {
  name: string;
  email: string;
  password: string;
};

const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data.message as string;
    if (message.toLowerCase().includes("token")) {
      clearToken();
    }
    return { error: message };
  }

  if (error instanceof Error) {
    const message = error.message;
    if (message.toLowerCase().includes("token")) {
      clearToken();
    }
    return { error: error.message };
  }

  return { error: "unhandled error" };
};

export const getToken = () => {
  return localStorage.getItem(GLOBAL_CONFIG.API_LOCAL_KEY);
};
export const setToken = (token: string) => {
  localStorage.setItem(GLOBAL_CONFIG.API_LOCAL_KEY, token);
};
export const clearToken = () => {
  localStorage.removeItem(GLOBAL_CONFIG.API_LOCAL_KEY);
};

const withAuth = (token: string) => {
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
    return handleError(error);
  }
};

export const getThreadDetail = async (id: string) => {
  try {
    const response = await axios.get<Response<{ detailThread: ThreadDetail }>>(
      BASE_URL + ENDPOINTS.getThreadDetail.split(":")[0] + id
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed getting ${id} detail: ${response.data.message}`);
    }

    return response.data.data.detailThread;
  } catch (error) {
    return handleError(error);
  }
};

export const createThread = async (
  { title, body, category }: IThread,
  token: string
) => {
  try {
    const response = await withAuth(token).post<Response<{ thread: Thread }>>(
      BASE_URL + ENDPOINTS.createThread,
      { title, body, category }
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed posting new thread: ${response.data.message}`);
    }

    return response.data.data.thread;
  } catch (error) {
    return handleError(error);
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
    return handleError(error);
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
    return handleError(error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get<Response<{ users: User[] }>>(
      BASE_URL + ENDPOINTS.getAllUsers
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed getting all users: ${response.data.message}`);
    }

    return response.data.data.users;
  } catch (error) {
    return handleError(error);
  }
};

export const registerUser = async ({ name, email, password }: IRegister) => {
  try {
    const response = await axios.post<Response<{ user: User }>>(
      BASE_URL + ENDPOINTS.registerUser,
      { name, email, password }
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed registering user: ${response.data.message}`);
    }

    return response.data.data.user;
  } catch (error) {
    return handleError(error);
  }
};
