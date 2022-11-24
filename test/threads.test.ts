import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { type Thread, getAllThreads } from "../src/utils/api";
import store from "../src/states/index";
import {
  clearThreads,
  setThreads,
  addThread,
} from "../src/states/threads/actions";
import { asyncGetAllThreads } from "../src/states/threads/thunks";

const fakeThreads: Thread[] = [
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

const fakeError = {
  error: "oops, an error happened",
};

describe("threadsSlice tests", () => {
  describe("actions", () => {
    const { dispatch, getState } = store;

    beforeEach(() => {
      dispatch(clearThreads());
    });

    it("should set threads", async () => {
      expect(getState().threads.list).toStrictEqual([]);

      const threads: Thread[] = fakeThreads;
      dispatch(setThreads(threads));

      expect(getState().threads.list).toStrictEqual(threads);
    });

    it("should add one thread", () => {
      expect(getState().threads.list).toStrictEqual([]);

      const thread: Thread = fakeThreads[0];

      dispatch(addThread(thread));

      expect(getState().threads.list).toStrictEqual([thread]);
    });
  });

  describe("thunks", () => {
    const { dispatch, getState } = store;

    vi.mock("../src/utils/api", () => ({
      getAllThreads: vi.fn(),
    }));
    vi.stubGlobal("alert", vi.fn());

    beforeEach(() => {
      dispatch(clearThreads());
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should fetch all threads and set threads", async () => {
      expect(getState().threads.list).toStrictEqual([]);

      vi.mocked(getAllThreads).mockImplementationOnce(() =>
        Promise.resolve(fakeThreads)
      );

      await dispatch(asyncGetAllThreads());
      expect(getAllThreads).toBeCalledTimes(1);

      expect(getState().threads.list).toHaveLength(3);
      expect(getState().threads.list).toStrictEqual(fakeThreads);
    });

    it("should fetch all threads and call alert", async () => {
      expect(getState().threads.list).toStrictEqual([]);

      vi.mocked(getAllThreads).mockImplementationOnce(() =>
        Promise.resolve(fakeError)
      );

      await dispatch(asyncGetAllThreads());
      expect(getAllThreads).toBeCalledTimes(1);

      expect(alert).toBeCalledTimes(1);
      expect(alert).toBeCalledWith(fakeError.error);

      expect(getState().threads.list).toHaveLength(0);
      expect(getState().threads.list).toStrictEqual([]);
    });
  });
});
