import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import AuthLoading from './screens/AuthLoading';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Login from './screens/Login';

const AppStack = createStackNavigator({
  Home,
  Profile
});

const AuthStack = createStackNavigator({ Login });

export default createSwitchNavigator(
  {
    AuthLoading,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
);
