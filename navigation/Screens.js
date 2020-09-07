import React from 'react';
import { Block } from "galio-framework";
import { Easing, Animated, AsyncStorage } from 'react-native';
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
const AuthContext = React.createContext();
const Fontello = createIconSetFromFontello(fontelloConfig);

// const [state, dispatch] = React.useReducer(
//   (prevState, action) => {
//     switch (action.type) {
//       case 'RESTORE_TOKEN':
//         return {
//           ...prevState,
//           userToken: action.token,
//           isLoading: false,
//         };
//       case 'SIGN_IN':
//         return {
//           ...prevState,
//           isSignout: false,
//           userToken: action.token,
//         };
//       case 'SIGN_OUT':
//         return {
//           ...prevState,
//           isSignout: true,
//           userToken: null,
//         };
//     }
//   },
//   {
//     isLoading: true,
//     isSignout: false,
//     userToken: null,
//   }
// );

// React.useEffect(() => {
//   // Fetch the token from storage then navigate to our appropriate place
//   const bootstrapAsync = async () => {
//     let userToken;

//     try {
//       userToken = await AsyncStorage.getItem('userToken');
//     } catch (e) {
//       // Restoring token failed
//     }

//     // After restoring token, we may need to validate it in production apps

//     // This will switch to the App screen or Auth screen and this loading
//     // screen will be unmounted and thrown away.
//     dispatch({ type: 'RESTORE_TOKEN', token: userToken });
//   };

//   bootstrapAsync();
// }, []);

// const authContext = React.useMemo(
//   () => ({
//     signIn: async data => {
//       // In a production app, we need to send some data (usually username, password) to server and get a token
//       // We will also need to handle errors if sign in failed
//       // After getting token, we need to persist the token using `AsyncStorage`
//       // In the example, we'll use a dummy token

//       dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
//     },
//     signOut: () => dispatch({ type: 'SIGN_OUT' }),
//     signUp: async data => {
//       // In a production app, we need to send user data to server and get a token
//       // We will also need to handle errors if sign up failed
//       // After getting token, we need to persist the token using `AsyncStorage`
//       // In the example, we'll use a dummy token

//       dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
//     },
//   }),
//   []
// );

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
        header: <Header bgColor={nowTheme.COLORS.PRIMARY} noNav message iconColor={nowTheme.COLORS.WHITE} title="" navigation={navigation} />
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
