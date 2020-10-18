import React, { Profiler } from 'react';
import { Modal, StyleSheet, TouchableHighlight, Dimensions, FlatList, Alert, ScrollView , Picker } from 'react-native';
import { Block, theme,Button as GaButton, Button, Text } from "galio-framework";
import { Input, Icon, DetailCard, OrderCard } from '../components';
import FloatingActionButton from "react-native-floating-action-button";
import { prod, ST, nowTheme } from '../constants';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalSelector from 'react-native-modal-selector';
import HttpService from '../services/HttpService';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import NaijaStates from 'naija-state-local-government';
import { AsyncStorage } from 'react-native';
const { width, height } = Dimensions.get("screen");
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);
class OrderDetail extends React.Component {

  state = {
    Order: null,
    Credit: null,
    totalquantity: 0,
    remainQuantity: 0,
    programs: [],
    Banks: [],
    TruckNo: null,
    Quantity: "33000",
    Destination: null,
    State: null,
    StateX: NaijaStates.states().map(o => {
      return {key: o, label: o}
    }),
    LGA: null,
    modalVisible: false,
    modalPaymentVisible: false,
    spinner: false,
    currentState: 0,
    currentPosition: 0,
    isNew: false,
    ifInputupdated: false,
    LGAs: [],
    BankName: null,
      Reference: null,
      CreditAmount: "0",
      CreditDate: new Date(),
    token: null,
    ipman: false,
    Balance: '0',
    orderId: 0,
    isQuantitySet: false,
    ShowDatePicker:  false
}

constructor(props) {
  super(props);
  const Params = props.navigation.state.params
  console.log(Params)
  var SX = ST.States.map(o => {
    return {key: o.index, label: o.Name}
  })
  this.state = {
    Order: (Params.Order) ? Params.Order : null,
    totalquantity: (Params.Order) ? Params.Order.quantity: 0,
    remainQuantity: (Params.Order) ? Params.Order.quantity: 0,
    programs: [],
    TruckNo: null,
    currentPosition: 0,
    Quantity: "0",
  Destination: null,
  State: null,
  StateX: NaijaStates.states().map(o => {
    return {key: o, label: o}
  }),
  LGA: null,
  modalVisible: false,
  modalPaymentVisible: false,
  BankName: null,
      Reference: null,
      CreditAmount: "0",
      CreditDate: new Date(),
  spinner: false,
  currentState: 0,
  ifInputupdated: false,
  LGAs: [],
  isNew: true,
  token: null,
  orderId: (Params.orderId) ? Params.orderId : 0,
  isQuantitySet: false,
  ShowDatePicker:  false,
  userno: null
}
}
setBank =(itemValue) => {
  this.setState({BankName: itemValue.key});
}
componentDidMount(){
  AsyncStorage.getItem('user').then(data =>{ 
      var user = JSON.parse(data)
      this.setState({ipman: user.isIPMAN, Balance: user.creditBalance, userno: user.userNo});
  })
  this.setState({spinner: true})
  AsyncStorage.getItem('userToken').then(token => {
    HttpService.GetAsync('api/misc/banks', token).then(response => {
      response.json().then(art => {
        var banks = art.map((d, i) => {
          return { key: d.no, label: d.name + ' - ' + d.bankAccountNo}
        });
        this.setState({ Banks: banks});
      })
    })
    HttpService.GetAsync('api/order/'+this.state.orderId, token)
    .then(response => response.json().then(value => {
      this.setState({Order: value, totalquantity: value.quantity, programs: value.programs, CreditAmount: value.totalAmount,
        remainQuantity: value.quantity, Credit: value.credit, token: token, spinner: false});
    }

    ))
  })
  
}
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }
    setQuantity(number){
      this.setState({Quantity: number.toString(), isQuantitySet: true, ifInputupdated: true})
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
    reesetQuantity(){
      this.setState({isQuantitySet: false})
    }

    setStates(v){
      var LGAs = NaijaStates.lgas(v.key).lgas.map(l => {
        return {key: l, label: l}
      });
      this.setState({LGAs: LGAs, State: v.label, ifInputupdated: (this.state.LGA && this.state.Destination)})
    }
    setModalPaymentVisible(visible) {
      this.setState({modalPaymentVisible: visible});
    }
    setLGA(v){
      this.setState({LGA: v.label, ifInputupdated: (this.state.State && this.state.Destination)})
    }

    Next(){
      var currentState = this.state.currentState + 1
      this.setState({currentState: currentState, ifInputupdated: false})
    }

    // getPrograms(){
    //   let results = [];

    //   return this.state.Order.programs
    // }

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
            AsyncStorage.getItem("user").then(_user => {
              var user = JSON.parse(_user);
              user.creditBalance = (parseInt(user.creditBalance) - this.state.TotalAmount).toString();
              AsyncStorage.mergeItem("user", JSON.stringify(user)).then( o => {
                this.setModalPaymentVisible(false);
            this.setModalCreateVisible(false);
            this.setState({spinner: false})
            Alert.alert("Credit Request", "Your credit approval request is sent successfully. Your order will be confirmed upon credit approval");
              })
            })
            
          })
        }
      }
      else {
        this.setState({isnoteligible: true})
        Alert.alert("Credit Request", "You have insufficient credit balance to proceed, Kindly make payment")
      }
    }
  
    AddProgram = () => {
      if((this.state.totalquantity - this.state.Quantity) == 0 || (this.state.totalquantity - this.state.Quantity) >= 33000){
      let obj = {
          orderId: this.state.Order.orderId,
          truckNo: this.state.TruckNo,
          quantity: parseInt(this.state.Quantity),
          destination: this.state.Destination + ', ' + this.state.LGA + ', ' + this.state.State,
          status: 1
      };
      console.log(obj);
      this.setState({spinner: true})
      HttpService.PostAsync('api/program', obj, this.state.token).then(response => {
        console.log(response)
        if(response.status == 200){
        HttpService.GetAsync('api/order/'+this.state.Order.orderId, this.state.token)
              .then(response => {
                console.log(response)
                response.json().then(value => {
                let remainQuantity = this.state.remainQuantity;
                  remainQuantity -= obj.quantity
                this.setState({Order: value, remainQuantity: remainQuantity, TruckNo: null, Quantity: remainQuantity.toString(), Destination: null, currentState: 0,spinner: false});
                this.setModalVisible(false);
          }

          )
        })
        }else{
          this.setState({spinner: false})
          alert("An error ocurred while adding program, contact administrator")
        }
      
    })
    }else{
        alert('You won`t be able to program the remaining '+ (this.state.totalquantity - this.state.Quantity) + 'ltrs in next program for this order, Kindly make adjustment now');
    }
  }


    setOrder = (p, remain) => {
      this.setState({totalquantity: p.Quantity,
        remainQuantity: remain, currentState: 1})
    }

    saveandnavigate = () => {
      if(this.state.programs.length != 0) {
          this.setState({
            spinner: true
          });
          setTimeout(() => {
            this.setState({ spinner: false });
            Alert.alert('Congratulation!', "Dispatch information has been programmed successfully.");
            this.props.navigation.navigate('TrackOrder')
          }, 3000);
        
    };
    }
    proceedToPayment = () => {
      let currentPosition = 0
        this.setState({currentPosition: currentPosition})
      this.setModalVisible(false);
      this.setModalPaymentVisible(true);
  }
  Proceed(){
    //perform logic
    if(this.state.BankName != null && this.state.Reference != null) {
     this.setState({spinner: true})
     //validate payment 
      if(this.state.Order.totalAmount <= parseInt(this.state.CreditAmount)){
     var model = {
       orderId: this.state.orderId,
       totalAmount: parseInt(this.state.CreditAmount),
       type: 3,
       name: this.state.BankName,
       reference: this.state.Reference,
       creditDate: this.state.CreditDate
     }
     console.log(model)
     HttpService.PostAsync('api/Credit', model, this.state.token).then( resp => {
       if(resp.status == 200){
        HttpService.GetAsync('api/order/'+this.state.orderId, this.state.token)
        .then(response => response.json().then(value => {
          this.setState({Order: value, totalquantity: value.quantity, programs: value.programs,
            remainQuantity: value.quantity, Credit: value.credit, spinner: false, modalPaymentVisible: false});
        }
    
        ))

   }
   })
  }else{
    this.setState({spinner: false})
    alert("Payment amount not must be less than "+this.state.Order.totalAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
  }
  }
}
  renderFeatures = () => {
    return (
      <Block>
        
        {this.state.Order != null ?
        (<OrderCard item={this.state.Order} />) : (<Block />) }
        
      </Block>
    )
  }

  renderPrograms = () => {
      let index = 0;
      return (<Block style={{ zIndex: 1, margin: 10, height: height * 0.6 }}>
        <Text size={10} style={{fontFamily: 'HKGrotesk-SemiBoldLegacy', lineHeight: 14, color: '#919191', marginBottom: 10}}>Order Program</Text>
      <FlatList data={this.state.Order.programs} keyExtractor={(item, index )=> index.toString()} extraData={this.state} ListHeaderComponent={null} renderItem={({item}) => {
        index++
        return <DetailCard item={item} index={index} Navigation={this.props.navigation} />
      }}/></Block>)
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
                    value={this.state.CreditAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
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
              maximumDate={new Date()}
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
  renderCredit = () => {

    return (<Block row>
      <Block style={{width: width/2,  paddingVertical: 5, paddingHorizontal: 10}}>
      <Text style={{
                  color: '#2C4453',
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-BoldLegacy',
                  zIndex: 2
                }}
              >
                Settlement
                  </Text>
      </Block>
      <Block style={{width: width/2, paddingVertical: 5, paddingHorizontal: 10, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <Text style={{
                  color: '#2C4453',
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-BoldLegacy',
                  zIndex: 2
                }}
              >
                {this.state.Credit.creditType}
                  </Text>
      </Block>
    </Block>)
  }

  renderDepot = () => {

    return (<Block row>
      <Block style={{width: width/2,  paddingVertical: 5, paddingHorizontal: 10}}>
      <Text style={{
                  color: '#2C4453',
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-BoldLegacy',
                  zIndex: 2
                }}
              >
                Depot
                  </Text>
      </Block>
      <Block style={{width: width/2,  paddingVertical: 5, paddingHorizontal: 10, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <Text style={{
                  color: '#2C4453',
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-BoldLegacy',
                  zIndex: 2
                }}
              >
                {this.state.Order.depotName}
                  </Text>
      </Block>
    </Block>)
  }

  renderButtons =() => {
    return ( <Block width={width} center>
    {(!this.state.ipman) ? (
    <GaButton
        shadowless
        style={styles.Xbutton}
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
        style={styles.Xbutton}
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
        style={styles.Xbutton}
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
  }
  renderModal = () => {

    const {currentState, LGAs} = this.state;

      return (<Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            if(this.state.currentState > 0){
              this.setState({currentState: this.state.currentState - 1})
              }else{
                this.setModalVisible(false)
              }
          }}>
          <Block  flex center style={{backgroundColor: '#FAFAFA', paddingTop: iPhoneX() ? theme.SIZES.BASE * 3.5 : theme.SIZES.BASE }}>
            <Block row space='between' style={{width: width, padding: 10, alignItems:'center', marginBottom: 20, borderBottomColor: '#1D1D1D24', borderBottomWidth: 1}}>
              <Text style={{ fontFamily: 'HKGrotesk-Bold', fontSize: 20 }}>Program Truck</Text>
              <Icon
                name={'x'}
                family="octicon"
                size={20}
                onPress={() => this.setModalVisible(false)}
                color={nowTheme.COLORS.ICON}
              />
            </Block>
            <Block  width={width * 0.9} style={{ padding: 2 }}>
              <Block>
              { (currentState == 0) ?
              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                            <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>Please Enter Your Truck Number</Text>
                            <Input
                                placeholder="Enter Truck Number"
                                color="black"
                                style={styles.inputs}
                                value={this.state.TruckNo}
                                onChangeText={(text) => {
                                  this.setState({TruckNo: text, ifInputupdated: true})
                                  }
                                }
                                noicon
                              />
                            </Block>
              : (currentState == 1) ?
              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
              <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>Please enter Destination details</Text>  
                            <Input
                                placeholder="Enter Street Name"
                                color="black"
                                style={styles.inputs}
                                value={this.state.Destination}
                                onChangeText={(text) => {
                                  this.setState({Destination: text, ifInputupdated: (this.state.State && this.state.LGA)})
                                }}
                                multiline={true}
                                numberOfLines={3}
                                noicon
                              />
                             <Block style={styles.picker}>
                              <ModalSelector
                                  data={this.state.StateX}
                                  initValue='Select State'
                                  selectStyle={styles.selectStyle}
                                  selectTextStyle={styles.selectTextStyle}
                                  initValueTextStyle={styles.initvalueTextStyle}
                                  onChange={(itemValue) => this.setStates(itemValue)} />
                              </Block>
                              <Block style={styles.picker}>
                              <ModalSelector
                                  data={this.state.LGAs }
                                  initValue='Select LGA'
                                  selectStyle={styles.selectStyle}
                                  selectTextStyle={styles.selectTextStyle}
                                  initValueTextStyle={styles.initvalueTextStyle}
                                  onChange={(itemValue) => this.setLGA(itemValue)} />
                              </Block>
                              
                            </Block>
              :                 
              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
  <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>Quantity to Load</Text>
  <Block style={{marginTop: 5}} visible={!this.state.isQuantitySet}>
      {(this.state.Order.quantity >= 33000) ? (<Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.WHITE}
                  onPress={() => this.setQuantity(33000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    33,000
                  </Text>
      </Button>) : <Block /> }
      {(this.state.Order.quantity >= 40000) ? ( <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.WHITE}
                  onPress={() => this.setQuantity(40000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    40,000
                  </Text>
                </Button>) : <Block /> }
                {(this.state.Order.quantity >= 45000) ? ( <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.WHITE}
                  onPress={() => this.setQuantity(45000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    45,000
                  </Text>
                </Button>) : <Block /> }
                {(this.state.Order.quantity >= 60000) ? ( <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.WHITE}
                  onPress={() => this.setQuantity(60000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    60,000
                  </Text>
                </Button>) : <Block /> }
                {(this.state.Order.quantity >= 90000) ? ( <Button
                  shadowless style={styles.nobutton}
                  color={nowTheme.COLORS.WHITE}
                  onPress={() => this.setQuantity(90000)}
                >
                  <Text
                    style={{ fontFamily: 'HKGrotesk-BoldLegacy', fontSize: 16 }}
                    color={nowTheme.COLORS.WHITE}
                  >
                    90,000
                  </Text>
                </Button>) : <Block /> }
        </Block>
        <Block visible={this.state.isQuantitySet} style={{marginTop: 10}}>
        <Input
                    placeholder="Quantity"
                    color="black"
                    style={styles.Qtyinputs}
                    value={this.state.Quantity}
                    onChangeText={(text) => {
                      this.setState({Quantity: text, ifInputupdated: true})
                    }}
                    keyboardType="numeric"
                    noicon
                    editable = {false}
                  />

                  <TouchableHighlight onPress={() => this.setState({isQuantitySet: false})}>
                  <Text
                                      style={{ fontFamily: 'HKGrotesk-Medium', fontSize: 10 }}
                                      color={theme.COLORS.WHITE}
                                  >
                                      Change quantity
                                  </Text>
                  </TouchableHighlight>
          </Block>
                </Block>
  }
              <Block style={{marginBottom:  10}}></Block>
                            
              </Block>
              
            </Block>
          </Block>
          <Block width={width * 0.7} center style={{position: 'absolute', bottom: 50}}>
                            { (currentState >= 0 && currentState < 2) ?
                            <GaButton
                                  shadowless
                                  style={styles.button}
                                  color={nowTheme.COLORS.PRIMARY}
                                  onPress={() => this.Next()}
                              >
                                  <Text
                                      style={{ fontFamily: 'HKGrotesk-Medium', fontSize: 14 }}
                                      color={theme.COLORS.WHITE}
                                  >
                                      Next
                                  </Text>
                            </GaButton> : (currentState >= 2) ?
                              <GaButton
                                  shadowless
                                  style={styles.button}
                                  color={nowTheme.COLORS.PRIMARY}
                                  onPress={() => this.AddProgram()}
                              >
                                  <Text
                                      style={{ fontFamily: 'HKGrotesk-Medium', fontSize: 14 }}
                                      color={theme.COLORS.WHITE}
                                  >
                                      Confirm
                                  </Text>
                              </GaButton>
                            : <Block />}
                            </Block>
              
        </Modal>);
  }
  render () {
    const {remainQuantity} = this.state;
      return (<Block flex style={{width: width, backgroundColor: '#FAFAFA'}}>
          <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
              />
          {this.renderFeatures()}
          {this.state.Order != null ? this.renderDepot() : (<Block />)}
          {this.state.Credit != null ? this.renderCredit() : (this.state.userno != null) ? this.renderButtons() : (<Block />)}
          
          {this.state.Order != null ? this.renderPrograms() : (<Block />)}
          {this.renderModal()}
          {this.renderPaymentModal()}
          <Block row style={{zIndex: 3, position: 'absolute', top: '90%', right: '5%'}}>
        {(this.state.isNew && this.state.Credit == null && this.state.Order == null) ?
        <Block />
          : ((this.state.Order.quantity > (this.state.programs.length > 0 ? this.state.programs.map(o=>o.quantity).reduce((a,c)=>a+c): 0)) && this.state.Credit != null) ?
        <FloatingActionButton
          iconName="plus"
          size={56}
          iconType="AntDesign"
          textDisable
          backgroundColor={nowTheme.COLORS.BACKGROUND}
          rippleColor={nowTheme.COLORS.WHITE}
          iconColor={nowTheme.COLORS.WHITE}
          onPress = {() => this.setModalVisible(true)}
        /> :  <Block /> }
        
             </Block> 
      </Block>)
    }
}

const styles = StyleSheet.create({
  inputs: {
    borderWidth: 1,
    borderColor: '#1917181F',
    borderRadius: 0,
    height: 40
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
  picker: {
    borderWidth: 1,
    borderColor: '#1917181F',
    borderRadius: 0,
    height: 45,
    marginBottom: 10
  },
  dropdownpicker: {
    borderWidth: 1,
    borderColor: '#1917181F',
    borderRadius: 0,
    height: 45,
    marginBottom: 10
  },
  initvalueTextStyle: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 16,
    color: '#191718',
    justifyContent: 'center',  
  },
  selectTextStyle: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 16,
    color: '#191718',  
  },
  selectStyle: {
    borderWidth: 0,
    justifyContent: 'center',  
  },
  product: {
    height: 40,
    marginBottom: 5, 
    paddingHorizontal: 20, 
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: '#E3E2E3', 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center'
  },
  datepicker: {
    borderWidth: 1,
    borderColor: '#1917181F',
    borderRadius: 0,
    height: 45,
    marginBottom: 10
  },
  cardinputs: {
    borderWidth: 1,
    borderColor: '#1917181F',
    borderRadius: 0,
    backgroundColor: '#ffffff'
  },
  nobutton: {
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
      button: {
        width: (width * 0.7),
        height: 40,
        shadowRadius: 0,
        shadowOpacity: 0,
        margin: 2
      },
      Xbutton: {
        width: (width * 0.95),
        height: 40,
        shadowRadius: 0,
        shadowOpacity: 0,
        margin: 2
      },
      increbutton: {
        width: 101.1,
        height: 40,
        shadowRadius: 0,
        shadowOpacity: 0,
        borderRadius: 0,
        marginVertical: theme.SIZES.BASE / 2
      }
})
export default OrderDetail