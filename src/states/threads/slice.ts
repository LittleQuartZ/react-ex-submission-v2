import { createSlice } from "@reduxjs/toolkit";
import { Thread, ThreadDetail } from "../../utils/api";
import {
  addThread,
  clearThreadDetail,
  clearThreads,
  setThreadDetail,
  setThreadDetailVote,
  setThreads,
  setThreadsVote,
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
    b.addCase(setThreadsVote, (state, { payload }) => {
      return {
        ...state,
        list: state.list.map((thread) => {
          if (!(thread.id === payload.threadId)) {
            return thread;
          }

          switch (payload.voteType) {
            case 1:
              return {
                ...thread,
                downVotesBy: thread.downVotesBy.filter(
                  (id) => !(id === payload.userId)
                ),
                upVotesBy: thread.upVotesBy.concat([payload.userId]),
              };
            case -1:
              return {
                ...thread,
                upVotesBy: thread.upVotesBy.filter(
                  (id) => !(id === payload.userId)
                ),
                downVotesBy: thread.downVotesBy.concat([payload.userId]),
              };
            case 0:
              return {
                ...thread,
                downVotesBy: thread.downVotesBy.filter(
                  (id) => !(id === payload.userId)
                ),
                upVotesBy: thread.upVotesBy.filter(
                  (id) => !(id === payload.userId)
                ),
              };
          }
        }),
      };
    });
    b.addCase(setThreadDetailVote, (state, { payload }) => {
      let newDetail;

      switch (payload.voteType) {
        case 1:
          newDetail = {
            ...state.detail,
            downVotesBy: state.detail?.downVotesBy.filter(
              (id) => !(id === payload.userId)
            ),
            upVotesBy: state.detail?.upVotesBy.concat([payload.userId]),
          };
          break;
        case -1:
          newDetail = {
            ...state.detail,
            upVotesBy: state.detail?.upVotesBy.filter(
              (id) => !(id === payload.userId)
            ),
            downVotesBy: state.detail?.downVotesBy.concat([payload.userId]),
          };
          break;
        case 0:
          newDetail = {
            ...state.detail,
            downVotesBy: state.detail?.downVotesBy.filter(
              (id) => !(id === payload.userId)
            ),
            upVotesBy: state.detail?.upVotesBy.filter(
              (id) => !(id === payload.userId)
            ),
          };
          break;
      }

      return { ...state, detail: newDetail as ThreadDetail };
    });
  },
});

export default threadsSlice;
