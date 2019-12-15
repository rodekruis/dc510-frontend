import { AsyncStorage } from 'react-native';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';

import rootReducer from './reducers';

const navMiddleware = createReactNavigationReduxMiddleware(state => state.nav);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // https://github.com/reduxjs/redux-toolkit/issues/150
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false }),
    navMiddleware,
    logger
  ]
});

export const persistor = persistStore(store);

export default store;
