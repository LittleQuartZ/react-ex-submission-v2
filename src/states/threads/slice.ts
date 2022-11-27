import { createSlice } from "@reduxjs/toolkit";
import { Comment, Thread, ThreadDetail } from "../../utils/api";
import {
  addThread,
  addThreadDetailComment,
  clearThreadDetail,
  clearThreads,
  setThreadDetail,
  setThreadDetailComment,
  setThreadDetailCommentVote,
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
    b.addCase(addThreadDetailComment, (state, { payload }) => {
      return {
        ...state,
        detail: {
          ...state.detail,
          comments: [payload].concat(...(state.detail?.comments as Comment[])),
        } as ThreadDetail,
      };
    });
    b.addCase(setThreadDetailComment, (state, { payload }) => {
      return {
        ...state,
        detail: {
          ...state.detail,
          comments: payload,
        } as ThreadDetail,
      };
    });
    b.addCase(setThreadDetailCommentVote, (state, { payload }) => {
      return {
        ...state,
        detail: {
          ...state.detail,
          comments: state.detail?.comments.map((comment) => {
            if (!(comment.id === payload.commentId)) {
              return comment;
            }

            let newVote;

            switch (payload.voteType) {
              case 1:
                newVote = {
                  downVotesBy: comment.downVotesBy.filter(
                    (id) => !(id === payload.userId)
                  ),
                  upVotesBy: comment.upVotesBy.concat([payload.userId]),
                };
                break;

              case -1:
                newVote = {
                  upVotesBy: comment.upVotesBy.filter(
                    (id) => !(id === payload.userId)
                  ),
                  downVotesBy: comment.downVotesBy.concat([payload.userId]),
                };
                break;
              case 0:
                newVote = {
                  downVotesBy: comment.downVotesBy.filter(
                    (id) => !(id === payload.userId)
                  ),
                  upVotesBy: comment.upVotesBy.filter(
                    (id) => !(id === payload.userId)
                  ),
                };
                break;
            }

            return {
              ...comment,
              ...newVote,
            };
          }),
        } as ThreadDetail,
      };
    });
  },
});

export default threadsSlice;
