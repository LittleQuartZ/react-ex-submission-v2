import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { type Thread, getAllThreads, createThread } from "../src/utils/api";
import store from "../src/states/index";
import {
  clearThreads,
  setThreads,
  addThread,
} from "../src/states/threads/actions";
import {
  asyncAddThread,
  asyncGetAllThreads,
} from "../src/states/threads/thunks";
import { setAuthToken } from "../src/states/auth/actions";

/*
 * Threads Slice tests
 * -------------------
 *
 * setThreads action
 * 1. threads.list state must strictly equal to an empty array
 * 2. make a copy of fakeThreads
 * 3. dispatch setThreads with the copy
 * 4. threads.list state must strictly equal to the copy
 *
 * addThread action
 * 1. threads.list state must strictly equal to an empty array
 * 2. make a copy of the first index of fakeThreads
 * 3. dispatch addThread with the copy
 * 4. threads.list state must strictly equal to an array with only the copy
 *
 * thunks
 * 1. mock getAllThreads function from api
 * 2. mock alert function
 *
 * asyncGetAllThreads, successful
 * 1. threads.list state must strictly equal to an empty array
 * 2. mock getAllThreads to return fakeThreads
 * 3. dispatch asyncGetAllThreads
 * 4. getAllThreads function must be called 1 time
 * 5. threads.list state must strictly equal with fakeThreads
 *
 * asyncGetAllThreads, error
 * 1. threads.list state must strictly equal to an empty array
 * 2. mock getAllThreads to return fakeError
 * 3. dispatch asyncGetAllThreads
 * 4. getAllThreads function must be called 1 time
 * 5. alert must be called 1 time with fakeError.error
 * 6. threads.list state must strictly equal to an empty array
 *
 * mock createThread
 *
 * asyncAddThread, successful
 * 1. threads.list state must strictly equal to an empty array
 * 2. dispatch setAuthToken with test_token because it's needed in asyncAddThread
 * 3. create a thread variable for input
 * 4. dispatch asyncAddThread with thread variable as input twice
 * 5. threads.list state must have length of 2
 * 6. createThread must be called 2 times with thread and token
 * 7. alert must not be called
 *
 * asyncAddThread, error create, rollback
 * 1. dispatch setThreads with fakeThreads
 * 2. threads.list state must strictly equal to fakeThreads
 * 3. dispatch setAuthToken with wrong_token to simulate error
 * 4. create a thread variable for input
 * 5. dispatch asyncAddThread with thread variable as input
 * 6. createThread must be called 1 time with thread and token
 * 7. alert must be called 1 time with error from mock implementation
 * 8. threads.list state must strictly equal to fakeThreads
 */

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
  vi.mock("../src/utils/api", () => ({
    getAllThreads: vi.fn(),
    createThread: vi.fn(),
  }));
  vi.stubGlobal("alert", vi.fn());

  const { dispatch, getState } = store;

  describe("actions", () => {
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
      dispatch(addThread(thread));

      expect(getState().threads.list).toHaveLength(2);
    });
  });

  describe("thunks", () => {
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

      expect(getState().threads.list).toStrictEqual([]);
    });

    vi.mocked(createThread).mockImplementation(async (thread, token) => {
      if (token === "test_token") {
        return {
          ...thread,
          id: "new-thread",
          createdAt: new Date().toISOString(),
          ownerId: token.split("_")[0],
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 0,
        };
      }

      return { error: "error creating thread" };
    });

    it("should add thread, create, and set threads with response", async () => {
      expect(getState().threads.list).toStrictEqual([]);
      dispatch(setAuthToken("test_token"));

      const thread = {
        title: "test thread",
        body: "body of test thread",
        category: "with category",
      };

      await dispatch(asyncAddThread(thread));
      await dispatch(asyncAddThread(thread));

      expect(getState().threads.list).toHaveLength(2);

      expect(createThread).toBeCalledWith(thread, getState().auth.token);
      expect(createThread).toBeCalledTimes(2);
      expect(alert).toBeCalledTimes(0);
    });

    it("should add thread, error create, rollback to previous", async () => {
      dispatch(setThreads(fakeThreads));
      expect(getState().threads.list).toStrictEqual(fakeThreads);

      dispatch(setAuthToken("wrong_token"));

      const thread = {
        title: "test thread",
        body: "body of test thread",
        category: "with category",
      };

      await dispatch(asyncAddThread(thread));

      expect(createThread).toBeCalledWith(thread, getState().auth.token);
      expect(createThread).toBeCalledTimes(1);

      expect(alert).toBeCalledWith("error creating thread");
      expect(alert).toBeCalledTimes(1);

      expect(getState().threads.list).toStrictEqual(fakeThreads);
    });
  });
});
