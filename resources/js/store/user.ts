import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:8100/api/';

export const logout = createAsyncThunk(
    'user/logout',
    async () => {
        const token = localStorage.getItem('token');
        await axios.post(baseUrl + 'logout', { token: token });
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        token: ''
    },
    reducers: {
        setUserFromLocalStorage: (state) => {
            if (localStorage.getItem('username') !== null && localStorage.getItem('token') !== null) {
                state.username = String(localStorage.getItem('username'));
                state.token = String(localStorage.getItem('token'));
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(logout.fulfilled, (state) => {
            state.username = '';
            state.token = '';
            localStorage.clear();
        })
    }
});

export const { setUserFromLocalStorage } = userSlice.actions;

export default userSlice.reducer;