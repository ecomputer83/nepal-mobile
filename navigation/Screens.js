import React from 'react';
import { Block } from "galio-framework";
import { Easing, Animated } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createIconSetFromFontello } from 'react-native-vector-icons';
// screens
import Home from '../screens/Home';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Onboarding from '../screens/Onboarding';
import MakeOrder from '../screens/MakeOrder';
import CardPayment from '../screens/CardPayment';
import Programming from '../screens/Programming';
import TrackOrder from '../screens/TrackOrder';
import Insight from '../screens/Insight';
import RegReview from '../screens/RegReview';
// drawer
import Menu from './Menu';

import fontelloConfig from '../config.json';
import nowTheme from '../constants/Theme';

// header for screens
import Header from '../components/Header';

const Fontello = createIconSetFromFontello(fontelloConfig);
const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = 'Search';

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        header: <Header bgColor={nowTheme.COLORS.PRIMARY} message iconColor={nowTheme.COLORS.WHITE} title="" navigation={navigation} />
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);


const TrackOrderStack = createStackNavigator(
  {
    TrackOrder: {
      screen: TrackOrder,
      navigationOptions: ({ navigation }) => ({
        header: <Header bgColor={nowTheme.COLORS.PRIMARY} iconColor={nowTheme.COLORS.WHITE} title="Orders" navigation={navigation} />
      })
    },
    MakeOrder: {
      screen: MakeOrder,
      navigationOptions: ({ navigation }) => {
        const { state } = navigation;
        let title = `${navigation.state.params && state.params.title ? state.params.title : 'Make Order'}`;
        header: <Header bgColor={nowTheme.COLORS.PRIMARY} iconColor={nowTheme.COLORS.WHITE} title={title} navigation={navigation} />
      }
    },
    CardPayment: {
      screen: CardPayment,
      navigationOptions: ({ navigation }) => ({
        header: <Header bgColor={nowTheme.COLORS.PRIMARY} iconColor={nowTheme.COLORS.WHITE} title="Card Payment" navigation={navigation} />
      })
    },
    Programming: {
      screen: Programming,
      navigationOptions: ({ navigation }) => ({
        header: <Header bgColor={nowTheme.COLORS.PRIMARY} iconColor={nowTheme.COLORS.WHITE} title="Program" navigation={navigation} />
      })
    }
  },
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);

const InsightsStack = createStackNavigator(
  {
    Insights: {
      screen: Insight,
      navigationOptions: ({ navigation }) => ({
        header: <Header bgColor={nowTheme.COLORS.PRIMARY} iconColor={nowTheme.COLORS.WHITE} title="Insights" navigation={navigation} />
      })
    },
  },
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);

const DispatchStack = createStackNavigator(
  {
    Dispatch: {
      screen: Programming,
      navigationOptions: ({ navigation }) => ({
        header: <Header bgColor={nowTheme.COLORS.PRIMARY} iconColor={nowTheme.COLORS.WHITE} title="Program" navigation={navigation} />
      })
    },
  },
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);

const TabStack = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Insights: { screen: InsightsStack },
    Orders: { screen: TrackOrderStack },
    Program: { screen: DispatchStack }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Fontello;
        let iconName;
        if (routeName === 'Home') {
          iconName = `home`;
        } else if (routeName === 'Orders') {
          iconName = `credit-card`;
        } else if (routeName === 'Program'){
          iconName = `truck`
        }
        else if (routeName === 'Insights') {
          iconName = `analytics`;
        }
        return <IconComponent name={iconName} size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: `${nowTheme.COLORS.PRIMARY}`,
      inactiveTintColor: `${nowTheme.COLORS.SECONDARY}`,
      style: {
        paddingTop:10,
        paddingBottom: 5,
        height: 50,
        borderWidth: 0 
      },      
      labelStyle: {        
       fontSize: 10,        
       lineHeight: 16,        
       fontFamily: "HKGrotesk-Regular",
       textTransform: 'uppercase'   
      },
      tabStyle: {
        borderWidth: 0
      }
    },
  }
)

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
    },
    Home: {
      screen: TabStack,
      navigationOptions: {
        header: null,
    },
    }
    
  },
  Menu
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;
