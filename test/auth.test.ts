import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import store from "../src/states";
import {
  clearAuth,
  setAuthUser,
  setAuthToken,
} from "../src/states/auth/actions";
import { asyncLogin } from "../src/states/auth/thunks";
import { getProfile, ILogin, login, User } from "../src/utils/api";

/*
 * Auth Slice tests
 * ----------------
 *
 * setAuthUser action
 * 1. user is undefined
 * 2. dispatch setAuthUser
 * 3. auth.user state must strictly equal with dispatched user
 *
 * setAuthToken action
 * 1. token is undefined
 * 2. dispatch setAuthToken
 * 3. auth.token state must equal with dispatched token
 *
 * thunks
 * mock login and getProfile function from api
 * mock alert function
 *
 * asyncLogin, successful
 * 1. dispatch asyncLogin with input
 * 2. login function must be called 1 time with input
 * 3. alert must not be called
 * 4. auth.token state must equal to the token returned from login mocked function
 * 5. auth.user state must strictly equal to the user returned from getProfile mocked function
 *
 * asyncLogin, fail on getProfile
 * 1. dispatch asyncLogin with input
 * 2. login function must be called 1 time with input
 * 3. alert must be called 1 time with error from getProfile mocked function
 * 4. auth.token state must equal to the token returned from login mocked function
 * 5. auth.user state must be undefined
 *
 * asyncLogin, fail on login
 * 1. dispatch asyncLogin with input and wrong password
 * 2. login function must be called 1 time with input
 * 3. alert must be called 1 time with error from login mocked function
 * 4. auth.token state must be undefined
 * 5. auth.user state must be undefined
 */

const fakeUser = {
  name: "test",
  id: "test",
  avatar: "avatar_link",
};

describe("authSlice tests", () => {
  describe("actions", () => {
    const { dispatch, getState } = store;

    beforeEach(() => {
      dispatch(clearAuth());
    });

    it("should set auth user", () => {
      expect(getState().auth.user).toBeUndefined();

      const user: User = fakeUser;

      dispatch(setAuthUser(user));
      expect(getState().auth.user).toStrictEqual(user);
    });

    it("should set auth token", () => {
      expect(getState().auth.token).toBeUndefined();

      dispatch(setAuthToken("test_token"));
      expect(getState().auth.token).toEqual("test_token");
    });
  });

  describe("thunks", () => {
    const { dispatch, getState } = store;

    // mocks
    vi.mock("../src/utils/api", () => ({
      login: vi.fn(),
      getProfile: vi.fn(),
    }));
    vi.stubGlobal("alert", vi.fn());

    vi.mocked(login).mockImplementation(async ({ email, password }: ILogin) => {
      if (!email || !password) {
        return { error: "email or password is empty" };
      }

      if (password === "wrong") {
        return { error: "password is wrong" };
      }

      const token = email + "_token";

      return token;
    });
    vi.mocked(getProfile).mockImplementation(async () => {
      if (getState().auth.token === "test_token") {
        return fakeUser;
      }

      return { error: "user not found" };
    });

    beforeEach(() => {
      dispatch(clearAuth());
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should login, set token, and set user", async () => {
      const input = { email: "test", password: "test" };

      await dispatch(asyncLogin(input));

      expect(login).toBeCalledWith(input);
      expect(login).toBeCalledTimes(1);

      expect(alert).toBeCalledTimes(0);

      expect(getState().auth.token).toEqual("test_token");
      expect(getState().auth.user).toStrictEqual(fakeUser);
    });

    it("should login, set token, fail on getProfile", async () => {
      const input = { email: "test2", password: "test2" };

      await dispatch(asyncLogin(input));

      expect(login).toBeCalledWith(input);
      expect(login).toBeCalledTimes(1);

      expect(alert).toBeCalledWith("user not found");
      expect(alert).toBeCalledTimes(1);

      expect(getState().auth.token).toEqual("test2_token");
      expect(getState().auth.user).toBeUndefined();
    });

    it("should fail at login", async () => {
      const input = { email: "test2", password: "wrong" };

      await dispatch(asyncLogin(input));

      expect(login).toBeCalledWith(input);
      expect(login).toBeCalledTimes(1);

      expect(alert).toBeCalledWith("password is wrong");
      expect(alert).toBeCalledTimes(1);

      expect(getState().auth.token).toBeUndefined();
      expect(getState().auth.user).toBeUndefined();
    });
  });
});
