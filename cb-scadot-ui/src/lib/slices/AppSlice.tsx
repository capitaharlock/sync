import { createSlice } from '@reduxjs/toolkit';

export interface IProject {
  id?: number;
}

export interface AppState {
  projects: IProject[];
  createProjectProgress: {
    currentStep: number;
    radioIndex: number;
  }
  currentProject: {
    id: string;
  }
}

const initialState: AppState = {
  projects: [],
  currentProject: {
    id: '',
  },
  createProjectProgress: {
    currentStep: 1,
    radioIndex: 0
  }
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentRequest: (state, action) => {
      state.currentProject = action.payload;
    },
    setCreateProjectProgress: (state, action) => {
      state.createProjectProgress = action.payload;
    }
  },
});

export const {
  setCurrentRequest,
  setCreateProjectProgress
} = appSlice.actions;

export default appSlice.reducer;
