import React, { useEffect, useState, useContext } from 'react';
import { ImageBackground, ScrollView, StyleSheet, StatusBar, Dimensions, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import AsyncStorage from '@react-native-community/async-storage'
import { validateAll } from 'indicative/validator';
const { height, width } = Dimensions.get('screen');
import { prod, nowTheme } from '../constants';
import Spinner from 'react-native-loading-spinner-overlay';
import Input from '../components/Input';
import Icon from '../components/Icon';
import HttpService from '../services/HttpService';
import { AuthContext } from '../helpers/authContext';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);


export default class ForgotPassword  extends React.Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
    context: 0,
    spinner: false,
    SignUpErrors: {}
  }

  handleLeftPress = () => {
    return this.props.navigation.goBack(null);
  };

  SendValidationCode = async () => {
    try {
      const rules = {
        email: 'required|email',
    };
    this.setState({spinner: true});
    const data = { email: this.state.email };
    console.log(data);
    const messages = {
        required: field => `${field} is required`,
        'email.email': 'Please enter a valid email address',
    };

    validateAll(data, rules, messages)
        .then(() => {
          HttpService.PostAsync('api/account/forgotPassword', {email: data.email}).then(response => {
            console.log(response)
            if(response.status == 200){
              alert("The Validation code has been sent to your email address, Kindly get the code to continue");
              this.setState({context: 1, spinner: false});
            }else{
              alert("There is an error while validating your email");
              this.setState({spinner: false});
            }
          })
        })
        .catch(err => {
            const formatError = {};
            err.forEach(err => {
                formatError[err.field] = err.message;
            });
            this.setState({SignUpErrors: formatError, spinner: false});
        });
    } catch (error) {
      // Error saving data
    }
  }
  ResetPassword = async () => {
    try {
      const rules = {
        code: 'required|number',
        email: 'required|email',
        password: 'required|string|min:6|max:40|confirmed'
    };
    this.setState({spinner: true});
    const data = { 
      code: this.state.code,
      email: this.state.email, 
      password: this.state.password,
      password_confirmation: this.state.confirmPassword,
      confirmPassword: this.state.confirmPassword };
    console.log(data);
    const messages = {
        required: field => `${field} is required`,
        'UserName.alpha': 'Username contains unallowed characters',
        'email.email': 'Please enter a valid email address',
        'Password.min': 'Wrong Password?'
    };

    validateAll(data, rules, messages)
        .then(() => {
            HttpService.PostAsync('api/Account/resetPassword', data).then(response => {
              if(response.status == 200){
                alert("Your password has been reset successfully, please login!");
                this.props.navigation.goBack("Login");
              }else{
                alert("Error resetting your password, try again later");
              }
            })
            this.setState({spinner: false})
        })
        .catch(err => {
            const formatError = {};
            err.forEach(err => {
                formatError[err.field] = err.message;
            });
            this.setState({SignUpErrors: formatError, spinner: false});
        });
    } catch (error) {
      // Error saving data
    }
  }

  ValidationView = () => {
    return (<Block space="between" style={styles.padded}>
    <Block>
    <Block>
    <Text size={28} style={{marginLeft: 21, fontFamily: 'HKGrotesk-Bold'}}>
    Forget Password
    </Text>
    <Text size={16} style={{marginLeft: 21, marginBottom:5, fontFamily: 'HKGrotesk-Regular'}}>
    Validate your email
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
            onChangeText={(text)=> this.setState({email: text})}
            noicon
            errorMessage={this.state.SignUpErrors.email}
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
          onPress={() => this.SendValidationCode()}
        >
          <Text
            style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
            color={theme.COLORS.WHITE}
          >
            Validate
          </Text>
        </Button>
        </Block>
        </Block>
    </Block>
  </Block>
  );
  }

  ResetView = () => {
    return (<Block space="between" style={styles.opadded}>
    <Block>
    <Block>
    <Text size={28} style={{marginLeft: 21, fontFamily: 'HKGrotesk-Bold'}}>
    Reset Password
    </Text>
    <Text size={16} style={{marginLeft: 21, marginBottom:5, fontFamily: 'HKGrotesk-Regular'}}>
    reset password with validation code sent to your email
    </Text>
    </Block>
      <Block style={{
          marginTop: theme.SIZES.BASE, marginLeft:20
        }}>
        <Block style={{marginVertical: 2.5}}>
        <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
          Validation Code
          </Text>
        <Input
            left
            color="black"
            style={styles.input}
            placeholder="Enter code here"
            onChangeText={(text)=> this.setState({code: text})}
            noicon
            keyboardType="numeric"
            errorMessage={this.state.SignUpErrors.code}
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
            onChangeText={(text)=> this.setState({password: text})}
            password
            errorMessage={this.state.SignUpErrors.password}
        />
        </Block>
        <Block style={{marginVertical: 2.5}}>
        <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
          Confirm Password
          </Text>
        <Input
            placeholder="Enter confirm password here"
            noicon
            color="black"
            style={styles.input}
            onChangeText={(text)=> this.setState({confirmPassword: text})}
            password
            errorMessage={this.state.SignUpErrors.password_confirmation}
        />
        </Block>
      </Block>
      

      <Block
      
        style={{
          marginTop: 3.5,
          marginBottom: theme.SIZES.BASE * 10,
          marginLeft: 30
        }}
      >
        <Block row>
        <Button
          shadowless
          style={styles.loginbutton}
          color={nowTheme.COLORS.PRIMARY}
          onPress={() => this.SendValidationCode()}
        >
          <Text
            style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
            color={theme.COLORS.WHITE}
          >
            Resend code
          </Text>
        </Button>
        <Button
          shadowless
          style={styles.registerbutton}
          color={nowTheme.COLORS.PRIMARY}
          onPress={() => this.ResetPassword()}
        >
          <Text
            style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
            color={theme.COLORS.WHITE}
          >
            Reset
          </Text>
        </Button>
        </Block>
        </Block>
    </Block>
  </Block>
  );
  }

  render(){
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
          <Spinner
                  visible={this.state.spinner}
                  textContent={'Loading...'}
                  textStyle={styles.spinnerTextStyle}
                />
                 <ScrollView>
                   {this.state.context == 0 ? 
                   this.ValidationView() : this.ResetView() }
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
    marginTop: 139
  },
  opadded: {
    marginTop: 100
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
