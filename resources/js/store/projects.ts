import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:8100/api/projects';
            
export const fetchProjects = createAsyncThunk(
    'projects/fetch-projects',
    async (pageNumber: number) => {
        const response = await axios.get(baseUrl + '?page=' + pageNumber);
        return response.data;
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        last_page: '',
        projects: [],
        loaded: false
    },
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchProjects.fulfilled, (state, action) => {
            state.projects = action.payload.data;
            state.last_page = action.payload.last_page;
            state.loaded = true;
        });
    }
});

export default projectSlice.reducer;