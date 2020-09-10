import React from "react";
import { StyleSheet, ScrollView, Dimensions, FlatList, Image, Alert, Modal, View, TouchableHighlight} from "react-native";
import { Block, theme, Text, Button, Button as GaButton } from "galio-framework";
import AsyncStorage from '@react-native-community/async-storage'
import { white } from "color-name";
import {Card, Input, Icon } from "../components";
import {prod, Article, nowTheme, Images} from "../constants";
import ModalSelector from 'react-native-modal-selector';
import Spinner from 'react-native-loading-spinner-overlay';
import PhoneInput from 'react-native-phone-input'
import StepIndicator from 'react-native-step-indicator'
import TextInputMask from 'react-native-text-input-mask';
import FloatingActionButton from "react-native-floating-action-button";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

const { width, height } = Dimensions.get("screen");
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);
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
const ratio = width / height;
class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      DailyPrices: prod.DailyPrices,
      Articles: Article,
      
      modalCreateVisible: false,
        modalPaymentVisible: false,
        modalProgramVisible:  false,
        spinner: false,
        currentPosition: 0,
        currentState: 0,
        CompletePayment: false,
        depot: null,
        product : null,
        productIndex: null,
        depotIndex: null,
        quantity: "33000",
        unitPrice: null,
        TotalAmount: "0",
        PhoneNumber: '',
        code: '',
        ifInputupdated: false,
        Name: 'Business Name',
      Limit: 0,
      Balance: 0,
      ipman: 0,
      isnoteligible: false,
      isfetched: false,
      depotX: prod.Depots.map((d, i) => {
        return { key: i, label: d.Name}
      }),
      depot: prod.Depots[0]
    }
    
  }
  pinInput = React.createRef();

  readData = async () => {
    return await AsyncStorage.getItem('@UserId');
  }
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
  pickerDepotX(index){
    prod.Depots.map( (v,i)=>{
     if( index === i ){
       this.setState({
       depot: prod.Depots[index]
      })
     }
    })

  }

  setModalCreateVisible(visible) {
    if(visible){
      this.setState({quantity: "33000"})
    }
      this.setState({modalCreateVisible: visible});
    }

    setModalPaymentVisible(visible) {
      this.setState({modalPaymentVisible: visible});
    }

    setModalProgramVisible(visible) {
      this.setState({modalProgramVisible: visible});
    }

    setIncrease(){
      var quantity = parseInt(this.state.quantity) + 1000
      this.setState({quantity: quantity.toString(), ifInputupdated: true})
    }

    setDecrease(){
      var quantity = parseInt(this.state.quantity) - 1000
      this.setState({quantity: quantity.toString(), ifInputupdated: true})
    }

    onStepPress = position => {
      this.setState({ currentPosition: position })
    }
    Next(last){
      let ifup = false;
      var currentPosition = this.state.currentPosition
        if(last){
            var TotalAmount = this.state.quantity * this.state.product.Price;
            this.setState({TotalAmount: TotalAmount})
        }
        console.log(this.state.ipman)
      if(last && this.state.ipman == 1){
        
        currentPosition = this.state.currentPosition + 2
      }else {
        currentPosition = this.state.currentPosition + 1
      }
      if(currentPosition == 2){
        ifup = true
      }
      this.setState({currentPosition: currentPosition, ifInputupdated: ifup})
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
                spinner: true,depot: null,
                product : null,
                productIndex: null,
                depotIndex: null,
                unitPrice: null,
                TotalAmount: "0",
                depotX: prod.Depots.map((d, i) => {
                  return { key: i, label: d.Name}
                }),
                depot: prod.Depots[0]
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
        //this.setModalProgramVisible(true);
          this.props.navigation.navigate('Programming', { isNew: true, quantity: this.state.quantity})
  }
  requestcredit = () => {
    if(this.state.Balance >= parseInt(this.state.TotalAmount)){
      this.setModalPaymentVisible(false);
      this.setModalCreateVisible(false);
    
      Alert.alert("Credit Request", "Your credit approval request is sent successfully. Your order will be confirmed upon credit approval")
    }
    else {
      this.setState({isnoteligible: true})
      Alert.alert("Credit Request", "You have insufficient credit balance to proceed, Kindly make payment")
    }
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

  renderProducts = () => {
    let bgColor = ["#303E4F", "#437FB4", "#909090", "#CB582D", "#E37E2E"]
      return prod.DailyPrices.map((p, i)=>{
          const productStyle = [styles.product, {backgroundColor: bgColor[i]}, (this.state.productIndex == i) && styles.selected]
          return (<TouchableHighlight onPress={() => this.setProduct(p, i)}>
              <Block width={width * 0.9} row space='between' style={productStyle}>
                  <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16, color: '#ffffff' }}>{p.Product}</Text>
                  <Text style={{ fontFamily: 'HKGrotesk-MediumLegacy', fontSize: 16, color: '#f4f4f4' }}>₦{p.Price}/{p.Unit}</Text>
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
  loadPrices = () => {
    let bgColor = ["#303E4F", "#437FB4", "#909090", "#F6D843E6", "#EE0E1D"]
    return this.state.DailyPrices.map((s,i) => {
        return (<Block style={{paddingTop: 10,
          paddingBottom: 10, paddingRight: 35,
          paddingLeft: 15, margin: 5, backgroundColor: "#ffffff"}}>
          <Text
                style={{
                  color: bgColor[i],
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-Light',
                  lineHeight: 20,
                  paddingBottom:5
                }}
              >
                {s.Product}
                  </Text>
          <Text
                style={{
                  color: nowTheme.COLORS.BLACK,
                  fontSize: 18,
                  fontFamily: 'HKGrotesk-Bold',
                  lineHeight: 26,
                  paddingBottom:5
                }}
              >
                ₦{s.Price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  </Text>
        </Block>)
    })
  }

  renderCreateModal = () => {
    if(!this.state.isfetched){
    this.readData().then( userid => {
      if(userid !== null){
        
        var user = prod.Users.find(u => u.UserId == parseInt(userid))
        console.log(user.ipman)
        this.setState({Name: user.CompanyName,
        Limit: user.limit,
        Balance: user.balance,
        ipman: user.ipman,
        isfetched: true
        })
      }
    });
    }
    const {currentPosition, unitPrice, TotalAmount, product, depot, quantity, ifInputupdated} = this.state;

      return (<Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalCreateVisible}
          onRequestClose={() => {
            this.setModalCreateVisible(false)
          }}>
          <Block  flex center style={{backgroundColor: '#FAFAFA', paddingTop: iPhoneX() ? theme.SIZES.BASE * 3.5 : theme.SIZES.BASE }}>
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
                            <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>Where do you want to load from?</Text>
                                {this.renderDepots()}
                            </Block>
              : (currentPosition == 1) ?
              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
              <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>What product do you want to buy?</Text>  
                    {this.renderProducts()}
                              
                            </Block>
              : (currentPosition == 2)   ?             
              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
  <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>What quantity do you want to buy?</Text>
      <Block row>
      <GaButton
                      shadowless
                      style={styles.increbutton}
                      color={nowTheme.COLORS.BACKGROUND}
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
                      style={[styles.increbutton, {opacity: 0.35}]}
                      color='#23C9F165'
                      onPress={() => this.setDecrease()}
                  >
                      <Text
                          style={{ fontFamily: 'montserrat-bold', fontSize: 14 }}
                          color={theme.COLORS.BLACK}
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
                placeholder="Enter code here"
                style={styles.custominput}
                noicon
            />
  

                    <Block center style={{width: (width * 0.9), marginTop: 25, padding: 10, backgroundColor: '#121112'}}>
                <Text style={{fontSize: 14, lineHeight: 16, fontFamily: 'HKGrotesk-BoldLegacy', color: '#FFFFFF', marginTop: 5}}>₦{TotalAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-BoldLegacy', color: '#FFFFFF', marginTop: 5}}>{quantity.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} Litres</Text>
                <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-BoldLegacy', color: '#FFFFFF', marginTop: 5}}>{product.Product} (ex {depot.Name})</Text>
                <TouchableHighlight onPress={() => this.edit()}><Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'ProductSans-Medium', color: '#23C9F1', marginTop: 15}}>Edit</Text></TouchableHighlight>

                    </Block>
                </Block>
                : 
                <Block middle width={width * 0.9} style={{ marginBottom: 5 }}>
                  <Block width={47} height={47} style={{ backgroundColor: nowTheme.COLORS.BACKGROUND, marginBottom: 13, marginTop: 33, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon
                      name={'check'}
                      family="octicon"
                      size={20}
                      color={nowTheme.COLORS.WHITE}
                  />
                  </Block>

                  <Text style={{fontSize: 14, lineHeight: 24, fontFamily: 'ProductSans-Bold', textAlign: 'center'}}>Congratulations! Your Order has been submitted Successfully.</Text>


                    <Block style={{width: (width * 0.9), marginTop: 25, paddingVertical: 10, paddingHorizontal: '23%', backgroundColor: '#121112'}}>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF', marginTop: 5, textAlign: 'center'}}>{product.Product} (ex {depot.Name})</Text>
                
                <Block row space='between'>
                <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Order Quantity:</Text>
                  <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{quantity.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} Litres</Text>
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
                              {(this.state.ipman == 0) ? (
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
                              </GaButton>) :
                              (<GaButton
                                  shadowless
                                  style={styles.button}
                                  color={nowTheme.COLORS.PRIMARY}
                                  onPress={() => this.requestcredit()}
                                  disabled={this.state.isnoteligible}
                              >
                                  <Text
                                      style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16 }}
                                      color={theme.COLORS.WHITE}
                                  >
                                      Request Credit Approval
                                  </Text>
                              </GaButton>)}
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
                                      Proceed To Payment
                                  </Text>
                              </GaButton>
                            </Block>) 
                            : 
                            <Block width={width * 0.7} center style={{position: 'absolute', bottom: 50}}>
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
              }
        </Modal>);
  }

  // renderProgramModal = (isNew) => {
  //   return (<Modal
  //     animationType="slide"
  //     transparent={false}
  //     visible={this.state.modalProgramVisible}
  //     onRequestClose={() => {
  //       this.setModalProgramVisible(false);
  //     }}>

  //         <Programming quantity={this.state.quantity} isNew={isNew} setModalProgramVisible={this.setModalProgramVisible} />
  //     </Modal>);
  // }

  renderPaymentModal = () => {

    const {currentState, CompletePayment, code} = this.state;
      return (<Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalPaymentVisible}
          onRequestClose={() => {
            this.setModalPaymentVisible(false);
          }}>
        { (!CompletePayment) ?  
          <Block  flex center style={{backgroundColor: '#FAFAFA', paddingTop: iPhoneX() ? theme.SIZES.BASE * 3.5 : theme.SIZES.BASE }}>
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
                                      Program truck loading
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


  renderPrices = () => {
    return ( <Block>
    <ScrollView horizontal={true}>
      {this.loadPrices()}
    </ScrollView>
    </Block>)
  }
  renderArticles = () => {
    return (
      <Block>
        <Block row space="between">
        <Block style={{ margin: 10 }}>
        <Text style={{ fontFamily: 'HKGrotesk-SemiBold', fontSize: 14 }} color='#CB582D'>
            NEWS HIGHLIGHTS
        </Text>
        </Block>
        <Block>
                <Button
                  shadowless
                  style={styles.yesbutton}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => this.setModalCreateVisible(true)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    Book Now
                  </Text>
                </Button>
          </Block>
        </Block>
        <FlatList data={this.state.Articles} keyExtractor={(item, index )=> index.toString()} extraData={this.state} ListHeaderComponent={null} renderItem={({item}) => {
          return <Card item={item} horizontal />
        }}/></Block>
    )
  }
  componentDidMount(){
  }

  render() {
    return (<Block style={{backgroundColor: '#FAFAFA'}}>
       <Spinner
                  visible={this.state.spinner}
                  textContent={'Searching...'}
                  textStyle={styles.spinnerTextStyle}
                />
                {this.renderCreateModal()}
                {this.renderPaymentModal()}
      <Block row space="between" style={{padding: 10}}>
      <Block>
        <Text style={{ fontFamily: 'HKGrotesk-Light', fontSize: 14 }} color='#CB582D'>
            TODAY'S PRICES
        </Text>
      </Block>
      <Block row>
      <ModalSelector
          data={this.state.depotX}
          initValue={this.state.depot.Name}
          selectStyle={styles.picker}
          selectTextStyle={styles.selectTextStyle}
          initValueTextStyle={styles.initvalueTextStyle}
          onChange={(itemValue) => this.pickerDepotX(itemValue.key)} />
        <Icon
              name={'chevron-down'}
              family="octicon"
              size={14}
              color={nowTheme.COLORS.ICON}
            />
      </Block>
      </Block>
      {this.renderPrices()}
      <Block style={{margin: 5, padding: 5, backgroundColor: "#ffffff"}}>
      <Text style={{ fontFamily: 'HKGrotesk-SemiBold', fontSize: 14, textAlign: 'center' }}>
            Want a price offer? Call +234 NEPAL SALES
        </Text>
      </Block>
      {this.renderArticles()}
    </Block>);
  }
}

const styles = StyleSheet.create({
  loginbutton: {
    width: (width /2) - 7.5,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginRight: 5,
    marginLeft: 5
  },

  registerbutton: {
    width: (width /2) - 7.5,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  picker: {
    borderWidth: 0,
    height: 23,
    width: 200,
    padding: 0
  },
  yesbutton: {
    width: (width /3) - (theme.SIZES.BASE * 2 + 2.5),
    height: theme.SIZES.BASE * 2,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginRight: 10,
    marginLeft: 20
  },
  selectTextStyle: {
    fontFamily: 'HKGrotesk-Bold',
    fontSize: 14,
    color: nowTheme.COLORS.PRIMARY,
    textTransform: 'uppercase', 
  },
  initvalueTextStyle: {
    fontFamily: 'HKGrotesk-Bold',
    fontSize: 14,
    color: nowTheme.COLORS.PRIMARY,
    textTransform: 'uppercase', 
  },
  selectBox: {
    width: 222,
    height: 23,
    color: nowTheme.COLORS.PRIMARY,
    textTransform: 'uppercase',
    fontFamily: 'HKGrotesk-Bold',
    fontSize: 14,
    lineHeight: 16,
    padding: 0
  },
  increbutton: {
    width: 101.1,
    height: 40,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderRadius: 0,
    marginVertical: theme.SIZES.BASE / 2
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
  Qtyinputs: {
    borderWidth: 1,
    borderColor: '#1917181F',
    borderRadius: 0,
    backgroundColor: '#ffffff',
    paddingVertical: 0,
    width: (width * 0.9) - 202,
    height: 40
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
  inputs: {
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: '#ffffff'
  },
  selected: {
    backgroundColor: nowTheme.COLORS.BLACK,
    
  }
});

export default Home;
