import { createSlice } from '@reduxjs/toolkit';

const linksSlice = createSlice({
    name: 'links',
    initialState: {
        links: [
            'Public projects',
            'Log in',
            'Sing up'
        ],
        urls: [
            '/',
            '/login',
            '/register'
        ]
    },
    reducers: {
        setLoggedOutLinks: state => {
            state.links = [
                'Public projects',
                'Log in',
                'Sing up'
            ];

            state.urls = [
                '/',
                '/login',
                '/register'
            ];
        },
        setLoggedInLinks: state => {
            state.links = [
                'Public projects',
                'Dashboard'
            ];

            state.urls = [
                '/',
                '/Dashboard'
            ];
        }
    }
});

export const { setLoggedOutLinks, setLoggedInLinks } = linksSlice.actions;

export default linksSlice.reducer;