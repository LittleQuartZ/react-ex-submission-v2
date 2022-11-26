import { describe, it, expect, beforeEach, vi } from "vitest";
import store from "../src/states/index";
import {
  clearThreadDetail,
  setThreadDetail,
} from "../src/states/threads/actions";
import { ThreadDetail } from "../src/utils/api";

/*
 * threads detail test
 *
 * set and clear thread detail action
 * 1. threads.detail state must be undefined
 * 2. make a copy of fakeThreadDetail
 * 3. dispatch setThreadDetail with the copy
 * 4. threads.detail state must strictly equal with the copy
 * 5. dispatch clearThreadDetail
 * 6. threads.detail state must be undefined
 */

const fakeThreadDetail: ThreadDetail = {
  id: "fake-detail",
  title: "fake thread detail",
  body: "fake thread detail body",
  createdAt: new Date().toISOString(),
  owner: {
    name: "fake user",
    id: "fake-user",
    avatar: "fake-avatar",
  },
  downVotesBy: [],
  upVotesBy: [],
  comments: [],
};

describe("threads detail test", () => {
  const { dispatch, getState } = store;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set threads detail state and clear it", () => {
    expect(getState().threads.detail).toBeUndefined();

    const threadDetail = fakeThreadDetail;
    dispatch(setThreadDetail(threadDetail));

    expect(getState().threads.detail).toStrictEqual(threadDetail);

    dispatch(clearThreadDetail());
    expect(getState().threads.detail).toBeUndefined();
  });
});
