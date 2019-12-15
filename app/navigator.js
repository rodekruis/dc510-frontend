import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import Home from './screens/Home';
import About from './screens/About';
import Login from './screens/Login';
import AuthLoading from './screens/AuthLoading';

const AppStack = createStackNavigator({
  Home,
  About
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
