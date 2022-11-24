import axios from "axios";

export const BASE_URL = "https://forum-api.dicoding.dev/v1";
export const ENDPOINTS = {
  getAllThreads: "/threads",
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
