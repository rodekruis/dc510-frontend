import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import logger from 'redux-logger';
import rootReducer from './reducers';

const navMiddleware = createReactNavigationReduxMiddleware(state => state.nav);

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), navMiddleware, logger]
});

export default store;
