import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Project } from '../type-helper';
import request from '../request';
import { formatDate, transformVisibility } from '@/utils/transformUtil';

export interface AppState {
    projects: Array<Project>;
}
const initialState: AppState = {
    projects: [],
    
};

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(
            fetchProjects.fulfilled,
            (state, { payload }) => {
                state.projects = payload;
            },
        );
    },
});

const transformProjectData = (data: any): Array<Project> => {
    for (let project of data) {
        project.dateCreated = formatDate(project.date_time_created);
        project.isPublic =  transformVisibility(project.visibility);
    }
    return data;
}
export const fetchProjects = createAsyncThunk(
    'app/fetchProjects',
    async () => {
        const url = `/projects?page=1&limit=20`;
        const res = await request({
            method: 'GET',
            url: url
        });
        if (res && res.data) {
            return transformProjectData(res.data);
        } else {
            return transformProjectData(projectDummyData);
        }
    }
);

export default projectSlice.reducer;


const projectDummyData: Array<Project> = [
    {
        "id": 34,
        "name": "project 1",
        "description": "Test project description",
        "ado_id": "",
        "status": "active",
        "visibility": "private",
        "user_id": 67,
        "date_time_created": "2024-12-23T20:51:02.917115Z",
        "date_time_modified": "2024-12-23T20:51:02.917115Z",
        "user": {
            "id": 67,
            "email": "fkn3@test.com",
            "name": "F Doe",
            "date_time_created": "2024-12-23T20:27:16.323301Z",
            "date_time_modified": "2024-12-23T20:27:16.323301Z"
        }
    },
    {
        "id": 67,
        "name": "project 2",
        "description": "Test project 2 description",
        "ado_id": "",
        "status": "active",
        "visibility": "private",
        "user_id": 67,
        "date_time_created": "2024-12-23T21:01:37.335759Z",
        "date_time_modified": "2024-12-23T21:01:37.335759Z",
        "user": {
            "id": 67,
            "email": "fkn3@test.com",
            "name": "F Doe",
            "date_time_created": "2024-12-23T20:27:16.323301Z",
            "date_time_modified": "2024-12-23T20:27:16.323301Z"
        }
    },
    
];