import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import projectSlice from './projects';

const reducer = combineReducers({
    projectSlice
});

const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;

export default store;