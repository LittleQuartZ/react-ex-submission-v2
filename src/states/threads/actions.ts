import { createAction } from "@reduxjs/toolkit";
import { Comment, ThreadDetail, Vote, type Thread } from "../../utils/api";

export const setThreads = createAction<Thread[], "threads/list/set">(
  "threads/list/set"
);
export const clearThreads = createAction<void, "threads/list/clear">(
  "threads/list/clear"
);
export const addThread = createAction<Thread, "threads/list/add">(
  "threads/list/add"
);

export const setThreadDetail = createAction<ThreadDetail, "threads/detail/set">(
  "threads/detail/set"
);
export const clearThreadDetail = createAction<void, "threads/detail/clear">(
  "threads/detail/clear"
);

export const setThreadsVote = createAction<Vote, "threads/list/vote/set">(
  "threads/list/vote/set"
);

export const setThreadDetailVote = createAction<
  Vote,
  "threads/detail/vote/set"
>("threads/detail/vote/set");

export const addThreadDetailComment = createAction<
  Comment,
  "threads/detail/comments/add"
>("threads/detail/comments/add");
export const setThreadDetailComment = createAction<
  Comment[],
  "threads/detail/comments/set"
>("threads/detail/comments/set");

export const setThreadDetailCommentVote = createAction<
  Vote,
  "threads/detail/comments/vote"
>("threads/detail/comments/vote");
