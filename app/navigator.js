import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import AuthLoading from './screens/AuthLoading';
import Login from './screens/Login';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Task from './screens/Task';
import AddObservations from './screens/AddObservations';

const AppStack = createStackNavigator({
  Home,
  Profile,
  Task,
  AddObservations
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
