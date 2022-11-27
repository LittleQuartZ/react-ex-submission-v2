import { createSlice } from "@reduxjs/toolkit";
import { Placement } from "../../utils/api";
import { setLeaderboards } from "./actions";

const initialState: Placement[] = [];

const leaderboardsSlice = createSlice({
  name: "leaderboards",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(setLeaderboards, (_, { payload }) => payload);
  },
});

export default leaderboardsSlice;
