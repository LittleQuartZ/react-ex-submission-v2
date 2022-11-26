import { createSlice } from "@reduxjs/toolkit";
import { Thread, ThreadDetail } from "../../utils/api";
import {
  addThread,
  clearThreadDetail,
  clearThreads,
  setThreadDetail,
  setThreads,
} from "./actions";

const initialState: { list: Thread[]; detail?: ThreadDetail } = {
  list: [],
};

const threadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(setThreads, (state, { payload }) => {
      return { ...state, list: payload };
    });
    b.addCase(clearThreads, (state) => {
      return { ...state, list: [] };
    });
    b.addCase(addThread, (state, { payload }) => {
      return { ...state, list: [payload, ...state.list] };
    });
    b.addCase(setThreadDetail, (state, { payload }) => {
      return { ...state, detail: payload };
    });
    b.addCase(clearThreadDetail, (state) => {
      return { ...state, detail: undefined };
    });
  },
});

export default threadsSlice;
