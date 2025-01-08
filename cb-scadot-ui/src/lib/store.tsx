import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appSlice from '@/lib/slices/AppSlice';
import moduleSlice from '@/lib/slices/ModuleSlice';
import apiTestingSlice from '@/lib/slices/ApiTestingSlice';
import projectSlice from '@/lib/slices/ProjectSlice';

const reducer = combineReducers({
  app: appSlice,
  module: moduleSlice,
  apiTesting: apiTestingSlice,
  project: projectSlice,
});

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
