import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { combineReducers } from 'redux';

import projectSlice from './projects';
import userSlice from './user';
import linksSlice from './links';
import projectEditSlice from './projectEdit';

const reducer = combineReducers({
    projectSlice,
    userSlice,
    linksSlice,
    projectEditSlice
});

const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;