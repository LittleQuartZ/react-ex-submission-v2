import { configureStore } from "@reduxjs/toolkit";
import threadsSlice from "./threads/slice";

const store = configureStore({
  reducer: {
    [threadsSlice.name]: threadsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkAPI = {
  dispatch: AppDispatch;
  state: RootState;
};

export default store;
