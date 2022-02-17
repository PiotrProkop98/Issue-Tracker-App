import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:8100/api';

export const fetchNewIssues = createAsyncThunk(
    'issues/fetch-new-issues',
    async (token: string) => {
        const response = await axios.get(baseUrl + '/issue/new-issues',  { headers: { 'Authorization': `Bearer ${token}` }});
        return response.data;
    }
);

const issuesSlice = createSlice({
    name: 'issues',
    initialState: {
        newIssues: [],
        newIssuesLoading: false
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchNewIssues.pending, (state, action) => {
            state.newIssuesLoading = true;
        });

        builder.addCase(fetchNewIssues.fulfilled, (state, action) => {
            state.newIssues = action.payload.issues;
            state.newIssuesLoading = false;
        });
    }
});

export default issuesSlice.reducer;