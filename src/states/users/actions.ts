import { createAction } from "@reduxjs/toolkit";
import type { User } from "../../utils/api";

export const setUsers = createAction<User[], "users/set">("users/set");
