import { describe, it, expect, beforeEach } from "vitest";
import { type Thread } from "../src/utils/api";
import store from "../src/states/index";
import {
  clearThreads,
  setThreads,
  addThread,
} from "../src/states/threads/actions";

describe("threadsSlice tests", () => {
  describe("actions", () => {
    const { dispatch, getState } = store;

    beforeEach(() => {
      dispatch(clearThreads());
    });

    it("should set threads", async () => {
      expect(getState().threads.list).toStrictEqual([]);

      const threads: Thread[] = [
        {
          id: "thread-1",
          title: "Thread 1",
          body: "Body of Thread 1",
          createdAt: new Date().toISOString(),
          ownerId: "user-1",
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 1,
        },
        {
          id: "thread-2",
          title: "Thread 2",
          body: "Body of Thread 2",
          createdAt: new Date().toISOString(),
          ownerId: "user-2",
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 2,
        },
        {
          id: "thread-3",
          title: "Thread 3",
          body: "Body of Thread 3",
          createdAt: new Date().toISOString(),
          ownerId: "user-3",
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 3,
        },
      ];
      dispatch(setThreads(threads));

      expect(getState().threads.list).toStrictEqual(threads);
    });

    it("should add one thread", () => {
      expect(getState().threads.list).toStrictEqual([]);

      const thread: Thread = {
        id: "1",
        ownerId: "user-1",
        title: "Thread 1",
        body: "Body of Thread 1",
        createdAt: new Date().toISOString(),
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 1,
      };

      dispatch(addThread(thread));

      expect(getState().threads.list).toStrictEqual([thread]);
    });
  });
});
