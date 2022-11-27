import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunkAPI } from "..";
import { getLeaderboards } from "../../utils/api";
import { setLeaderboards } from "./actions";

export const asyncGetLeaderboards = createAsyncThunk<
  void,
  undefined,
  AppThunkAPI
>("leaderboards/fetch", async (_, { dispatch }) => {
  const leaderboards = await getLeaderboards();

  if ("error" in leaderboards) {
    alert(leaderboards.error);
    return;
  }

  dispatch(setLeaderboards(leaderboards));
});
