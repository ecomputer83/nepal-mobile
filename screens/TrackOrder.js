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
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalSelector from 'react-native-modal-selector';
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
      Depots: [],
      token: null,
      BankName: null,
      Reference: null,
      CreditAmount: "0",
      CreditDate: new Date(),
      QuantityLoad: [],
      Capacity: [{key: 33000, label: '33,000'}, {key: 40000, label: '40,000'}, {key: 45000, label: '45,000'}, {key: 60000, label: '60,000'},{key: 90000, label: '90,000'}],
      SelectedCapacity: {"key": 33000, "label": "33,000"},
      NumCapacity: '1',
      ShowDatePicker:  false,
      OrderNo: null,
      Group: "",
      Banks: []
    }
    pinInput = React.createRef();

    setBank =(itemValue) => {
      this.setState({BankName: itemValue.key});
    }
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
    var existIndex = load.findIndex(l=>l.Capacity == _selectedCapacity);
    var _quantity = parseInt(this.state.quantity);
    if(existIndex > -1){
      _quantity = _quantity - (parseInt(load[existIndex].Capacity.key) * parseInt(load[existIndex].number))
      load[existIndex] = {Capacity: _selectedCapacity, number: _selectedNumber};
      _quantity = _quantity + (parseInt(_selectedCapacity.key) * parseInt(_selectedNumber))
    }else{
    load.push({Capacity: _selectedCapacity, number: _selectedNumber});
    _quantity = _quantity + (parseInt(_selectedCapacity.key) * parseInt(_selectedNumber))
    }
    console.log(load)
    this.setState({QuantityLoad: load, quantity: _quantity, ifInputupdated: true});
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
    if(visible)
      this.setState({TotalAmount: "0", depot: null,
      product : null,
      productIndex: null,
      depotIndex: null,
      unitPrice: null,currentPosition: 0, QuantityLoad: [],
      currentState: 0})

      
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
            if(this.state.quantity == "0"){
              alert("Quantity must be set!");
              return;
            }else{
              var TotalAmount = this.state.quantity * this.state.product.price;
              this.setState({TotalAmount: TotalAmount, CreditAmount: TotalAmount})
            }
          }
          console.log(this.state.ipman)
        if(last && this.state.ipman == 1){
          var model = {
            ProductId: this.state.product.id,
            DepotId: this.state.depot.id,
            Quantity: parseInt(this.state.quantity),
            TotalAmount: parseInt(this.state.quantity * this.state.product.price)
          } 
          if(this.state.OrderId == 0)
          {
            console.log(model)
             HttpService.PostAsync('api/Order', model, this.state.token).then(response => response.json().then(v => 
             {
               console.log(v);
               this.setState({OrderId: v})
               HttpService.GetAsync('api/Order', this.state.token).then(response => {
                console.log(response)
                response.json().then(value => {
                  //console.log(value)
                  var newOrder = value.find(c=>c.orderId == v)
                  this.setState({Orders: value, OriginalOrders: value, OrderNo: newOrder.orderNo});
      
                  
                })
                
              })
              this.setState({
                unitPrice: null,
                depotX: prod.Depots.map((d, i) => {
                  return { key: i, label: d.Name}
                }),
                //depot: this.state.Depots[0],
                spinner: false, CompletePayment: false
              });
             }));
         }else{
             HttpService.PutAsync('api/Order/' + this.state.OrderId, model, this.state.token).then(response => response.json().then(v => 
             {
               console.log(v);
               HttpService.GetAsync('api/Order', this.state.token).then(response => {
                console.log(response)
                response.json().then(value => {
                  //console.log(value)
                  var newOrder = value.find(c=>c.orderId == v)
                  this.setState({Orders: value, OriginalOrders: value, OrderNo: newOrder.orderNo});
      
                  
                })
                
              })
              this.setState({
                unitPrice: null,
                depotX: prod.Depots.map((d, i) => {
                  return { key: i, label: d.Name}
                }),
                //depot: prod.Depots[0],
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
            if(this.state.OrderId == 0)
            {
               HttpService.PostAsync('api/Order', model, this.state.token).then(response => response.json().then(v => 
               {
                 console.log(v);
                 this.setState({OrderId: v})
               HttpService.GetAsync('api/Order', this.state.token).then(response => {
                console.log(response)
                response.json().then(value => {
                  //console.log(value)
                  var newOrder = value.find(c=>c.orderId == v)
                  this.setState({Orders: value, OriginalOrders: value, OrderNo: newOrder.orderNo});
      
                  
                })
                
              })
              this.setState({
                unitPrice: null,
                depotX: prod.Depots.map((d, i) => {
                  return { key: i, label: d.Name}
                }),
                //depot: prod.Depots[0],
                spinner: false, CompletePayment: false
              });
               }));
           }else{
               HttpService.PutAsync('api/Order/' + this.state.DepotId, model, this.state.token).then(response => response.json().then(v => 
               {
                 console.log(v);
                 HttpService.GetAsync('api/Order/'+v, this.state.token).then(response => {
                  console.log(response)
                  response.json().then(value => {
                    //console.log(value)
                    var newOrder = value.find(c=>c.orderId == v)
                    this.setState({Orders: value, OriginalOrders: value, OrderNo: newOrder.orderNo});
        
                    
                  })
                  
                })
                this.setState({
                  unitPrice: null,
                  depotX: prod.Depots.map((d, i) => {
                    return { key: i, label: d.Name}
                  }),
                  //depot: prod.Depots[0],
                  spinner: false, CompletePayment: false
                });
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

       }else{
        alert("There is an error in the submission")
      }
       })
      }else{
        this.setState({spinner: false})
        alert("Payment amount not must be less than "+this.state.TotalAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
      }
      }
}
onChange = (event, selectedDate) => {
  const currentDate = selectedDate || this.state.date;
  //setShow(Platform.OS === 'ios');
  this.setState({CreditDate: currentDate});
};
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

    setProduct(item, index){
        console.log(item)
        this.setState({product: item, productIndex: index, ifInputupdated: true});
        this.Next();
    }

    setDepot(item, index){
      console.log(item);
      var Group = item.group;
      if(Group != this.SelectedGroup){
        this.setState({spinner: true})
      HttpService.GetAsync('api/Misc/SalePrice/'+ Group).then(response => response.json().then(v => {
        this.setState({depot: item, depotIndex: index, ifInputupdated: true, DailyPrices: v, SelectedGroup: Group, spinner: false});
        this.Next()
       }));
      }else{
        this.setState({depot: item, depotIndex: index, ifInputupdated: true});
        this.Next()
      }
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
    renderQuantityPage = () => {

      return (
        <Block width={width * 0.9} style={{ marginBottom: 5 }}>
      <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>What quantity do you want to buy?</Text>
    
          <Block row space='between' style={{marginTop: 5, marginBottom: 20}}>
          <Block width={width * 0.5} row space='between' style={{paddingVertical: 10, paddingHorizontal: 5}}>
       <Block style={styles.dropdownpicker}>
                              <ModalSelector
                                  data={this.state.Capacity }
                                  initValue='Select Capacity'
                                  selectStyle={styles.selectStyle}
                                  selectTextStyle={styles.selectTextStyle}
                                  initValueTextStyle={styles.initvalueTextStyle}
                                  onChange={(itemValue) => this.setState({SelectedCapacity: itemValue})} />
                              </Block>  
      </Block>
      <Block width={width * 0.3} row space='between' style={{marginTop: 2, marginLeft: 5, marginRight: 5}} space="between">
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
    renderProducts = () => {
      let bgColor = ["#303E4F", "#437FB4", "#909090", "#CB582D", "#E37E2E"]
        return this.state.DailyPrices.map((p, i)=>{
            const productStyle = [styles.product, {backgroundColor: bgColor[i]}, (this.state.productIndex == i) && styles.selected]
            return (<TouchableHighlight onPress={() => this.setProduct(p, i)}>
                <Block width={width * 0.9} row space='between' style={productStyle}>
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
                      <Block width={47} height={47} style={{ backgroundColor: nowTheme.COLORS.BACKGROUND, marginBottom: 13, marginTop: 23, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
                      <Icon
                          name={'check'}
                          family="octicon"
                          size={20}
                          color={nowTheme.COLORS.WHITE}
                      />
                      </Block>

                      <Text style={{fontSize: 14, lineHeight: 24, fontFamily: 'ProductSans-Bold', textAlign: 'center'}}>Congratulations! Your Order has been submitted Successfully.</Text>


                        <Block style={{width: (width * 0.9), marginTop: 10, paddingVertical: 10, paddingHorizontal: '23%', backgroundColor: '#121112'}}>
                        <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF', marginTop: 5, textAlign: 'center'}}>{product.product} (ex {depot.name})</Text>
                        <Block row space='between'>
                    <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>Reference No:</Text>
                      <Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'HKGrotesk-Regular', color: '#FFFFFF'}}>{this.state.OrderNo}</Text>
                    </Block>
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
                        <Text size={12} style={{fontFamily: 'HKGrotesk-SemiBoldLegacy', lineHeight: 14,  marginTop: 10}}>NOTE: Please make payment to any account in the link below, after payment, go to Orders tab and select the order with reference no {this.state.OrderNo} to submit the receipt of payment</Text>
              <TouchableHighlight onPress={() => {this.setModalCreateVisible(false); this.props.navigation.navigate('BankAccount', {Banks: this.state.Banks});}}><Text style={{fontSize: 12, lineHeight: 15, fontFamily: 'ProductSans-Medium', color: '#23C9F1', marginTop: 15, textAlign: 'center'}}>Bank accounts</Text></TouchableHighlight>

                    </Block>
      }
                  <Block style={{marginBottom:  10, marginTop: 20}}></Block>
                                
                  </Block>
                  
                </Block>
              </Block>

              { (currentPosition == 3) ?  (
                              <Block width={width * 0.9} center style={{position: 'absolute', bottom: 40}}>
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
                                <Block width={width * 0.9} center style={{position: 'absolute', bottom: 40}}>
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
                <Block style={styles.dropdownpicker}>
                              <ModalSelector
                                  data={this.state.Banks }
                                  initValue='Select Account'
                                  selectStyle={styles.selectStyle}
                                  selectTextStyle={styles.selectTextStyle}
                                  initValueTextStyle={styles.initvalueTextStyle}
                                  onChange={(itemValue) => this.setBank(itemValue)} />
                              </Block>  
                              </Block>
                <Block width={width * 0.9} space='between' style={{ marginBottom: 5, marginLeft: 5, marginTop: 5 }}>
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Transaction Amount
                  </Text>
                  <Input
                        left
                        color="black"
                        style={styles.cardinputs}
                        placeholder="Amount"
                        value={this.state.TotalAmount.toString()}
                        onChangeText={text => this.setState({CreditAmount: text})}
                        noicon
                        editable={false}
                        keyboardType="numeric"
                    />
                              
                </Block>
               <Block width={width * 0.9} space='between'  style={{ marginBottom: 5, marginLeft: 5, marginTop: 5 }}>
               <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Receipt No
                  </Text>
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
                <Text style={{ fontFamily: 'HKGrotesk-Regular' }} size={14}>
                  Transaction Date
                  </Text>
                <TouchableHighlight onPress={() => this.showDatePicker()}>
                  <Block width={width * 0.9} middle style={styles.datepicker}>
                      <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16 }}>{this.state.CreditDate.toDateString()}</Text>
                  </Block>
                  </TouchableHighlight>
                  <DateTimePickerModal
            isVisible={this.state.ShowDatePicker}
            maximumDate={new Date()}
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
        HttpService.GetAsync('api/misc/banks', value).then(response => {
          response.json().then(art => {
            var banks = art.map((d, i) => {
              return { key: d.no, label: d.name + ' - ' + d.bankAccountNo}
            });
            this.setState({ Banks: banks});
          })
        })
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
      cardinputs: {
        borderWidth: 1,
        borderColor: '#1917181F',
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
      dropdownpicker: {
        borderWidth: 1,
        borderColor: '#1917181F',
        borderRadius: 0,
        height: 45,
        width: '100%',
        marginBottom: 10
      },
      picker2: {
        borderWidth: 0,
        height: 10,
        width: width * 0.38,
        padding: 0
      },
      inputsX: {
        borderWidth: 1,
        borderColor: '#1917181F',
        borderRadius: 0,
        backgroundColor: '#ffffff',
        margin:0
      },
      selectStyle:{
        borderWidth: 0
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
      datepicker: {
        borderWidth: 1,
        borderColor: '#1917181F',
        borderRadius: 0,
        height: 45,
        marginBottom: 10
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