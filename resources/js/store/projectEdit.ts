import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FetchProjectEditData {
    id: number,
    token: string
};

export const fetchProjectEditData = createAsyncThunk(
    'projects/fetch-project-edit-data',
    async (data: FetchProjectEditData) => {
        const response = await axios.get(
            `http://localhost:8100/api/project/edit-get/${data.id}`,
            { headers: { 'Authorization': `Bearer ${data.token}` }}
        );
        
        return response.data;
    }
);

const projectEditSlice = createSlice({
    name: 'project-edit',
    initialState: {
        isLoading: false,
        name: '',
        description: '',
        developer_company_name: '',
        client_company_name: '',
        is_private: false
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchProjectEditData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.name = action.payload.name;
            state.description = action.payload.description;
            state.developer_company_name = action.payload.developer_company_name;
            state.client_company_name = action.payload.client_company_name;
            state.is_private = action.payload.is_private;
        });

        builder.addCase(fetchProjectEditData.pending, (state, action) => {
            state.isLoading = true;
        });
    }
});

export default projectEditSlice.reducer;