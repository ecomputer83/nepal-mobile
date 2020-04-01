import React from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, Dimensions, Platform } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';

const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants/';
import { HeaderHeight } from '../constants/utils';

export default class Onboarding extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex>
          <Block middle>
                <Image source={Images.Logo} style={{ width: 262, height: 63, marginTop: 125}} />
              </Block>
          <Block space="between" style={styles.padded}>
            <Block>
              
            <Block>
            <Text size={22} style={{marginBottom:10, textAlign: 'center', fontFamily: 'HKGrotesk-Bold'}}>
            Welcome to NEPAL Oil & Gas Mobile
            </Text>
            </Block>
              

              <Block
              
                style={{
                  marginTop: theme.SIZES.BASE * 2.0,
                  marginBottom: theme.SIZES.BASE * 2
                }}
              >
                <Block>
                <Button
                  shadowless
                  style={styles.loginbutton}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={theme.COLORS.WHITE}
                  >
                    Log In
                  </Text>
                </Button>
                <Button
                  shadowless
                  style={styles.registerbutton}
                  color={nowTheme.COLORS.BODY}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={theme.COLORS.WHITE}
                  >
                    Register
                  </Text>
                </Button>
                </Block>
                <Block>
                
                </Block>
              </Block>
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
    marginTop: 103
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
