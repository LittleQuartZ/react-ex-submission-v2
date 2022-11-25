import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/slice";
import threadsSlice from "./threads/slice";
import usersSlice from "./users/slice";

const store = configureStore({
  reducer: {
    [threadsSlice.name]: threadsSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [usersSlice.name]: usersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkAPI = {
  dispatch: AppDispatch;
  state: RootState;
};

export default store;
