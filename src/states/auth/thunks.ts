import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunkAPI } from "..";
import { getProfile, ILogin, login } from "../../utils/api";
import { setAuthUser, setAuthToken } from "./actions";

export const asyncGetUserProfile = createAsyncThunk<void, string, AppThunkAPI>(
  "auth/user/fetch",
  async (token, { dispatch }) => {
    const user = await getProfile(token);

    if ("error" in user) {
      alert(user.error);
      return;
    }

    dispatch(setAuthUser(user));
  }
);

export const asyncLogin = createAsyncThunk<void, ILogin, AppThunkAPI>(
  "auth/user/login",
  async (input, { dispatch, getState }) => {
    const loginResponse = await login(input);

    if (typeof loginResponse === "object") {
      alert("Login failed: " + loginResponse.error);
      return;
    }

    dispatch(setAuthToken(loginResponse));
    const token = getState().auth.token;

    if (!token) {
      alert("There is no token please login again!");
      return;
    }

    dispatch(asyncGetUserProfile(token));
  }
);
