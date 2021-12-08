import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:8100/api/';

export const logout = createAsyncThunk(
    'user/logout',
    async () => {
        const token = localStorage.getItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        await axios.post(baseUrl + 'logout', {} , { headers: { 'Authorization': `Bearer ${token}` }});
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: -1,
        username: '',
        token: '',
        email: ''
    },
    reducers: {
        setUserFromLocalStorage: (state) => {
            if (localStorage.getItem('username') !== null && localStorage.getItem('token') !== null) {
                state.id = Number(localStorage.getItem('id'));
                state.username = String(localStorage.getItem('username'));
                state.token = String(localStorage.getItem('token'));
            }
        },
        login: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.token = action.payload.token;

            localStorage.setItem('id', String(action.payload.id));
            localStorage.setItem('username', action.payload.username);
            localStorage.setItem('token', action.payload.token);
        },
        setUsername: (state, action) => {
            state.username = action.payload.username;
            localStorage.setItem('username', action.payload.username);
        },
        setEmail: (state, action) => {
            state.email = action.payload.email;
        }
    },
    extraReducers: builder => {
        builder.addCase(logout.fulfilled, (state) => {
            state.id = -1;
            state.username = '';
            state.token = '';
            localStorage.clear();
        })
    }
});

export const { setUserFromLocalStorage, login, setUsername, setEmail } = userSlice.actions;

export default userSlice.reducer;