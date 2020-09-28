import * as React from 'react';
import { Image } from 'react-native';
import { Block, GalioProvider } from 'galio-framework';
import SplashScreen from 'react-native-splash-screen';
import Screens from './navigation/Screens';
import AuthScreens from './navigation/AuthScreens';
import { Images, nowTheme } from './constants';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from './helpers/authContext';
import HttpService from './services/HttpService';
import Spinner from 'react-native-loading-spinner-overlay';


// cache app images
const assetImages = [
  Images.Onboarding,
  Images.Logo,
  Images.paystack
];
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
  });
}

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        case 'LOADING_OUT':
          return {
            ...prevState,
            isLoading: false
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        
        userToken = await AsyncStorage.getItem('userToken');
        let response = await HttpService.GetAsync('api/Account/user', userToken)
  
        console.log(response);
        let json = await response.json();
          if(json != undefined){
            console.log(json)
          await AsyncStorage.setItem(
            'user',
            JSON.stringify(json)
          )
          
          dispatch({ type: 'RESTORE_TOKEN', token: userToken });
          }
          dispatch({type: 'LOADING_OUT'})
      } catch (e) {
        dispatch({type: 'LOADING_OUT'})
        // Restoring token failed
        dispatch({ type: 'SIGN_OUT' })
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      
    };

    bootstrapAsync();
    SplashScreen.hide();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        let token = null;
        try {
          if (
            data &&
            data.email !== undefined &&
            data.password !== undefined
          ) {
          let response = await HttpService.PostAsync('api/Account/token', {
                email: data.email,
                password: data.password
              }
          );
          console.log(response);
          if(response.status == 400){
            alert("Invalid login attempt");
          }else{
          let json = await response.json();
          token = json.token;
          console.log(token);
          if(token != null){
            await AsyncStorage.setItem(
              'userToken',
              token
            )
            let response = await HttpService.GetAsync('api/Account/user', token);
      
            console.log(response);
            let json = await response.json();
              await AsyncStorage.setItem(
                'user',
                JSON.stringify(json)
              )
          }
        }
          }else{
            console.log(data);

          }
        
        } catch (error) {
          console.error(error);
        }
        if(token != null){
        dispatch({ type: 'SIGN_IN', token: token });
        }
      },
      signOut: async () => {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("user");
        dispatch({ type: 'SIGN_OUT' })
      }
      
    }),
    []
  );


      return (
        <AuthContext.Provider value={authContext}>
        <GalioProvider theme={nowTheme}>
        <Spinner
                  visible={state.isLoading}
                  textContent={'Loading...'}
                />
          <Block flex>
          {state.userToken != null ? (
            <Screens />
          ) : ( <AuthScreens />)}
          </Block>
        </GalioProvider>
        </AuthContext.Provider>
      );
    
}
