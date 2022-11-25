import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunkAPI } from "..";
import {
  getProfile,
  ILogin,
  IRegister,
  login,
  registerUser,
} from "../../utils/api";
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
      alert(loginResponse.error);
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

export const asyncRegister = createAsyncThunk<void, IRegister, AppThunkAPI>(
  "auth/user/register",
  async (input, { dispatch }) => {
    const user = await registerUser(input);

    if ("error" in user) {
      alert(user.error);
      return;
    }

    dispatch(asyncLogin({ email: input.email, password: input.password }));
  }
);
