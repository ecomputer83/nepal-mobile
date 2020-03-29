import React from 'react';
import { StyleSheet,  Dimensions, Image, Alert, FlatList, Modal, View, TouchableHighlight  } from 'react-native';
import { Block, theme,Button as GaButton, Text } from "galio-framework";
import {OrderCard, Input, Icon } from "../components";
import { prod, Images, nowTheme } from '../constants';
import Spinner from 'react-native-loading-spinner-overlay';
import PhoneInput from 'react-native-phone-input'
import StepIndicator from 'react-native-step-indicator'
import TextInputMask from 'react-native-text-input-mask';
import FloatingActionButton from "react-native-floating-action-button";

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

const { width, height } = Dimensions.get("screen");

const IndicatorStyles = {
    stepIndicatorSize: 10,
    currentStepIndicatorSize: 10,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#385A9E',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#385A9E',
    stepStrokeUnFinishedColor: '#dedede',
    separatorFinishedColor: '#385A9E',
    separatorUnFinishedColor: '#dedede',
    stepIndicatorFinishedColor: '#385A9E',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    labelColor: '#999999',
    labelSize: 13,
    labelFontFamily: 'HKGrotesk-Regular',
    currentStepLabelColor: '#E37E2E'
  }

class TrackOrder extends React.Component {
    
    state = {
        Filters: prod.Filters,
        Orders: prod.Orders,
        modalCreateVisible: false,
        modalPaymentVisible: false,
        spinner: false,
        currentPosition: 0,
        currentState: 0,
        CompletePayment: false,
        depot: null,
        product : null,
        productIndex: null,
        depotIndex: null,
        quantity: "0",
        unitPrice: null,
        TotalAmount: "0",
        PhoneNumber: '',
        code: '',
        ifInputupdated: false
    }
    pinInput = React.createRef();
    pickerProduct(index){
        prod.DailyPrices.map( (v,i)=>{
         if( index === i ){
           this.setState({
           product: prod.DailyPrices[index],
           unitPrice: prod.DailyPrices[index].Price,
          })
         }
        })
    }
    pickerDepot(index){
      prod.Depots.map( (v,i)=>{
       if( index === i ){
         this.setState({
         depot: prod.Depots[index]
        })
       }
      })
  }
    setModalCreateVisible(visible) {
        this.setState({modalCreateVisible: visible});
      }

      setModalPaymentVisible(visible) {
        this.setState({modalPaymentVisible: visible});
      }

      setIncrease(){
        var quantity = parseInt(this.state.quantity) + 100
        this.setState({quantity: quantity.toString(), ifInputupdated: true})
      }

      setDecrease(){
        var quantity = parseInt(this.state.quantity) - 100
        this.setState({quantity: quantity.toString(), ifInputupdated: true})
      }

      onStepPress = position => {
        this.setState({ currentPosition: position })
      }
      Next(last){
          if(last){
              var TotalAmount = this.state.quantity * this.state.product.Price;
              this.setState({TotalAmount: TotalAmount})
          }
        var currentPosition = this.state.currentPosition + 1
        this.setState({currentPosition: currentPosition, ifInputupdated: false})
      }

      _checkCode = (code) => {
        if (code != '1234') {
          this.pinInput.current.shake()
            .then(() => this.setState({ code: '' }));
        }
      }
      Proceed(){
          if(this.state.currentState == 0){
            var currentPosition = this.state.currentState + 1
            this.setState({currentState: currentPosition})
          }else{
               //perform logic
               if(this.state.TotalAmount != 0) {
                this.setState({
                  spinner: true
                });
                setTimeout(() => {
                  this.setState({ spinner: false, CompletePayment: true});
                }, 3000);
            }
          }
      }

      edit() {
        let currentPosition = 0
        this.setState({currentPosition: currentPosition})
      }

      saveandnavigate = () => {
          this.setModalPaymentVisible(false);
          this.setModalCreateVisible(false);
            this.props.navigation.navigate('Programming', { isNew: true, quantity: this.state.quantity})
    }
    backHome = () => {
        this.setModalPaymentVisible(false);
          this.props.navigation.navigate('Home')
  }

    setProduct(item, index){
        console.log(item)
        this.setState({product: item, productIndex: index, ifInputupdated: true});
    }

    setDepot(item, index){
        console.log(item);
        this.setState({depot: item, depotIndex: index, ifInputupdated: true});
    }

