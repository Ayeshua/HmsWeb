import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginReducer from './slices/login';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
};
const reducers = combineReducers({
	hms_login: loginReducer,
});
const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
	reducer: persistedReducer,
});
