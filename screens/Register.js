import React from 'react';
import { ScrollView, StyleSheet, StatusBar, Dimensions, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import PhoneInput from 'react-native-phone-input'
const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants/';
import Spinner from 'react-native-loading-spinner-overlay';
import { validateAll } from 'indicative/validator';
import Input from '../components/Input';
import Icon from '../components/Icon';
import HttpService from '../services/HttpService';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);
export default class SignUp extends React.Component {
  state = {
    isIPMAN: false,
    ipmanCode: '',
    businessName: '',
    rcNumber: '',
    address: '',
    contactName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    viewstate: 1,
    SignUpErrors: {},
    spinner: false
  }

  SetInput = (obj) => {
    var name = Object.keys(obj)[0];
    var error = this.state.SignUpErrors;

    if(error[name]){
      error[name] = undefined;
      this.setState({SignUpErrors: error})
    }

    this.setState(obj);
  }
  Register = () => {
    const { navigation } = this.props;
    try {
      const rules = {
        businessName: 'required|string',
        rcNumber: 'required|string',
        address: 'required|string',
        contactName: 'required|string',
        email: 'required|email',
        password: 'required|string|min:6|max:40|confirmed'
    };

    const data = { isIPMAN: (this.state.ipmanCode != ''),
       ipmanCode: this.state.ipmanCode,
        businessName: this.state.businessName,
        rcNumber: this.state.rcNumber,
        address: this.state.address, 
        contactName: this.state.contactName, 
        phoneNumber: this.state.phoneNumber, 
        email: this.state.email, 
        password: this.state.password,
        password_confirmation:  this.state.confirmPassword,
        confirmPassword: this.state.confirmPassword };
    console.log(data);
    const messages = {
        required: field => `${field} is required`,
        'UserName.alpha': 'Username contains unallowed characters',
        'email.email': 'Please enter a valid email address',
        'Password.min': 'Wrong Password?',
        'password.confirmed': 'Password does not match'
    };

    validateAll(data, rules, messages)
        .then(() => {
            this.setState({spinner: true})
            HttpService.PostAsync('api/account/register', data)
            .then(response => {
                if(response.status == 200){
                  this.setState({spinner: false})
              navigation.navigate('RegReview');
                }else{
                  this.setState({spinner: false})
                  alert("There is an issue with registration, kindly contact the system administrator");
                }
          })
        })
        .catch(err => {
            const formatError = {};
            err.forEach(err => {
                formatError[err.field] = err.message;
            });
            this.setState({SignUpErrors: formatError});
        });
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  }
  Next = () => {
    this.setState({viewstate: 2})
  }
  Back = () => {
    this.setState({viewstate: 1})
  }
  handleLeftPress = () => {
    const { navigation } = this.props;
    return navigation.goBack(null);
  };
  render() {
    const { navigation } = this.props;
    const { phoneNumber, viewstate } = this.state;

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
            {(this.state.viewstate > 1) ?
            this.renderIPMANCode()
            : this.renderRegForm()
          }
        </Block>
        </Block>
      </DismissKeyboard>
    );
  }

  renderIPMANCode = () => {
    const { navigation } = this.props;
    const { phoneNumber, viewstate, SignUpErrors } = this.state;
    return (
      <Block flex  style={styles.padded}>
        <Block space="between" > 
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
                  Email Address
                  </Text>
                <Input
                    left
                    color="black"
                    style={styles.input}
                    placeholder="Enter email here"
                    onChangeText={text => this.SetInput({email: text})}
                    noicon
                    errorMessage={SignUpErrors.email}
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
                    onChangeText={text => this.SetInput({password: text})}
                    password
                    errorMessage={SignUpErrors.password}
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
                    onChangeText={text => this.SetInput({confirmPassword: text})}
                    password
                    errorMessage={SignUpErrors.confirmPassword}
                />
                </Block>
                </Block>
          </Block>
          <Block
              row
                style={{
                  marginTop: 3.5,
                  marginBottom: theme.SIZES.BASE * 10
                }}
              >
                <Block width={width * 0.5}>
                <Button
                  shadowless
                  style={styles.yesbutton}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => this.Back()}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={theme.COLORS.WHITE}
                  >
                    Back
                  </Text>
                </Button>
                </Block>
                <Block width={width * 0.44} style={{alignItems: 'flex-end'}}>
                <Button
                  shadowless
                  style={styles.registerbutton}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => this.Register()}
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
    );
  }
  renderRegForm =() => {
    const { navigation } = this.props;
    const { phoneNumber, viewstate, SignUpErrors } = this.state;
    return (
          <ScrollView style={{height: height-100}}>
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
                Enter your IPMAN Membership Code
                  </Text>
                <Input
                    left
                    color="black"
                    style={styles.input}
                    placeholder="Enter your IPMAN Code here"
                    onChangeText={text => this.SetInput({ipmanCode: text})}
                    noicon
                    errorMessage={SignUpErrors.businessName}
                />
                </Block>
                <Block style={{marginVertical: 1}}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Business Name
                  </Text>
                <Input
                    left
                    color="black"
                    style={styles.input}
                    placeholder="Enter  business name here"
                    onChangeText={text => this.SetInput({businessName: text})}
                    noicon
                    errorMessage={SignUpErrors.businessName}
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
                    onChangeText={text => this.SetInput({rcNumber: text})}
                    noicon
                    errorMessage={SignUpErrors.rcNumber}
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
                    onChangeText={text => this.SetInput({address: text})}
                    noicon
                    errorMessage={SignUpErrors.address}
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
                    onChangeText={text => this.SetInput({contactName: text})}
                    noicon
                    errorMessage={SignUpErrors.contactName}
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
                      onChangePhoneNumber={value => this.SetInput({phoneNumber: value})}/>
                </Block>
                
              </Block>
              

              <Block
              
                style={{
                  marginTop: 10.5,
                  marginBottom: theme.SIZES.BASE * 10
                }}
              >
                <Block>
                <Button
                  shadowless
                  style={styles.button}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => this.Next()}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={theme.COLORS.WHITE}
                  >
                    Next
                  </Text>
                </Button>
                </Block>
                </Block>
            </Block>
          </Block>
          </ScrollView>
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
  codeinput: {
    borderColor: nowTheme.COLORS.BORDER,
    borderWidth: 1,
    height: 38,
    width:  width - 42,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 0
  },
  loginbutton: {
    width: (width /2) - (theme.SIZES.BASE * 2 + 2.5),
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginRight: 5
  },

  registerbutton: {
    width: (width /3) - (theme.SIZES.BASE * 2 + 2.5),
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  yesbutton: {
    width: (width /3) - (theme.SIZES.BASE * 2 + 2.5),
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginLeft: 20
  },

  nobutton: {
    width: (width /3) - (theme.SIZES.BASE * 2 + 2.5),
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