    filterOrder(item){
        var stat = (item.Status == 0) ? 1 : 0
        let activeFilterIndex = this.state.Filters.findIndex(c => c.Status == stat);
        let selectedFilterIndex = this.state.Filters.findIndex(c => c == item);
        var filters = this.state.Filters;
        filters[activeFilterIndex].Status = item.Status;
        filters[selectedFilterIndex].Status = stat;
        let filteredOrder = [];
        if(item.Name != 'All'){
            filteredOrder = prod.Orders.filter(o => o.Status == item.Name);
        }else{
            filteredOrder = prod.Orders;
        }
        console.log(filters);
        this.setState({Orders: filteredOrder, Filters: filters});
    }

    renderProducts = () => {
      let bgColor = ["#303E4F", "#437FB4", "#909090", "#CB582D", "#E37E2E"]
        return prod.DailyPrices.map((p, i)=>{
            const productStyle = [styles.product, {backgroundColor: bgColor[i]}, (this.state.productIndex == i) && styles.selected]
            return (<TouchableHighlight onPress={() => this.setProduct(p, i)}>
                <Block width={width * 0.9} row space='between' style={productStyle}>
                    <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16, color: '#ffffff' }}>{p.Product}</Text>
                    <Text style={{ fontFamily: 'HKGrotesk-MediumLegacy', fontSize: 16, color: '#AAAAAA' }}>₦{p.Price}/{p.Unit}</Text>
                </Block>
            </TouchableHighlight>)
        })
    }

    renderDepots = () => {
      
        return prod.Depots.map((p, i)=>{
            const productStyle = [styles.product, (this.state.depotIndex == i) && styles.selected]
            return (<TouchableHighlight onPress={() => this.setDepot(p, i)}>
                <Block width={width * 0.9} middle style={productStyle}>
                    <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16, color: '#ffffff' }}>{p.Name}</Text>
                </Block>
            </TouchableHighlight>)
        })
    }

      proceedToPayment = () => {
          let currentPosition = 0
            this.setState({currentPosition: currentPosition})
          this.setModalCreateVisible(false);
          this.setModalPaymentVisible(true);
      }

      GenerateTitle = (currentPosition) => {
        switch(currentPosition) {
          case 0:
            return 'Creating New Order - Step 1';
          case 1:
            return 'Creating New Order - Step 2';
          case 2:
            return 'Creating New Order - Step 3';
          case 3:
            return 'Creating New Order - Step 4';
          case 4:
            return 'New Order Summary'
          
        }
      }



      renderCreateModal = () => {

        const {currentPosition, unitPrice, TotalAmount, product, depot, quantity, ifInputupdated} = this.state;
          return (<Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalCreateVisible}
              onRequestClose={() => {
                if(this.state.currentPosition > 0){
                this.setState({currentPosition: this.state.currentPosition - 1})
                }else{
                  this.setModalCreateVisible(false)
                }
              }}>
              <Block  flex center style={{backgroundColor: '#FAFAFA'}}>
                <Block row space='between' style={{width: width, padding: 10, alignItems:'center', marginBottom: 20, borderBottomColor: '#1D1D1D24', borderBottomWidth: 1}}>
                  <Text style={{ fontFamily: 'HKGrotesk-Bold', fontSize: 20 }}> {this.GenerateTitle(this.state.currentPosition)}</Text>
                  <Icon
                    name={'x'}
                    family="octicon"
                    size={20}
                    onPress={() => this.setModalCreateVisible(false)}
                    color={nowTheme.COLORS.ICON}
                  />
                </Block>
                <Block  width={width * 0.9} style={{ padding: 2 }}>
                <View style={styles.stepIndicator}>
          <StepIndicator
            stepCount={4}
            customStyles={IndicatorStyles}
            currentPosition={this.state.currentPosition}
            onPress={this.onStepPress}
            labels={['Location', 'Product', 'Quantity', 'Confirm']}
          />
        </View>
                  <Block>
                  { (currentPosition == 0) ?
                  <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                                <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>Where Do you want to Load from?</Text>
                                    {this.renderDepots()}
                                </Block>
                  : (currentPosition == 1) ?
                  <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                  <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>What Product Do you want to buy?</Text>  
                        {this.renderProducts()}
                                  
                                </Block>
                  : (currentPosition == 2)   ?             
                  <Block width={width * 0.9} style={{ marginBottom: 5 }}>
      <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>WHAT QUANTITY DO YOU WANT TO BUY?</Text>
          <Block row>
          <GaButton
                          shadowless
                          style={styles.increbutton}
                          color='#4161A1'
                          onPress={() => this.setIncrease()}
                      >
                          <Text
                              style={{ fontFamily: 'montserrat-bold', fontSize: 14 }}
                              color={theme.COLORS.WHITE}
                          >
                              +
                          </Text>
                      </GaButton>   
                    <Input
                        placeholder="Quantity"
                        color="black"
                        style={styles.Qtyinputs}
                        value={quantity}
                        onChangeText={(text) => {
                          this.setState({quantity: text, ifInputupdated: true})
                        }}
                        keyboardType="numeric"
                        noicon
                      />
  
  <GaButton
                          shadowless
                          style={styles.increbutton}
                          color='#D9D9D9'
                          onPress={() => this.setDecrease()}
                      >
                          <Text
                              style={{ fontFamily: 'montserrat-bold', fontSize: 14 }}
                              color={theme.COLORS.WHITE}
                          >
                              -
                          </Text>
                      </GaButton>
                    </Block>
                    </Block>
                    : (currentPosition == 3) ?
                    <Block width={width * 0.9} style={{ marginBottom: 5 }}>
      <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>Do you have a discount Code? Enter here...</Text>
      <Input
                    left
                    color="black"
                    style={styles.custominput}
                    noicon
                />
      <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>Enter your IPMAN Membership Code here</Text>
      <Input
                    left
                    color="black"
                    style={styles.custominput}
                    noicon
                />

                        <Block center style={{width: (width * 0.9), marginTop: 25, padding: 10, backgroundColor: '#121112'}}>
                    <Text style={{fontSize: 14, lineHeight: 16, fontFamily: 'HKGrotesk-BoldLegacy', color: '#FFFFFF', marginTop: 5}}>₦{TotalAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-BoldLegacy', color: '#FFFFFF', marginTop: 5}}>{quantity} Litres</Text>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-BoldLegacy', color: '#FFFFFF', marginTop: 5}}>{product.Product} (ex Nepal Depot {depot.Name})</Text>
                    <TouchableHighlight onPress={() => this.edit()}><Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'ProductSans-Medium', color: '#23C9F1', marginTop: 15}}>Edit</Text></TouchableHighlight>

                        </Block>
                    </Block>
                    : 
                    <Block middle width={width * 0.9} style={{ marginBottom: 5 }}>
                      <Block width={47} height={47} style={{ backgroundColor: '#121112', marginBottom: 13, marginTop: 33, borderRadius: 50}}>
                      </Block>

                      <Text style={{fontSize: 14, lineHeight: 24, fontFamily: 'ProductSans-Bold', textAlign: 'center'}}>Congratulations! Your Order has been submitted Successfully.</Text>


                        <Block style={{width: (width * 0.9), marginTop: 25, paddingVertical: 10, paddingHorizontal: '23%', backgroundColor: '#121112'}}>
                        <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF', marginTop: 5, textAlign: 'center'}}>{product.Product} (ex {depot.Name})</Text>
                    
                    <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Order Quantity:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{quantity} Litres</Text>
                    </Block>
                    <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>List Unit Price:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{product.Price}</Text>
                    </Block>
                    <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Discount Offered:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>0.5</Text>
                    </Block>
                    <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>IPMAN Discount:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>0.5</Text>
                    </Block>
                    <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Net Unit Price:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{product.Price - 1}</Text>
                    </Block>
                    <Text style={{fontSize: 14, lineHeight: 15, fontFamily: 'HKGrotesk-BoldLegacy', color: '#FFFFFF', marginTop: 5, textAlign: 'center'}}>Total Order Amount</Text>
                    <Text style={{fontSize: 14, lineHeight: 16, fontFamily: 'HKGrotesk-BoldLegacy', color: '#FFFFFF', marginTop: 5, textAlign: 'center'}}>₦{TotalAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                    
                    <TouchableHighlight onPress={() => this.edit()}><Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'ProductSans-Medium', color: '#23C9F1', marginTop: 15, textAlign: 'center'}}>Edit</Text></TouchableHighlight>

                        </Block>
                    </Block>
      }
                  <Block style={{marginBottom:  10, marginTop: 20}}></Block>
                                <Block width={width * 0.7} center>
                                { (currentPosition < 2) ?
                                <GaButton
                                      shadowless
                                      style={styles.nextbutton}
                                      color={nowTheme.COLORS.PRIMARY}
                                      onPress={() => ifInputupdated && this.Next()}
                                  >
                                      <Text
                                          style={{ fontFamily: 'HKGrotesk-Medium', fontSize: 14 }}
                                          color={theme.COLORS.WHITE}
                                      >
                                          Next
                                      </Text>
                                </GaButton> : (currentPosition == 2) ?
                                  <GaButton
                                      shadowless
                                      style={styles.nextbutton}
                                      color={nowTheme.COLORS.PRIMARY}
                                      onPress={() => ifInputupdated && this.Next(true)}
                                  >
                                      <Text
                                          style={{ fontFamily: 'HKGrotesk-Medium', fontSize: 14 }}
                                          color={theme.COLORS.WHITE}
                                      >
                                          Confirm
                                      </Text>
                                  </GaButton> : <Block /> }
                                
                                </Block>
                  
                  </Block>
                  
                </Block>
              </Block>
              { (currentPosition == 3) ?  (
                              <Block width={width * 0.9} center style={{position: 'absolute', bottom: 50}}>
                                <GaButton
                                    shadowless
                                    style={styles.button}
                                    color={nowTheme.COLORS.PRIMARY}
                                    onPress={() => this.Next()}
                                >
                                    <Text
                                        style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16 }}
                                        color={theme.COLORS.WHITE}
                                    >
                                        Submit Your Order
                                    </Text>
                                </GaButton>
                              </Block>)
                               : (currentPosition > 3) ? (
                                <Block width={width * 0.9} center style={{position: 'absolute', bottom: 50}}>
                                  <GaButton
                                      shadowless
                                      style={styles.button}
                                      color={nowTheme.COLORS.PRIMARY}
                                      onPress={() => {}}
                                  >
                                      <Text
                                          style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16 }}
                                          color={theme.COLORS.WHITE}
                                      >
                                          Share Order Details
                                      </Text>
                                  </GaButton>
                                  <GaButton
                                      shadowless
                                      style={styles.button}
                                      color={nowTheme.COLORS.PRIMARY}
                                      onPress={() => this.saveandnavigate()}
                                  >
                                      <Text
                                          style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 14 }}
                                          color={theme.COLORS.WHITE}
                                      >
                                          Credit Customer? Proceed to Truck programming
                                      </Text>
                                  </GaButton>
                                  <GaButton
                                      shadowless
                                      style={styles.button}
                                      color={nowTheme.COLORS.PRIMARY}
                                      onPress={() => this.proceedToPayment()}
                                  >
                                      <Text
                                          style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16 }}
                                          color={theme.COLORS.WHITE}
                                      >
                                          PROCEED TO PAYMENT
                                      </Text>
                                  </GaButton>
                                </Block>) : (<Block />)}
            </Modal>);
      }

      renderPaymentModal = () => {

        const {currentState, CompletePayment, code} = this.state;
          return (<Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalPaymentVisible}
              onRequestClose={() => {
                if(this.state.currentState > 0){
                  this.setState({currentState: this.state.currentState - 1})
                  }else{
                    this.setModalPaymentVisible(false)
                  }
              }}>
            { (!CompletePayment) ?  
              <Block  flex center style={{backgroundColor: '#FAFAFA'}}>
                <Block row space='between' style={{width: width, padding: 10, alignItems:'center', marginBottom: 20, borderBottomColor: '#1D1D1D24', borderBottomWidth: 1}}>
            <Text style={{ fontFamily: 'HKGrotesk-Bold', fontSize: 20 }}> Make Payment - Step {currentState + 1}</Text>
                  <Icon
                    name={'x'}
                    family="octicon"
                    size={20}
                    onPress={() => this.setModalPaymentVisible(false)}
                    color={nowTheme.COLORS.ICON}
                  />
                </Block>
                <Block  width={width * 0.9} style={{ padding: 2 }}>
                  <Block>
                  { (currentState == 0) ?
                  <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                                <Text style={{fontSize: 24, lineHeight: 40, fontFamily: 'HKGrotesk-Medium'}}>Enter Card details</Text>
                                <Text size={14} style={{color: '#0A0716', lineHeight: 15, fontFamily: 'HKGrotesk-Regular'}}>
                Your card details are securely saved with Paystack so you don't have to enter it again
                </Text>
                <Block width={width * 0.9} style={{ marginBottom: 5, marginLeft: 5, marginTop: 25 }}>
                                <TextInputMask
                                    refInput={ref => { this.input = ref }}
                                    onChangeText={(formatted, extracted) => {
                                      this.setState({CardNumber: extracted})
                                    }}
                                    mask={"[0000] [0000] [0000] [0000]"}
                                    placeholder="Enter card number here"
                                    style={styles.inputs}
                                    keyboardType="numeric"
                                />
                              </Block>
                              <Block width={width * 0.9} row style={{ marginBottom: 5, marginLeft: 5, }} space="between">
                              <Block width={width * 0.48}>
                              <TextInputMask
                                    refInput={ref => { this.input = ref }}
                                    onChangeText={(formatted, extracted) => {
                                      this.setState({ExpiryDate: formatted})
                                    }}
                                    mask={"[00] / [00]"}
                                    placeholder="MM / YY"
                                    style={styles.inputs}
                                    keyboardType="numeric"
                                />
                              </Block>
                              <Block width={width * 0.4} style={{ marginBottom: 5 }}>
                              <TextInputMask
                                    refInput={ref => { this.input = ref }}
                                    onChangeText={(formatted, extracted) => {
                                      this.setState({CVV: extracted})
                                    }}
                                    mask={"[000]"}
                                    placeholder="CVC"
                                    style={styles.inputs}
                                    keyboardType="numeric"
                                />
                              </Block>
                              </Block>
                              
                                </Block>
                  : (currentState == 1) ?
                  <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                  <Text style={{fontSize: 24, lineHeight: 40, fontFamily: 'HKGrotesk-Medium', marginBottom: 5}}>Verify Card</Text>
                                <Text size={14} style={{color: '#0A0716', lineHeight: 15, fontFamily: 'HKGrotesk-Regular'}}>
                Please enter 4 digit pin to authorize
                </Text> 
                <Block center width={width * 0.9} style={{ marginTop: 25, marginBottom: 35 }}> 
                <SmoothPinCodeInput
                cellStyle={{
                    borderWidth: 0,
                    borderRadius: 5,
                    backgroundColor: '#EDEDED',
                  }}
                  cellStyleFocused={{
                    borderWidth: 0,
                    backgroundColor: '#EDEDED',
                  }}
            ref={this.pinInput}
            value={code}
            onTextChange={code => this.setState({ code })}
            onFulfill={this._checkCode}
            
            
            
            onBackspace={() => console.log('No more back.')}
            />
            </Block>

                                  
                                </Block>
                  : <Block />}
                  <Block style={{marginBottom:  10, marginTop: 20}}></Block>
                                <Block width={width * 0.9} style={{marginBottom: 25}} right>
                                
                                  <GaButton
                                      shadowless
                                      style={styles.proceedbutton}
                                      color={nowTheme.COLORS.PRIMARY}
                                      onPress={() => this.Proceed()}
                                  >
                                      <Text
                                          style={{ fontFamily: 'HKGrotesk-Medium', fontSize: 14 }}
                                          color={theme.COLORS.WHITE}
                                      >
                                          Proceed
                                      </Text>
                                  </GaButton>
                                
                                </Block>
                                <Block middle>
                                <Image source={Images.paystack} style={{ width: 168, height: 49 }} />
                              </Block>
                  </Block>
                  
                </Block>
              </Block>
              :
            <Block width={width * 0.9} height={height} center style={{justifyContent: 'center'}}>
                <Block>
                    <Image source={Images.Profile} style={{ width: 56, height: 55, borderRadius: 50}} />
                </Block>
                <Block style={{marginTop: 10}}>
                <Text size={19} style={{color: '#2C4453', lineHeight: 26, fontFamily: 'ProductSans-Bold'}}>
                    Great work Business Name
                </Text>
                </Block>
                <Block style={{marginTop: 10}}>
                <Text size={15} style={{color: '#2C4453', lineHeight: 25, textAlign: 'center', fontFamily: 'ProductSans-Regular'}}>
                Your payment has been successful and we are super grateful for the patronage. While we confirm your payment kindly proceed and program your truck
                </Text>
                </Block>
                <Block style={{marginTop: 15}}>
                <GaButton
                                      shadowless
                                      style={styles.nextbutton}
                                      color={nowTheme.COLORS.PRIMARY}
                                      onPress={() => this.saveandnavigate()}
                                  >
                                      <Text
                                          style={{ fontFamily: 'ProductSans-Medium', fontSize: 15 }}
                                          color={theme.COLORS.WHITE}
                                      >
                                          Program my Truck
                                      </Text>
                                </GaButton>
                                <TouchableHighlight onPress={() => this.backHome()}>
                                <Text size={14} style={{color: '#23C9F1', textAlign: 'center', lineHeight: 30, fontFamily: 'ProductSans-Medium'}}>
                                Go back home
                                </Text>
                                </TouchableHighlight>
                </Block>
           </Block>
                               }
            </Modal>);
      }

    renderChildFilter = () => {
        return this.state.Filters.map((v,i) => {
            let Background = (v.Status == 1) ? '#FFFFFF': '#EDEDED';
            return(<TouchableHighlight onPress={() => this.filterOrder(v)}><Block style={{ backgroundColor: Background, width: 115, borderRadius: 10, height: 26, alignItems: 'center', justifyContent: 'center'}}>
                <Text size={12} style={{color: '#2C4453', lineHeight: 12, fontFamily: 'HKGrotesk-Medium'}}>
                    {v.Name}
                </Text>
            </Block></TouchableHighlight>)
        })
    }
    renderFilter = () => {
        return (
            <Block row style={{margin: 10, padding: 1, backgroundColor: '#EDEDED', borderRadius: 10, height: 28}}>
                { this.renderChildFilter()
                }
            </Block>
        )
    }

    render () {
        return (
            <Block flex center>
                <Spinner
                  visible={this.state.spinner}
                  textContent={'Searching...'}
                  textStyle={styles.spinnerTextStyle}
                />
                {this.renderCreateModal()}
                {this.renderPaymentModal()}
                    <Block row style={{zIndex: 3, position: 'absolute', top: 500, right: '5%'}}>
          <FloatingActionButton
            iconName="plus"
            iconType="AntDesign"
            textDisable
            backgroundColor={nowTheme.COLORS.BACKGROUND}
            rippleColor={nowTheme.COLORS.WHITE}
            iconColor={nowTheme.COLORS.WHITE}
            onPress = {() => this.setModalCreateVisible(true)}
          />
               </Block> 
                    <Block flex={1} space="between">
                        <Block flex={0.08}>
                            {this.renderFilter()}
                        </Block>

                        <Block flex={0.92}>
                        <FlatList data={this.state.Orders} keyExtractor={(item, index )=> index.toString()} extraData={this.state} ListHeaderComponent={null} renderItem={({item}) => {
                            return <OrderCard item={item} />
                        }}/>
                        </Block>
                    </Block>
            </Block>
        )
    }

}

