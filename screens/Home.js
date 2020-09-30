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
import HttpService from "../services/HttpService";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
      DailyPrices: [],
      Articles: [],
      OrderId: 0,
      modalCreateVisible: false,
        modalPaymentVisible: false,
        modalProgramVisible:  false,
        spinner: true,
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
        ifInputupdated: false,
        Name: 'Business Name',
      Limit: 0,
      Balance: 0,
      ipman: 0,
      isnoteligible: false,
      isfetched: false,
      depotX: [],
      Depots: [],
      depot: {},
      _depot: {},
      token: null,
      BankName: null,
      Reference: null,
      CreditAmount: "0",
      CreditDate: new Date(),
      QuantityLoad: [],
      Capacity: [{key: 33000, label: '33,000'}, {key: 40000, label: '40,000'}, {key: 45000, label: '45,000'}, {key: 60000, label: '60,000'},{key: 90000, label: '90,000'}],
      SelectedCapacity: {"key": 33000, "label": "33,000"},
      NumCapacity: '1',
      ShowDatePicker:  false
    }
    
  }
  pinInput = React.createRef();

  readData = async () => {
    
    return await AsyncStorage.getItem('user');
  }
  pickerProduct(index){
      this.state.DailyPrices.map( (v,i)=>{
       if( index === i ){
         this.setState({
         product: prod.DailyPrices[index],
         unitPrice: prod.DailyPrices[index].Price,
        })
       }
      })
  }
  pickerDepot(index){
    this.state.Depots.map( (v,i)=>{
     if( index === i ){
       this.setState({
       _depot: prod.Depots[index]
      })
     }
    })
}
  pickerDepotX(index){
    this.state.Depots.map( (v,i)=>{
     if( index === i ){
       this.setState({
       depot: prod.Depots[index]
      })
     }
    })

  }

  showDatePicker = () => {
    this.setState({ShowDatePicker: true});
  };

  hideDatePicker = () => {
    this.setState({ShowDatePicker: false});
  };

  handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    this.setState({ShowDatePicker: false, CreditDate: date});
  };

  setQuantity = () => {
    var _selectedCapacity = this.state.SelectedCapacity;
    var _selectedNumber = this.state.NumCapacity;
    var load = this.state.QuantityLoad;

    load.push({Capacity: _selectedCapacity, number: _selectedNumber});
    console.log(load)
    this.setState({QuantityLoad: load, quantity: parseInt(this.state.quantity) + (parseInt(_selectedCapacity.key) * parseInt(_selectedNumber))});
  }

  removeQuantity = (index) => {
    var load = this.state.QuantityLoad;
    var item = load[index];
    console.log(item);
    var totalAmount = parseInt(item.Capacity.key) * parseInt(item.number);
    load.splice(index, 1);
    this.setState({QuantityLoad: load, quantity: parseInt(this.state.quantity) - totalAmount});
  }

  setModalCreateVisible(visible) {
    
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
           }));
       }else{
           HttpService.PutAsync('api/Order/' + this.state.OrderId, model, this.state.token).then(response => response.json().then(value => 
           {
             console.log(value);
             //this.setState({OrderId: value})
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
             console.log(model)
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
              if(parseInt(this.state.TotalAmount) <= parseInt(this.state.CreditAmount)){
              var model = {
                orderId: this.state.OrderId,
                totalAmount: parseInt(this.state.CreditAmount),
                type: 3,
                name: this.state.BankName,
                reference: this.state.Reference,
                creditDate: this.state.CreditDate
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
          }else{
            this.setState({spinner: false})
            alert("Payment amount not must be less than "+this.state.Order.totalAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
          }
          }
    }

    edit() {
      let currentPosition = 0
      this.setState({currentPosition: currentPosition})
    }

    onChange = (event, selectedDate) => {
      const currentDate = selectedDate || this.state.date;
      //setShow(Platform.OS === 'ios');
      this.setState({CreditDate: currentDate});
    };

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
        type: 2,
        creditDate: new Date()
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

renderQuantityPage = () => {

  return (
    <Block width={width * 0.9} style={{ marginBottom: 5 }}>
  <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>What quantity do you want to buy?</Text>

      <Block row space='between' style={{marginTop: 5, marginBottom: 20}}>
      <Block width={width * 0.4} row space='between' style={{marginTop: 5, paddingVertical: 15, paddingHorizontal: 5}}>
      <ModalSelector
          data={this.state.Capacity}
          initValue={this.state.Capacity[0].key}
          selectStyle={styles.picker2}
          selectTextStyle={styles.selectTextStyle}
          initValueTextStyle={styles.initvalueTextStyle}
          onChange={(itemValue) => this.setState({SelectedCapacity: itemValue})} />
        <Icon
              name={'chevron-down'}
              family="octicon"
              size={14}
              color={nowTheme.COLORS.ICON}
            />
      </Block>
      <Block width={width * 0.3} row space='between' style={{marginTop: 0, marginLeft: 5, marginRight: 5}} space="between">
              <Input
                    left
                    color="black"
                    style={styles.inputsX}
                    placeholder="Amount"
                    value={this.state.NumCapacity}
                    onChangeText={text => this.setState({NumCapacity: text})}
                    noicon
                    keyboardType="numeric"
                />
                          
        </Block>
      <Block width={width * 0.1}>
        <TouchableHighlight onPress={() => this.setQuantity() } style={{width: width * 0.1, paddingVertical: 15}}>
          <Icon name="pluscircleo" family="AntDesign" />
        </TouchableHighlight>
      </Block>
      </Block>
      <Block row space='between' style={{marginTop: 5, marginBottom: 15}}>
              <Block width={width * 0.6}><Text style={{fontSize: 16, lineHeight: 17, fontFamily: 'HKGrotesk-MediumLegacy'}}>Total Quantity</Text></Block>
              <Block width={width * 0.4}><Text style={{fontSize: 14, lineHeight: 15, fontFamily: 'HKGrotesk-Bold'}}>{(this.state.quantity).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text></Block>
          </Block>
        
          <Text size={10} style={{fontFamily: 'HKGrotesk-SemiBoldLegacy', lineHeight: 14, color: '#919191', marginBottom: 10}}>Order Capacity</Text>
      <FlatList data={this.state.QuantityLoad} keyExtractor={(item, index )=> index.toString()} extraData={this.state} ListHeaderComponent={null} renderItem={({item, index}) => {
          return (<Block row space='between' style={{marginTop: 5}}>
              <Block width={width * 0.3}><Text style={{fontSize: 14, lineHeight: 15, fontFamily: 'HKGrotesk-MediumLegacy'}}>{item.Capacity.label}</Text></Block>
              <Block width={width * 0.2}><Text style={{fontSize: 14, lineHeight: 15, fontFamily: 'HKGrotesk-MediumLegacy'}}>{item.number}</Text></Block>
              <Block width={width * 0.3}><Text style={{fontSize: 14, lineHeight: 15, fontFamily: 'HKGrotesk-Bold'}}>{(item.Capacity.key * item.number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text></Block>
              <Block width={width * 0.2}><TouchableHighlight onPress={() => this.removeQuantity(index) }>
          <Icon name="closecircleo" family="AntDesign" />
        </TouchableHighlight></Block>
          </Block>)
        }}/>
    </Block>
                
  )
}
  setProduct(item, index){
      console.log(item)
      this.setState({product: item, productIndex: index, ifInputupdated: true});
      this.Next()
  }

  setDepot(item, index){
      console.log(item);
      this.setState({depot: item, depotIndex: index, ifInputupdated: true});
      this.Next()
  }

  renderProducts = () => {
    let bgColor = ["#303E4F", "#437FB4", "#909090", "#CB582D", "#E37E2E"]
      return this.state.DailyPrices.map((p, i)=>{
          const productStyle = [styles.product, {backgroundColor: bgColor[i]}, (this.state.productIndex == i) && styles.selected]
          return (<TouchableHighlight onPress={() => this.setProduct(p, i)}>
              <Block width={width * 0.9} row space='between' style={{marginTop: 5}} space='between' style={productStyle}>
                  <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16, color: '#ffffff' }}>{p.product}</Text>
                  <Text style={{ fontFamily: 'HKGrotesk-MediumLegacy', fontSize: 16, color: '#f4f4f4' }}>₦{p.price}/{p.unit}</Text>
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
                {s.product}
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
                ₦{s.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  </Text>
        </Block>)
    })
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
            <Block row space='between' style={{marginTop: 5}} space='between' style={{width: width, padding: 10, alignItems:'center', marginBottom: 20, borderBottomColor: '#1D1D1D24', borderBottomWidth: 1}}>
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
              this.renderQuantityPage()
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
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF', marginTop: 5, textAlign: 'center'}}>{product.product} (ex {depot.name})</Text>
                
                <Block row space='between' style={{marginTop: 5}} space='between'>
                <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Order Quantity:</Text>
                  <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{quantity.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} Litres</Text>
                </Block>
                <Block row space='between' style={{marginTop: 5}} space='between'>
                <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>List Unit Price:</Text>
                  <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{product.price}</Text>
                </Block>
                <Block row space='between' style={{marginTop: 5}} space='between'>
                <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Discount Offered:</Text>
                  <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>0.5</Text>
                </Block>
                <Block row space='between' style={{marginTop: 5}} space='between'>
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
                            { (currentPosition == 2) ?
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
                    style={styles.cardinputs}
                    placeholder="Enter bank name"
                    onChangeText={text => this.setState({BankName: text})}
                    noicon
                />
                          </Block>
            <Block width={width * 0.9} space='between' style={{ marginBottom: 5, marginLeft: 5, marginTop: 5 }}>
              <Input
                    left
                    color="black"
                    style={styles.cardinputs}
                    placeholder="Amount"
                    onChangeText={text => this.setState({CreditAmount: text})}
                    noicon
                    keyboardType="numeric"
                />
                          
            </Block>
           <Block width={width * 0.9} space='between'  style={{ marginBottom: 5, marginLeft: 5, marginTop: 5 }}>
              <Input
                    left
                    color="black"
                    style={styles.cardinputs}
                    placeholder="Enter teller number or payment refrence number"
                    onChangeText={text => this.setState({Reference: text})}
                    noicon
                />
                          
            </Block>
            <Block width={width * 0.9} space='between'  style={{ marginBottom: 5, marginLeft: 5, marginTop: 5 }}>
            <TouchableHighlight onPress={() => this.showDatePicker()}>
              <Block width={width * 0.9} middle style={styles.datepicker}>
                  <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16 }}>{this.state.CreditDate.toDateString()}</Text>
              </Block>
              </TouchableHighlight>
              <DateTimePickerModal
        isVisible={this.state.ShowDatePicker}
        mode="date"
        onConfirm={this.handleConfirm}
        onCancel={this.hideDatePicker}
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
        <Block row space='between' style={{marginTop: 5}} space="between">
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

    if(this.state.DailyPrices != null){
      HttpService.GetAsync('api/Misc').then(response => {
        
        response.json().then(json => {
          console.log(json)
        if(json != undefined){
        var depots = json.depots.map((d, i) => {
          return { key: d.id, label: d.name}
        });
        var depot = (json.depots.length > 0) ? json.depots[0]: {};
        this.setState({DailyPrices: json.products, depotX: depots, Depots: json.depots, depot: depot})
        AsyncStorage.setItem('misc', JSON.stringify({DailyPrices: json.products, Depots: json.depots}))
        if(this.state.DailyPrices.length > 0){
          this.setState({spinner: false})
        }
        AsyncStorage.getItem('userToken').then( value => {
          this.setState({ token: value})
          HttpService.GetAsync('api/article', value).then(response => {
            response.json().then(art => {
              this.setState({ Articles: art});
            })
          })
        })
        

      }
      })
    });
    }
    
  }

  componentDidUpdate(){
    
  }

  render() {
    return (<Block style={{backgroundColor: '#FAFAFA'}}>
       <Spinner
                  visible={this.state.spinner}
                  textContent={'Loading...'}
                  textStyle={styles.spinnerTextStyle}
                />
                {this.renderCreateModal()}
                {this.renderPaymentModal()}
      <Block row space='between' style={{marginTop: 5}} space="between" style={{padding: 10}}>
      <Block>
        <Text style={{ fontFamily: 'HKGrotesk-Light', fontSize: 14 }} color='#CB582D'>
            TODAY'S PRICES
        </Text>
      </Block>
      <Block row space='between' style={{marginTop: 5}}>
      <ModalSelector
          data={this.state.depotX}
          initValue={this.state.depot.name}
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
  picker2: {
    borderWidth: 0,
    height: 10,
    width: width * 0.38,
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
  cardinputs: {
    borderWidth: 1,
    borderColor: '#1917181F',
    borderRadius: 0,
    backgroundColor: '#ffffff'
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
    paddingHorizontal: 120,
    width:  width-40,
    height: 50
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
  inputsX: {
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: '#ffffff',
    margin:0
  },
  datepicker: {
    borderWidth: 1,
    borderColor: '#1917181F',
    borderRadius: 0,
    height: 45,
    marginBottom: 10
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

export default Home;
