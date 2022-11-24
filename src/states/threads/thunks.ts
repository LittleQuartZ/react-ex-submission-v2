import { createAsyncThunk } from "@reduxjs/toolkit";
import { type AppThunkAPI } from "..";
import { getAllThreads } from "../../utils/api";
import { setThreads } from "./actions";

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
