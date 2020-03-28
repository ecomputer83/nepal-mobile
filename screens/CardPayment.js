import React from 'react';
import { StyleSheet,  Dimensions, Image, Alert  } from 'react-native';
import { Block, theme,Button as GaButton, Text } from "galio-framework";
import {AmountCard } from "../components";
import { Images, nowTheme } from '../constants';
import TextInputMask from 'react-native-text-input-mask';
import Spinner from 'react-native-loading-spinner-overlay';

const { width } = Dimensions.get("screen");
class CardPayment extends React.Component {
    state = {
        product : null,
        quantity: 0,
        unitPrice: null,
        ActualAmount: 0,
        Tax: 0,
        TotalAmount: 0,
        spinner: false,
        CardNumber: null,
        ExpiryDate: null,
        CVV: null
    }

    constructor(props) {
        super(props);
        const Params = props.navigation.state.params
        console.log(Params)
        this.state = {
            product : Params.product,
            quantity: parseInt(Params.quantity),
            unitPrice: Params.unitPrice,
            ActualAmount: parseInt(Params.TotalAmount),
            Tax: parseInt(Params.TotalAmount) * 0.016,
            TotalAmount: parseInt(Params.TotalAmount) + (parseInt(Params.TotalAmount) * 0.016),
            CardNumber: null,
        ExpiryDate: null,
        CVV: null
        }
      }

    renderPrices = () => {
      const {ActualAmount, Tax, TotalAmount} = this.state
        return (<Block flex={0.3} style={styles.shadow, {margin: 10}}>
            <AmountCard Key="Amount" Value={ActualAmount} />
            <AmountCard Key="Payment Charges" Value={Tax} />
            <AmountCard Key="Total" Value={TotalAmount} />
        </Block>);
    }
    saveandnavigate = () => {
        if(this.state.TotalAmount != 0) {
          this.setState({
            spinner: true
          });
          setTimeout(() => {
            this.setState({ spinner: false });
            //Alert.alert('Congratulation!', "Payment has been successful, Kindly continue with Programming");
            this.props.navigation.navigate('Programming', { isNew: true, quantity: this.state.quantity})
          }, 3000);
        
    };
}
    render () {
        const {CardNumber, ExpiryDate, CVV} = this.state
        return (
            <Block flex center>
                <Spinner
                  visible={this.state.spinner}
                  textContent={'Payment processing...'}
                  textStyle={styles.spinnerTextStyle}
                />
                <Block flex={1} space="between">
                        <Block center flex={0.9}>
                          <Block flex space="between">
                            {this.renderPrices()}
                            <Block flex={0.6} middle>
                              <Block middle>
                                <Image source={Images.paystack} style={{ width: 340, height: 99 }} />
                              </Block>
                              <Block width={width * 0.9} style={{ marginBottom: 5, marginLeft: 5, marginTop: 25 }}>
                                <Text>Card Number</Text>
                                <TextInputMask
                                    refInput={ref => { this.input = ref }}
                                    onChangeText={(formatted, extracted) => {
                                      this.setState({CardNumber: extracted})
                                    }}
                                    mask={"[0000] [0000] [0000] [0000]"}
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    style={styles.inputs}
                                    keyboardType="numeric"
                                />
                              </Block>
                              <Block width={width * 0.9} row style={{ marginBottom: 5, marginLeft: 5, }} space="between">
                              <Block width={width * 0.48}>
                              <Text>Expiry Date</Text>
                              <TextInputMask
                                    refInput={ref => { this.input = ref }}
                                    onChangeText={(formatted, extracted) => {
                                      this.setState({ExpiryDate: formatted})
                                    }}
                                    mask={"[00] / [00]"}
                                    placeholder="00 / 20"
                                    style={styles.inputs}
                                    keyboardType="numeric"
                                />
                              </Block>
                              <Block width={width * 0.4} style={{ marginBottom: 5 }}>
                              <Text>CVV</Text>
                              <TextInputMask
                                    refInput={ref => { this.input = ref }}
                                    onChangeText={(formatted, extracted) => {
                                      this.setState({CVV: extracted})
                                    }}
                                    mask={"[000]"}
                                    placeholder="234"
                                    style={styles.inputs}
                                    keyboardType="numeric"
                                />
                              </Block>
                              </Block>
                              
                              
                              <Block style={{marginBottom:  10}}></Block>
                              <Block width={width * 0.8} center>
                                <GaButton
                                    shadowless
                                    style={styles.loginbutton}
                                    color={nowTheme.COLORS.PRIMARY}
                                    onPress={() => this.saveandnavigate()}
                                >
                                    <Text
                                        style={{ fontFamily: 'montserrat-bold', fontSize: 14 }}
                                        color={theme.COLORS.WHITE}
                                    >
                                        PAY NOW
                                    </Text>
                                </GaButton>
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
    inputs: {
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 0
      },
      picker: {
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 0
      },
      loginbutton: {
        width: (width * 0.97),
        height: nowTheme.SIZES.BASE * 3,
        shadowRadius: 0,
        shadowOpacity: 0
      },
      shadow: {
        shadowColor: '#8898AA',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 6,
        shadowOpacity: 0.1,
        elevation: 5
      },
})
export default CardPayment