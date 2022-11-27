import { createAsyncThunk } from "@reduxjs/toolkit";
import { type AppThunkAPI } from "..";
import {
  Comment,
  createComment,
  createThread,
  getAllThreads,
  getThreadDetail,
  IThread,
  Thread,
  ThreadDetail,
  User,
  Vote,
  voteComment,
  voteThread,
} from "../../utils/api";
import {
  addThread,
  setThreads,
  setThreadDetail,
  setThreadsVote,
  setThreadDetailVote,
  addThreadDetailComment,
  setThreadDetailComment,
  setThreadDetailCommentVote,
} from "./actions";

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

export const asyncVoteThreads = createAsyncThunk<
  void,
  { type: Vote["voteType"]; threadId: Thread["id"] },
  AppThunkAPI
>(
  "threads/list/vote/fetch",
  async ({ type, threadId }, { dispatch, getState }) => {
    const [token, userId] = [getState().auth.token, getState().auth.user?.id];
    const old = getState().threads.list;

    if (!token || !userId) {
      alert("You have to login for voting!");
      return;
    }

    dispatch(
      setThreadsVote({
        id: "new-vote",
        userId,
        threadId: threadId,
        commentId: undefined,
        voteType: type,
      })
    );
    const voteResponse = await voteThread({ type, threadId }, token);

    if ("error" in voteResponse) {
      dispatch(setThreads(old));
      alert(voteResponse.error);
      return;
    }
  }
);

export const asyncVoteThreadDetail = createAsyncThunk<
  void,
  { type: Vote["voteType"]; threadId: Thread["id"] },
  AppThunkAPI
>(
  "threads/detail/vote/fetch",
  async ({ type, threadId }, { dispatch, getState }) => {
    const [token, userId] = [getState().auth.token, getState().auth.user?.id];
    const old = getState().threads.detail as ThreadDetail;

    if (!token || !userId) {
      alert("You have to login for voting!");
      return;
    }

    dispatch(
      setThreadDetailVote({
        id: "new-vote",
        userId,
        threadId: threadId,
        commentId: undefined,
        voteType: type,
      })
    );
    const voteResponse = await voteThread({ type, threadId }, token);

    if ("error" in voteResponse) {
      dispatch(setThreadDetail(old));
      alert(voteResponse.error);
      return;
    }
  }
);

export const asyncAddThreadDetailComment = createAsyncThunk<
  void,
  Comment["content"],
  AppThunkAPI
>("threads/list/create", async (content, { dispatch, getState }) => {
  const token = getState().auth.token;

  if (!token) {
    alert("No token, please login!");
    return;
  }

  const user = getState().auth.user as User;
  const old = getState().threads.detail as ThreadDetail;
  const newComment: Comment = {
    id: "new-thread",
    content,
    createdAt: new Date().toISOString(),
    owner: user,
    upVotesBy: [],
    downVotesBy: [],
  };

  dispatch(addThreadDetailComment(newComment));

  const response = await createComment({ content, threadId: old.id }, token);

  if ("error" in response) {
    dispatch(setThreadDetailComment(old.comments));
    alert(response.error);
    return;
  }

  dispatch(setThreadDetailComment([response].concat(old.comments)));
});

export const asyncVoteComment = createAsyncThunk<
  void,
  { type: Vote["voteType"]; commentId: Comment["id"] },
  AppThunkAPI
>(
  "threads/detail/comments/vote",
  async ({ commentId, type }, { getState, dispatch }) => {
    const [token, userId] = [getState().auth.token, getState().auth.user?.id];
    const old = getState().threads.detail as ThreadDetail;

    if (!token || !userId) {
      alert("You have to login for voting!");
      return;
    }

    dispatch(
      setThreadDetailCommentVote({
        id: "new-vote",
        userId,
        voteType: type,
        commentId,
      })
    );
    const voteResponse = await voteComment(
      { type, threadId: old.id, commentId },
      token
    );

    if ("error" in voteResponse) {
      dispatch(setThreadDetail(old));
      alert(voteResponse.error);
      return;
    }
  }
);
