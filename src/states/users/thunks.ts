import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunkAPI } from "..";
import { getAllUsers } from "../../utils/api";
import { setUsers } from "./actions";

export const asyncGetAllUsers = createAsyncThunk<void, undefined, AppThunkAPI>(
  "users/fetch",
  async (_, { dispatch }) => {
    const users = await getAllUsers();

    if ("error" in users) {
      alert(users.error);
      return;
    }

    dispatch(setUsers(users));
  }
);
