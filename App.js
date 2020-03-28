import React from 'react';
import { Image } from 'react-native';
import { Block, GalioProvider } from 'galio-framework';
import SplashScreen from 'react-native-splash-screen';
import Screens from './navigation/Screens';
import { Images, nowTheme } from './constants';

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

export default class App extends React.Component {
  state = {
    fontLoaded: false
  };

  componentDidMount() {
    SplashScreen.hide()
  }

  render() {
  
      return (
        <GalioProvider theme={nowTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      );
    
  }

  _loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(assetImages)]);
  };
}
