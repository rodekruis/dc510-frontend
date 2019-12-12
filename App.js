import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './app/screens/Home';
import About from './app/screens/About';

const AppNavigator = createStackNavigator(
  {
    Home,
    About
  },
  {
    initialRouteName: 'Home'
  }
);

export default createAppContainer(AppNavigator);
