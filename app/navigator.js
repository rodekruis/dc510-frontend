import { createStackNavigator } from 'react-navigation-stack';

import Home from './screens/Home';
import About from './screens/About';

const AppNavigator = createStackNavigator(
  {
    Home,
    About
  },
  {
    initialRouteName: 'Home'
  }
);

export default AppNavigator;
