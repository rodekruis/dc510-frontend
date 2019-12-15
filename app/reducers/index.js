import { combineReducers } from 'redux';
import { createNavigationReducer } from 'react-navigation-redux-helpers';
import AppNavigator from '../navigator';

import user from './user';

const nav = createNavigationReducer(AppNavigator);

export default combineReducers({
  user,
  nav
});
