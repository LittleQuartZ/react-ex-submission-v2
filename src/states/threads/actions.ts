import { createAction } from "@reduxjs/toolkit";
import { ThreadDetail, type Thread } from "../../utils/api";

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