const styles = StyleSheet.create({
    search: {
        height: nowTheme.SIZES.BASE * 3,
        width: width * 0.7,
        marginHorizontal: 4,
        borderWidth: 0.5,
        borderRadius: 0,
        borderColor: nowTheme.COLORS.BORDER
      },
      inputs: {
        borderWidth: 0,
        borderRadius: 0,
        backgroundColor: '#ffffff'
      },
      Qtyinputs: {
        borderWidth: 1,
        borderColor: '#1917181F',
        borderRadius: 0,
        backgroundColor: '#ffffff',
        paddingVertical: 0,
        width: (width * 0.9) - 202,
        height: 40
      },
      searchbutton: {
        width: (width  * 0.2),
        height: nowTheme.SIZES.BASE * 3,
        shadowRadius: 0,
        shadowOpacity: 0
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
      increbutton: {
        width: 101.1,
        height: 40,
        shadowRadius: 0,
        shadowOpacity: 0,
        borderRadius: 0,
        marginVertical: theme.SIZES.BASE / 2
      },
      nextbutton: {
        width: (width * 0.7),
        height: 40,
        shadowRadius: 0,
        shadowOpacity: 0,
        margin: 2
      },

      proceedbutton: {
        width: (width * 0.3),
        height: 40,
        shadowRadius: 0,
        shadowOpacity: 0,
        margin: 2
      },
      custominput: {
        borderColor: nowTheme.COLORS.BORDER,
        borderWidth: 1,
        height: 40,
        width:  width - 42,
        marginLeft: 1,
        marginRight: 1,
        borderRadius: 0,
        paddingLeft: 10
      },
      product: {
        height: 40,
        marginBottom: 5, 
        paddingHorizontal: 20, 
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor: '#E3E2E3', 
        backgroundColor: '#385A9E', 
        alignItems: 'center',
        color: '#ffffff'
      },

      selected: {
        backgroundColor: nowTheme.COLORS.BLACK,
        
      }
});

export default TrackOrder