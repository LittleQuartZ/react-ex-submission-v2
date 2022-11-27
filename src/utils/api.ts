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
  getLeaderboards: "/leaderboards",
  vote: {
    "-1": "down-vote",
    "0": "neutral-vote",
    "1": "up-vote",
  },
};

export interface Response<T> {
  status: "fail" | "success";
  message: string;
  data: T;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: User["id"];
  upVotesBy: User["id"][];
  downVotesBy: User["id"][];
  totalComments: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  owner: User;
  upVotesBy: User["id"][];
  downVotesBy: User["id"][];
}

export type ThreadDetail = Omit<Thread, "ownerId" | "totalComments"> & {
  owner: User;
  comments: Comment[];
};

export interface ILogin {
  email: string;
  password: string;
}

export interface IThread {
  title: Thread["title"];
  body: Thread["body"];
  category: Thread["category"];
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
}

export interface Placement {
  user: User;
  score: number;
}

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

export interface Vote {
  id: string;
  userId: User["id"];
  threadId?: Thread["id"];
  commentId?: Comment["id"];
  voteType: -1 | 0 | 1;
}

export const voteThread = async (
  {
    type,
    threadId,
  }: {
    type: Vote["voteType"];
    threadId: Vote["threadId"];
  },
  token: string
) => {
  try {
    const response = await withAuth(token).post<Response<{ vote: Vote }>>(
      BASE_URL +
        ENDPOINTS.getThreadDetail.split(":")[0] +
        threadId +
        `/${ENDPOINTS.vote[type]}`
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed registering user: ${response.data.message}`);
    }

    return response.data.data.vote;
  } catch (error) {
    return handleError(error);
  }
};

export const createComment = async (
  {
    content,
    threadId,
  }: { content: Comment["content"]; threadId: Thread["id"] },
  token: string
) => {
  try {
    const response = await withAuth(token).post<Response<{ comment: Comment }>>(
      BASE_URL +
        ENDPOINTS.getThreadDetail.split(":")[0] +
        threadId +
        "/comments",
      { content }
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed to post comment: ${response.data.message}`);
    }

    return response.data.data.comment;
  } catch (error) {
    return handleError(error);
  }
};

export const voteComment = async (
  {
    threadId,
    commentId,
    type,
  }: {
    threadId: Thread["id"];
    commentId: Comment["id"];
    type: Vote["voteType"];
  },
  token: string
) => {
  try {
    const response = await withAuth(token).post<Response<{ vote: Vote }>>(
      BASE_URL +
        ENDPOINTS.getThreadDetail.split(":")[0] +
        threadId +
        "/comments/" +
        commentId +
        "/" +
        ENDPOINTS.vote[type]
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed to vote comment: ${response.data.message}`);
    }

    return response.data.data.vote;
  } catch (error) {
    return handleError(error);
  }
};

export const getLeaderboards = async () => {
  try {
    const response = await axios.get<Response<{ leaderboards: Placement[] }>>(
      BASE_URL + ENDPOINTS.getLeaderboards
    );

    if (response.data.status === "fail") {
      throw new Error(`Failed to get leaderboards: ${response.data.message}`);
    }

    return response.data.data.leaderboards;
  } catch (error) {
    return handleError(error);
  }
};
