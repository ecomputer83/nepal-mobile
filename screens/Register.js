import React from 'react';
import { ScrollView, StyleSheet, StatusBar, Dimensions, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import PhoneInput from 'react-native-phone-input'
const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants/';
import { HeaderHeight } from '../constants/utils';
import Input from '../components/Input';
import Icon from '../components/Icon';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);
export default class Login extends React.Component {
  state = {
    phoneNumber: ''
  }
  handleLeftPress = () => {
    const { navigation } = this.props;
    return navigation.goBack(null);
  };
  render() {
    const { navigation } = this.props;
    const { phoneNumber } = this.state;

    return (
      <DismissKeyboard>
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex>
          <Block style={{marginLeft: 16, marginTop: 10}}>
          <Icon
              name={'chevron-left'}
              family="octicon"
              size={20}
              onPress={this.handleLeftPress}
              color={nowTheme.COLORS.ICON}
            />
          </Block>
          <ScrollView>
          <Block space="between" style={styles.padded}>
            <Block>
            <Block>
            <Text size={20} style={{marginLeft: 21, marginBottom:5, fontFamily: 'HKGrotesk-Bold'}}>
            We are glad to take you on board!
            </Text>
            </Block>
              <Block style={{
                  marginTop: 5, marginLeft:20
                }}>
                <Block style={{marginVertical: 1}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Business Name
                  </Text>
                <Input
                    left
                    color="black"
                    style={styles.input}
                    placeholder="Enter  business name here"
                    noicon
                />
                </Block>
                <Block style={{marginVertical: 1}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  CAC RC Number
                  </Text>
                <Input
                    left
                    color="black"
                    style={styles.input}
                    placeholder="Enter cac number here"
                    noicon
                />
                </Block>
                <Block style={{marginVertical: 1}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Business Address
                  </Text>
                <Input
                    left
                    color="black"
                    style={styles.input}
                    placeholder="Enter business address"
                    noicon
                />
                </Block>
                <Block style={{marginVertical: 1}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Contact Person's Name
                  </Text>
                <Input
                    left
                    color="black"
                    style={styles.input}
                    placeholder="Enter name here"
                    noicon
                />
                </Block>
                <Block style={{marginVertical: 1}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Contact Phone Number
                  </Text>
                  <PhoneInput
                      initialCountry="ng"
                      allowZeroAfterCountryCode={false}
                      autoFormat={true}
                      value={phoneNumber}
                      textProps={{placeholder: 'Telephone number'}}
                      style={styles.custominput}
                      onChangePhoneNumber={value => this.setState({phoneNumber: value})}/>
                </Block>
                <Block style={{marginVertical: 1}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Email Address
                  </Text>
                <Input
                    left
                    color="black"
                    style={styles.input}
                    placeholder="Enter email here"
                    noicon
                />
                </Block>
                <Block style={{marginVertical: 1}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Password
                  </Text>
                <Input
                    placeholder="Enter password here"
                    noicon
                    color="black"
                    style={styles.input}
                    password
                />
                </Block>
                <Block style={{marginVertical: 1}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Confirm Password
                  </Text>
                <Input
                    placeholder="Enter confim password here"
                    noicon
                    color="black"
                    style={styles.input}
                    password
                />
                </Block>
              </Block>
              

              <Block
              
                style={{
                  marginTop: 3.5,
                  marginBottom: theme.SIZES.BASE * 10
                }}
              >
                <Block>
                <Button
                  shadowless
                  style={styles.button}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => navigation.navigate('RegReview')}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={theme.COLORS.WHITE}
                  >
                    Register
                  </Text>
                </Button>
                </Block>
                </Block>
            </Block>
          </Block>
          </ScrollView>
        </Block>
      </Block>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: nowTheme.COLORS.SCREEN,
    marginTop: Platform.OS === 'android' ? 0 : 0
  },
  padded: {
    marginTop: 9
  },
  button: {
    width: width - 40,
    height: 40,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5
  },
  custominput: {
    borderColor: nowTheme.COLORS.BORDER,
    borderWidth: 1,
    height: 38,
    width:  width - 42,
    marginLeft: 1,
    marginRight: 1,
    borderRadius: 0,
    paddingLeft: 10
  },
  loginbutton: {
    width: (width /2) - (theme.SIZES.BASE * 2 + 2.5),
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginRight: 5
  },

  registerbutton: {
    width: (width /2) - (theme.SIZES.BASE * 2 + 2.5),
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },

  gradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66
  },
  input: {
    height: 38,
    width:  width - 42,
    marginLeft: 1,
    marginRight: 1,
    borderRadius: 0,
    fontFamily: 'HKGrotesk-Regular',
    borderColor: nowTheme.COLORS.BORDER
  },
});
