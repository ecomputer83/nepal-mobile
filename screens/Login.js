import React, { useEffect, useState, useContext } from 'react';
import { ImageBackground, ScrollView, StyleSheet, StatusBar, Dimensions, Platform, TouchableWithoutFeedback,TouchableHighlight, Keyboard } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import AsyncStorage from '@react-native-community/async-storage'
import { validateAll } from 'indicative/validator';
const { height, width } = Dimensions.get('screen');
import { prod, nowTheme } from '../constants/';
import Spinner from 'react-native-loading-spinner-overlay';
import Input from '../components/Input';
import Icon from '../components/Icon';

import { AuthContext } from '../helpers/authContext';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);


export default function Login ( {navigation}) {

  const { signIn } = React.useContext(AuthContext);

  const [email, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [SignUpErrors, setSignUpErrors] = useState({});
  const handleLeftPress = () => {
    return navigation.goBack(null);
  };

  const Login = async () => {
    try {
      const rules = {
        email: 'required|email',
        password: 'required|string|min:6|max:40'
    };
    setSpinner(true);
    const data = { email, password };
    console.log(data);
    const messages = {
        required: field => `${field} is required`,
        'UserName.alpha': 'Username contains unallowed characters',
        'email.email': 'Please enter a valid email address',
        'Password.min': 'Wrong Password?'
    };

    validateAll(data, rules, messages)
        .then(() => {
            console.log('success sign in');
            
            signIn({ email, password });
            setSpinner(false)
        })
        .catch(err => {
            const formatError = {};
            err.forEach(err => {
                formatError[err.field] = err.message;
            });
            setSignUpErrors(formatError);
            setSpinner(false)
        });
    } catch (error) {
      // Error saving data
    }
  }

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
              onPress={handleLeftPress}
              color={nowTheme.COLORS.ICON}
            />
          </Block>
          <Spinner
                  visible={spinner}
                  textContent={'Loading...'}
                  textStyle={styles.spinnerTextStyle}
                />
                 <ScrollView>
          <Block space="between" style={styles.padded}>
            <Block>
            <Block>
            <Text size={28} style={{marginLeft: 21, marginBottom:5, fontFamily: 'HKGrotesk-Bold'}}>
            Log In to continue
            </Text>
            </Block>
              <Block style={{
                  marginTop: theme.SIZES.BASE, marginLeft:20
                }}>
                <Block style={{marginVertical: 2.5}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Email
                  </Text>
                <Input
                    left
                    color="black"
                    style={styles.input}
                    placeholder="Enter email here"
                    onChangeText={setUserName}
                    noicon
                    errorMessage={SignUpErrors.email}
                />
                </Block>
                <Block style={{marginVertical: 2.5}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Password
                  </Text>
                <Input
                    placeholder="Enter password here"
                    noicon
                    color="black"
                    style={styles.input}
                    onChangeText={setPassword}
                    password
                    errorMessage={SignUpErrors.password}
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
                  onPress={() => Login()}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={theme.COLORS.WHITE}
                  >
                    Log In
                  </Text>
                </Button>
                <TouchableHighlight onPress={() => {navigation.navigate('ForgotPassword');}}><Text style={{fontSize: 16, lineHeight: 18, fontFamily: 'ProductSans-Medium', color: '#23C9F1', marginTop: 10, textAlign: 'center'}}>Forgot Password</Text></TouchableHighlight>

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: nowTheme.COLORS.SCREEN,
    marginTop: Platform.OS === 'android' ? 0 : 0
  },
  padded: {
    marginTop: 139
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
