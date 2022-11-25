import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../utils/api";
import { setUsers } from "./actions";

const initialState: User[] = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(setUsers, (_, { payload }) => {
      return payload;
    });
  },
});

export default usersSlice;
