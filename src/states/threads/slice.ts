import { createSlice } from "@reduxjs/toolkit";
import { Thread } from "../../utils/api";
import { addThread, clearThreads, setThreads } from "./actions";

const initialState: { list: Thread[]; detail?: Thread } = {
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
      return { ...state, list: [...state.list, payload] };
    });
  },
});

export default threadsSlice;
