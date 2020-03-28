import React from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, Dimensions, Platform, TouchableHighlight } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';

const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';

export default class Onboarding extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex>
          <Block middle>
                <Image source={Images.Logo} style={{ width: 262, height: 63 }} />
              </Block>
          <Block space="between" style={styles.padded}>
            <Block>
              
            <Block middle style={{marginBottom: 10}}>
            <Block width={47} height={47} style={{ backgroundColor: '#121112', marginBottom: 13, marginTop: 33, borderRadius: 50}}>
                      </Block>

                      
            <Text size={19} style={{marginBottom:10, fontFamily: 'ProductSans-Bold'}}>
            Great!
            </Text>
            <Text style={{fontSize: 15, lineHeight: 18, fontFamily: 'ProductSans-Regular', textAlign: 'center'}}>Your business detail has been successfully submitted and we are super grateful for the patronage.</Text>
            <Text style={{fontSize: 15, lineHeight: 18, fontFamily: 'ProductSans-Regular', textAlign: 'center'}}> Our Sales Executive will contact you shortly to complete the registration process before you can start your online ordering.</Text>
            </Block>
            <TouchableHighlight onPress={() => navigation.navigate('Onboarding')}>
                                <Text size={14} style={{color: '#23C9F1', textAlign: 'center', lineHeight: 30, fontFamily: 'ProductSans-Medium'}}>
                                Go back home
                                </Text>
                                </TouchableHighlight>

              </Block>
          </Block>
        </Block>
      </Block>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    backgroundColor: nowTheme.COLORS.SCREEN,
    marginTop: Platform.OS === 'android' ? 0 : 0
  },
  padded: {
    marginTop: 123,
    marginHorizontal: 20
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginTop: 5
  },

  loginbutton: {
    width: (width - 40),
    height: 40,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10
  },

  registerbutton: {
    width: (width - 40),
    height: 40,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10
  },

  gradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66
  }
});
