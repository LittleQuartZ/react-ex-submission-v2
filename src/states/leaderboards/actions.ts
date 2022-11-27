import { createAction } from "@reduxjs/toolkit";
import { Placement } from "../../utils/api";

export const setLeaderboards = createAction<Placement[], "leaderboards/set">(
  "leaderboards/set"
);
