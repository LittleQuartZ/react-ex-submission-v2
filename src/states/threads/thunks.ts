import { createAsyncThunk } from "@reduxjs/toolkit";
import { type AppThunkAPI } from "..";
import {
  createThread,
  getAllThreads,
  getThreadDetail,
  IThread,
  Thread,
} from "../../utils/api";
import { addThread, setThreads, setThreadDetail } from "./actions";

export const asyncGetAllThreads = createAsyncThunk<
  void,
  undefined,
  AppThunkAPI
>("threads/list/fetch", async (_, { dispatch }) => {
  const threads = await getAllThreads();

  if ("error" in threads) {
    alert(threads.error);
    return;
  }

  dispatch(setThreads(threads));
});

export const asyncAddThread = createAsyncThunk<void, IThread, AppThunkAPI>(
  "threads/list/create",
  async (thread, { dispatch, getState }) => {
    const token = getState().auth.token;

    if (!token) {
      alert("No token, please login!");
      return;
    }

    const userId = getState().auth.user?.id as string;
    const old = getState().threads.list;
    const newThread: Thread = {
      ...thread,
      id: "new-thread",
      createdAt: new Date().toISOString(),
      ownerId: userId,
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
    };

    dispatch(addThread(newThread));

    const response = await createThread(thread, token);

    if ("error" in response) {
      dispatch(setThreads(old));
      alert(response.error);
      return;
    }

    dispatch(setThreads([response, ...old]));
  }
);

export const asyncGetThreadDetail = createAsyncThunk<void, string, AppThunkAPI>(
  "threads/detail/fetch",
  async (id, { dispatch }) => {
    const threadDetail = await getThreadDetail(id);

    if ("error" in threadDetail) {
      alert(threadDetail.error);
      return;
    }

    dispatch(setThreadDetail(threadDetail));
  }
);
