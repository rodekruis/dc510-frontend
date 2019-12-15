import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

const navMiddleware = createReactNavigationReduxMiddleware(state => state.nav);

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), navMiddleware]
});

export default store;
