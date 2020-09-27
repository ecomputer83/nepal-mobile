import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createIconSetFromFontello } from 'react-native-vector-icons';
// screens
import Login from '../screens/Login';
import Register from '../screens/Register';
import Onboarding from '../screens/Onboarding';

import RegReview from '../screens/RegReview';
// drawer
import Menu from './Menu';

import fontelloConfig from '../config.json';
const Fontello = createIconSetFromFontello(fontelloConfig);

const AppStack = createStackNavigator(
  {
    Onboarding: {
      screen: Onboarding,
      navigationOptions: {
        header: null,
    },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
    },
    },
    Register: {
      screen: Register,
      navigationOptions: {
        header: null,
    },
    },
    RegReview: {
      screen: RegReview,
      navigationOptions: {
        header: null,
    },
    }
    
  }
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;
