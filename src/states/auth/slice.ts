import { createSlice } from "@reduxjs/toolkit";
import { type User } from "../../utils/api";
import { clearAuth, setAuthUser, setAuthToken } from "./actions";

const initialState: { user?: User; token?: string } = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(setAuthUser, (state, { payload }) => {
      return { ...state, user: payload };
    });
    b.addCase(clearAuth, () => {
      return {};
    });
    b.addCase(setAuthToken, (state, { payload }) => {
      return { ...state, token: payload };
    });
  },
});

export default authSlice;
