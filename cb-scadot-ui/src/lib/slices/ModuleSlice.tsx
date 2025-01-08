import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import request from '../request';
import { ModuleItem, PublicStatus, WorkflowStatus, RequestStatus, ApiPayload } from '../type-helper';

export interface AppState {
  loadingStatus: RequestStatus;
  modulesList: ModuleItem[];
}



const initialState: AppState = {
  loadingStatus: RequestStatus.IDLE,
  modulesList: [
    {
      id: '',
      module_name: '',
      module_type: '',
      language: '',
      framework: '',
      status: WorkflowStatus.DRAFT,
      is_public: PublicStatus.NO
    },
  ],
};
export const modulesSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      fetchModules.fulfilled,
      (state, { payload }) => {
        state.modulesList = payload || initialState.modulesList;
        state.loadingStatus = RequestStatus.SUCCEEDED;
      }
    );
  },
});

export const excuteApi = createAsyncThunk(
    'app/executeApi',
    async (args: { payload: ApiPayload }) => {
        const dummyResults = {
            ...args.payload,
            success: true
        }
        return dummyResults;
        // const url = '';
        // const res = await request({
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   url: url,
        //   data: args.payload
        // });
    }

);
export const createModule = createAsyncThunk(
  'app/createModule',
    async (args: { payload: ApiPayload, projectId: string }) => {
    const url = `/projects/${args.projectId}/modules`;
    const dataToSubmit = {
        name: args.payload.name,
        language: args.payload.language,
        technology: args.payload.technology,
        framework: args.payload.framework,
        visibility: args.payload.isPublic?.toString() === "yes" ? "public" : "private",
    }
    console.log(`createModule - data to submit to ${url}: `, dataToSubmit);
    // localStorage.getItem('token')
    if ( process.env.NEXT_PUBLIC_APP_API_KEY ) {
      const res = await request({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        url: url,
        data: dataToSubmit
      });
      return res;
    }
    return {success: true};
    
  }
  
);

export const fetchModules = createAsyncThunk(
  'app/fetchModules',
  
  async (args: { projectId: string }) => {
    const url = `/projects/${args.projectId}/modules`;
    return dummyModuleList;
    // const res = await request({
    //   url: url,
    // });
    // return res;
  }
  
);
const dummyModuleList: ModuleItem[] = 
[
  {
    id: "1", module_name: "Module 1", module_type: "Type 1", language: "Rust", 
    framework: "Stellar", status: WorkflowStatus.PUBLISHED, is_public: PublicStatus.YES
  },
  {
    id: "1", module_name: "Module 2", module_type: "Type 2", language: "Golang", 
    framework: "Solana", status: WorkflowStatus.PUBLISHED, is_public: PublicStatus.NO
  }
]

export default modulesSlice.reducer;
