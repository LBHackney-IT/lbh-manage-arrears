import { configureStore } from "@reduxjs/toolkit";
import { incomeApi } from './services/income'
import { createWrapper } from 'next-redux-wrapper';

export const initStore = () => configureStore({
  reducer: {
    [incomeApi.reducerPath]: incomeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(incomeApi.middleware),
});

export const storeWrapper = createWrapper(initStore);