import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: {
            last_page: '',
            data: []
        }
    },
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        }
    }
});

export default projectSlice.reducer;

const baseUrl = 'http://localhost:8100/api/projects';

export const fetchProjects = (page: string) => async (dispatch: Function) => {
    try {
        const response = await axios.get(baseUrl + '?page=' + page);
        dispatch(projectSlice.actions.setProjects(response.data));
    } catch (err) {
        return console.error(err);
    }
}