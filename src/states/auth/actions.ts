import { createAction } from "@reduxjs/toolkit";
import { type User } from "../../utils/api";

export const setAuthToken = createAction<string, "auth/token/set">(
  "auth/token/set"
);

export const setAuthUser = createAction<User, "auth/user/set">("auth/user/set");
export const clearAuth = createAction<void, "auth/clear">("auth/clear");
