import React from 'react';
import { StyleSheet,  Dimensions, Image, Alert, FlatList, Modal, View, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Block, theme,Button as GaButton, Button, Text } from "galio-framework";
import {OrderCard, Input, Icon } from "../components";
import { prod, Images, nowTheme } from '../constants';
import Spinner from 'react-native-loading-spinner-overlay';
import PhoneInput from 'react-native-phone-input'
import StepIndicator from 'react-native-step-indicator'
import TextInputMask from 'react-native-text-input-mask';
import FloatingActionButton from "react-native-floating-action-button";
import Programming from "../screens/Programming"
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import HttpService from "../services/HttpService";

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

  class TrackOrder extends React.Component {
    
    state = {
        DailyPrices: [],
        Filters: prod.Filters,
        Orders: [],
        OriginalOrders: [],
        OrderId: 0,
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
      Depots: [],
      token: null,
      BankName: null,
      Reference: null
    }
    pinInput = React.createRef();

    readData = async () => {
      return await AsyncStorage.getItem('user');
    }
    pickerProduct(index){
        this.state.DailyPrices.map( (v,i)=>{
         if( index === i ){
           this.setState({
           product: this.state.DailyPrices[index],
           unitPrice: this.state.DailyPrices[index].price,
          })
         }
        })
    }
    pickerDepot(index){
      this.state.Depots.map( (v,i)=>{
       if( index === i ){
         this.setState({
         depot: this.state.Depots[index]
        })
       }
      })
  }
    setModalCreateVisible(visible) {
      if(visible){
        this.setState({quantity: "33000"})
      }else{
        
      }
        this.setState({modalCreateVisible: visible});
      }

      setModalPaymentVisible(visible) {
        this.setState({modalPaymentVisible: visible});
      }

      setModalProgramVisible(visible) {
        this.setState({modalProgramVisible: visible});
      }

      setIncrease(number){
      
        var quantity = parseInt(this.state.quantity) + number
        this.setState({quantity: quantity.toString(), ifInputupdated: true})
      }
  
      setDecrease(number){
        if(parseInt(this.state.quantity) >= number){
        var quantity = parseInt(this.state.quantity) - number
        this.setState({quantity: quantity.toString(), ifInputupdated: true})
        }
      }

      onStepPress = position => {
        this.setState({ currentPosition: position })
      }
      Next(last){
        let ifup = false;
        var currentPosition = this.state.currentPosition
          if(last){
              var TotalAmount = this.state.quantity * this.state.product.price;
              this.setState({TotalAmount: TotalAmount})
          }
          console.log(this.state.ipman)
        if(last && this.state.ipman == 1){
          var model = {
            ProductId: this.state.product.id,
            DepotId: this.state.depot.id,
            Quantity: parseInt(this.state.quantity),
            TotalAmount: parseInt(this.state.quantity * this.state.product.price)
          } 
          if(this.state.DepotId == null)
          {
            console.log(model)
             HttpService.PostAsync('api/Order', model, this.state.token).then(response => response.json().then(value => 
             {
               console.log(value);
               this.setState({OrderId: value})
               HttpService.GetAsync('api/Order', this.state.token).then(response => {
                console.log(response)
                response.json().then(value => {
                  //console.log(value)
                  this.setState({Orders: value, OriginalOrders: value});
      
                  
                })
                
              })
              this.setState({
                unitPrice: null,
                TotalAmount: "0",
                depotX: prod.Depots.map((d, i) => {
                  return { key: i, label: d.Name}
                }),
                depot: prod.Depots[0],
                spinner: false, CompletePayment: false
              });
             }));
         }else{
             HttpService.PutAsync('api/Order/' + this.state.OrderId, model, this.state.token).then(response => response.json().then(value => 
             {
               console.log(value);
               HttpService.GetAsync('api/Order', this.state.token).then(response => {
                console.log(response)
                response.json().then(value => {
                  //console.log(value)
                  this.setState({Orders: value, OriginalOrders: value});
      
                  
                })
                
              })
              this.setState({
                unitPrice: null,
                TotalAmount: "0",
                depotX: prod.Depots.map((d, i) => {
                  return { key: i, label: d.Name}
                }),
                depot: prod.Depots[0],
                spinner: false, CompletePayment: false
              });
               //this.setState({DepotId: value})
             }));
         }
          currentPosition = this.state.currentPosition + 2
        }else {
          if(this.state.currentPosition == 3){
            var model = {
              ProductId: this.state.product.id,
              DepotId: this.state.depot.id,
              Quantity: parseInt(this.state.quantity),
              TotalAmount: parseInt(this.state.TotalAmount)
            } 
            if(this.state.DepotId == null)
            {
               HttpService.PostAsync('api/Order', model, this.state.token).then(response => response.json().then(value => 
               {
                 console.log(value);
                 this.setState({OrderId: value})
               }));
           }else{
               HttpService.PutAsync('api/Order/' + this.state.DepotId, model, this.state.token).then(response => response.json().then(value => 
               {
                 console.log(value);
                 //this.setState({OrderId: value})
               }));
           }
         }
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
        //perform logic
        if(this.state.BankName != null && this.state.Reference != null) {
         this.setState({spinner: true})
         //validate payment 

         var model = {
           orderId: this.state.OrderId,
           totalAmount: parseInt(this.state.TotalAmount),
           type: 3,
           name: this.state.BankName,
           reference: this.state.Reference
         }
         console.log(model)
         HttpService.PostAsync('api/Credit', model, this.state.token).then( resp => {
           if(resp.status == 200){
         this.setState({
           depot: null,
           product : null,
           productIndex: null,
           depotIndex: null,
           unitPrice: null,
           TotalAmount: "0",
           depotX: prod.Depots.map((d, i) => {
             return { key: i, label: d.Name}
           }),
           depot: prod.Depots[0],
           spinner: false, CompletePayment: true
         });

       }
       })
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
            this.props.navigation.navigate('OrderDetail', { orderId: this.state.OrderId})
    }
    requestcredit = () => {
      if(this.state.Balance >= parseInt(this.state.TotalAmount)){
        
        if(this.state.OrderId != 0){
          this.setState({spinner: true})
          var model = {
            orderId: this.state.OrderId,
            totalAmount: parseInt(this.state.TotalAmount),
            type: 2
          }
          HttpService.PostAsync('api/Credit', model, this.state.token).then( response => {
            this.setModalPaymentVisible(false);
            this.setModalCreateVisible(false);
            this.setState({spinner: false})
            Alert.alert("Credit Request", "Your credit approval request is sent successfully. Your order will be confirmed upon credit approval");
          })
        }
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

    filterOrder(item){
        var stat = (item.Status == 0) ? 1 : 0
        let activeFilterIndex = this.state.Filters.findIndex(c => c.Status == stat);
        let selectedFilterIndex = this.state.Filters.findIndex(c => c == item);
        var filters = this.state.Filters;
        filters[activeFilterIndex].Status = item.Status;
        filters[selectedFilterIndex].Status = stat;
        let filteredOrder = [];
        if(item.Name != 'All'){
            filteredOrder = this.state.OriginalOrders.filter(o => o.status == item.Id);
        }else{
            filteredOrder = this.state.OriginalOrders;
        }
        console.log(filters);
        this.setState({Orders: filteredOrder, Filters: filters});
    }

    renderProducts = () => {
      let bgColor = ["#303E4F", "#437FB4", "#909090", "#CB582D", "#E37E2E"]
        return this.state.DailyPrices.map((p, i)=>{
            const productStyle = [styles.product, {backgroundColor: bgColor[i]}, (this.state.productIndex == i) && styles.selected]
            return (<TouchableHighlight onPress={() => this.setProduct(p, i)}>
                <Block width={width * 0.9} row space='between' style={productStyle}>
                    <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16, color: '#ffffff' }}>{p.product}</Text>
                    <Text style={{ fontFamily: 'HKGrotesk-MediumLegacy', fontSize: 16, color: '#f4f4f4' }}>₦{p.price}/{p.Unit}</Text>
                </Block>
            </TouchableHighlight>)
        })
    }

    renderDepots = () => {
      
        return this.state.Depots.map((p, i)=>{
            const productStyle = [styles.product, (this.state.depotIndex == i) && styles.selected]
            return (<TouchableHighlight onPress={() => this.setDepot(p, i)}>
                <Block width={width * 0.9} middle style={productStyle}>
                    <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16, color: '#ffffff' }}>{p.name}</Text>
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
        if(!this.state.isfetched){
        this.readData().then( resp => {
          if(resp !== null){
        
            var user = JSON.parse(resp);
            this.setState({Name: user.businessName,
            Limit: user.creditLimit,
            Balance: user.creditBalance,
            ipman: user.isIPMAN,
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

      <Block row space='between' style={{marginTop: 5}}>
      <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => this.setIncrease(33000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    +33,000
                  </Text>
                </Button>
                <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => this.setIncrease(40000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    +40,000
                  </Text>
                </Button>
                <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => this.setIncrease(45000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    +45,000
                  </Text>
                </Button>
        </Block>
        <Block row space='between' style={{marginTop: 5}}>
        <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => this.setIncrease(60000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    +60,000
                  </Text>
                </Button>
                <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.PRIMARY}
                  onPress={() => this.setIncrease(90000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    +90,000
                  </Text>
                </Button>
        </Block>
      <Block row space='between' style={{marginTop: 5}}>
      
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
                    editable = {false}
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
                <Block row space='between' style={{marginTop: 5}}>
      <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.DARK}
                  onPress={() => this.setDecrease(33000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    -33,000
                  </Text>
                </Button>
                <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.DARK}
                  onPress={() => this.setDecrease(40000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    -40,000
                  </Text>
                </Button>
                <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.DARK}
                  onPress={() => this.setDecrease(45000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    -45,000
                  </Text>
                </Button>
        </Block>
        <Block row space='between' style={{marginTop: 5}}>
        <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.DARK}
                  onPress={() => this.setDecrease(60000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    -60,000
                  </Text>
                </Button>
                <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.DARK}
                  onPress={() => this.setDecrease(90000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    -90,000
                  </Text>
                </Button>
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
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-BoldLegacy', color: '#FFFFFF', marginTop: 5}}>{product.product} (ex {depot.name})</Text>
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
                        <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF', marginTop: 5, textAlign: 'center'}}>{product.product} (ex {depot.Name})</Text>
                    
                    <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Order Quantity:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{quantity.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} Litres</Text>
                    </Block>
                    <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>List Unit Price:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{product.price}</Text>
                    </Block>
                    <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Discount Offered:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>0</Text>
                    </Block>
                    <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Net Unit Price:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{product.price}</Text>
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
                                          Submit Bank Deposit
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
                <Block row space='between' style={{marginTop: 5}} space='between' style={{width: width, padding: 10, alignItems:'center', marginBottom: 20, borderBottomColor: '#1D1D1D24', borderBottomWidth: 1}}>
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
                  <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                                <Text style={{fontSize: 24, lineHeight: 40, fontFamily: 'HKGrotesk-Medium'}}>Enter Bank Teller details</Text>
                                <Text size={14} style={{color: '#0A0716', lineHeight: 15, fontFamily: 'HKGrotesk-Regular'}}>
                You are expected to make payment at any bank, please provide the payment information
                </Text>
                <Block width={width * 0.9} style={{ marginBottom: 5, marginLeft: 5, marginTop: 25 }}>
                <Input
                        left
                        color="black"
                        style={styles.inputs}
                        placeholder="Enter bank name"
                        onChangeText={text => this.setState({BankName: text})}
                        noicon
                    />
                              </Block>
               <Block width={width * 0.9} space='between' style={{marginTop: 5}} style={{ marginBottom: 5, marginLeft: 5, }} space="between">
                  <Input
                        left
                        color="black"
                        style={styles.inputs}
                        placeholder="Enter teller number or payment refrence number"
                        onChangeText={text => this.setState({Reference: text})}
                        noicon
                    />
                              
                                </Block>
                  
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
              </Block>
              :
            <Block width={width * 0.9} height={height} center style={{justifyContent: 'center'}}>
                <Block>
                    <Image source={Images.Profile} style={{ width: 56, height: 55, borderRadius: 50}} />
                </Block>
                <Block style={{marginTop: 10}}>
                <Text size={19} style={{color: '#2C4453', lineHeight: 26, fontFamily: 'ProductSans-Bold'}}>
                    Great work {this.state.businessName}
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

    componentDidMount(){
      AsyncStorage.getItem('userToken').then( value => {
        this.setState({spinner: true, token: value});

        HttpService.GetAsync('api/Order', value).then(response => {
          console.log(response)
          response.json().then(value => {
            //console.log(value)
            this.setState({Orders: value, OriginalOrders: value});

            
          })
          this.setState({spinner: false});
        })
      })
      AsyncStorage.getItem('misc').then(value => {
        console.log(value)
        this.setState(JSON.parse(value));
      })
      
    }

    render () {
        return (
            <Block flex center>
                <Spinner
                  visible={this.state.spinner}
                  textContent={'Loading...'}
                  textStyle={styles.spinnerTextStyle}
                />
                {this.renderCreateModal()}
                {this.renderPaymentModal()}
                {/* {this.renderProgramModal(true)} */}
                    <Block row style={{zIndex: 3, position: 'absolute', top: '90%', right: '5%'}}>
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
                            return <OrderCard item={item} Navigation={this.props.navigation}/>
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
        paddingHorizontal: 120,
        width:  width-40,
        height: 50
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
      nobutton: {
        width: (width /3) - (theme.SIZES.BASE * 2 + 2.5),
        height: theme.SIZES.BASE * 3,
        shadowRadius: 0,
        shadowOpacity: 0,
      },
      selected: {
        backgroundColor: nowTheme.COLORS.BLACK,
        
      }
});

export default TrackOrder