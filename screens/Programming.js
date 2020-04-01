import React, { Profiler } from 'react';
import { Modal, StyleSheet, TouchableHighlight, Dimensions, FlatList, Alert, ScrollView , Picker } from 'react-native';
import { Block, theme,Button as GaButton, Text } from "galio-framework";
import { Input, Icon, DetailCard, FeatureCard } from '../components';
import FloatingActionButton from "react-native-floating-action-button";
import { prod, ST, nowTheme } from '../constants';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get("screen");
class Programming extends React.Component {

    state = {
        totalquantity: 0,
        remainQuantity: 0,
        programs: [],
        TruckNo: null,
        Quantity: "33000",
        Destination: null,
        State: null,
        LGA: null,
        modalVisible: false,
        spinner: false,
        currentState: 0,
        isNew: false,
        ifInputupdated: false,
        LGAs: []
    }

    constructor(props) {
      super(props);
      const Params = props.navigation.state.params
      console.log(Params)
      if(Params == null){


      this.state = {
          totalquantity: prod.Orders.map(o=>o.Quantity).reduce((a,c)=>a+c),
          remainQuantity: 0,
          programs: this.getPrograms(),
          TruckNo: null,
        Quantity: "0",
      Destination: null,
      State: null,
      LGA: null,
      modalVisible: false,
      spinner: false,
      currentState: 0,
      isNew: false,
      ifInputupdated: false,
      LGAs: []
      }
    }else{
      this.state = {
        totalquantity: Params.quantity,
        remainQuantity: Params.quantity,
        programs: [],
        TruckNo: null,
        Quantity: "0",
      Destination: null,
      State: null,
      LGA: null,
      modalVisible: false,
      spinner: false,
      currentState: 1,
      ifInputupdated: false,
      LGAs: [],
      isNew: Params.isNew
    }
    }
    }
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }
    setIncrease(){
      var quantity = parseInt(this.state.Quantity) + 1000
      this.setState({Quantity: quantity.toString(), ifInputupdated: true})
    }

    setDecrease(){
      var quantity = parseInt(this.state.Quantity) - 1000
      this.setState({Quantity: quantity.toString(), ifInputupdated: true})
    }

    setStates(v){
      var LGAs = ST.LGA.filter(c=>c.stateIndex == v.index);
      this.setState({LGAs: LGAs, State: v, ifInputupdated: (this.state.LGA && this.state.Destination)})
    }

    setLGA(v){
      this.setState({LGA: v, ifInputupdated: (this.state.State && this.state.Destination)})
    }

    Next(){
      var currentState = this.state.currentState + 1
      this.setState({currentState: currentState, ifInputupdated: false})
    }

    getPrograms(){
      let results = [];
      for (let c = 0; c<prod.Orders.length; c++) {
        results.concat(prod.Orders[c].Programing);
      }

      return prod.Orders[0].Programing
    }
  
    AddProgram = () => {
      let obj = {
          TruckNo: this.state.TruckNo,
          Quantity: parseInt(this.state.Quantity),
          Destination: this.state.Destination + ', ' + this.state.LGA.Name + ', ' + this.state.State.Name,
          Status: 'New'
      };
      console.log(obj)
      let programs = this.state.programs;
      let remainQuantity = this.state.remainQuantity;
      if(programs.length > 0){
      let existingIndex = programs.findIndex(c=>c.TruckNo == obj.TruckNo);
      if(existingIndex > -1){
              remainQuantity += programs[existingIndex].Quantity;
              programs[existingIndex].Quantity = obj.Quantity;
              programs[existingIndex].Destination = obj.Destination;
              remainQuantity -= obj.Quantity;
          
      }else{
          if(remainQuantity >= obj.Quantity){
              programs.push(obj)
          }else{
              Alert.alert("Oops!", "Input quantity is beyond the remain quantity, remain quantity is "+ remainQuantity)
              return;
          }
          remainQuantity -= obj.Quantity
          var state = 0;
          if(this.state.isNew){
            state = 1
          }
          this.setState({programs: programs, remainQuantity: remainQuantity, TruckNo: null, Quantity: remainQuantity.toString(), Destination: null, currentState: state});
      }
      }else{

          if(remainQuantity >= obj.Quantity){
              programs.push(obj)
          }else{
              Alert.alert("Oops!", "Input quantity is beyond the remain quantity, remain quantity is "+ remainQuantity)
              return;
          }
          remainQuantity -= obj.Quantity
          var state = 0;
          if(this.state.isNew){
            state = 1
          }
          this.setState({programs: programs, remainQuantity: remainQuantity,TruckNo: null, Quantity: remainQuantity.toString(), Destination: null, currentState: state});
      }
      this.setModalVisible(false);
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
            this.props.navigation.navigate('Home')
          }, 3000);
        
    };
    }

  renderFeatures = () => {
    return (
      <Block>
        <Text size={10} style={{fontFamily: 'HKGrotesk-SemiBoldLegacy', lineHeight: 14, color: '#919191', margin: 10}}>My Trucks</Text>
      <ScrollView horizontal={true}>
        {this.renderFeature()}
      </ScrollView>
      </Block>
    )
  }

  renderFeature = () => {
    return this.state.programs.map((v,i) => {
      let index = i++
      return (<FeatureCard item={v} index={index} />)
    })
  }

  renderOrders =() => {
    return prod.Orders.filter(c=> c.Quantity > ((c.Programing.length > 0) ? c.Programing.map(o=>o.Quantity).reduce((a,c)=>a+c) : 0)).map((v, i) => {
      var remainquantity = v.Quantity - ((v.Programing.length > 0) ? v.Programing.map(o=>o.Quantity).reduce((a,c)=>a+c) : 0)
      return (<TouchableHighlight onPress={() => this.setOrder(v, remainquantity)}>
              <Block width={width * 0.9} row space='between' style={styles.product}>
                  <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', fontSize: 16 }}>{v.OrderId}</Text>
                  <Text style={{ fontFamily: 'HKGrotesk-MediumLegacy', fontSize: 16, color: '#AAAAAA' }}>{remainquantity}</Text>
              </Block>
          </TouchableHighlight>)
    })
  }
  renderPrograms = () => {
      let index = 0;
      return (<Block style={{ zIndex: 1, margin: 10 }}>
        <Text size={10} style={{fontFamily: 'HKGrotesk-SemiBoldLegacy', lineHeight: 14, color: '#919191', marginBottom: 10}}>General Program</Text>
      <FlatList data={this.state.programs} keyExtractor={(item, index )=> index.toString()} extraData={this.state} ListHeaderComponent={null} renderItem={({item}) => {
        index++
        return <DetailCard item={item} index={index} />
      }}/></Block>)
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
          <Block  flex center style={{backgroundColor: '#FAFAFA'}}>
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
              <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>What Order Do you want to load?</Text>  
                    {this.renderOrders()}
                              
                            </Block>
              : (currentState == 1) ?
              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                            <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>Please Enter Your Truck Number</Text>
                            <Input
                                placeholder="Enter Truck Number"
                                color="black"
                                style={styles.inputs}
                                value={this.state.TruckNo}
                                onChangeText={(text) => {
                                  if(text.length >= 7){
                                  var program = this.state.programs.find(c=>c.TruckNo == text)
                                  if(program != null){
                                      this.setState({TruckNo: text, Quantity: program.Quantity.toString(), Destination: program.Destination, ifInputupdated: true})
                                  }else{
                                  this.setState({TruckNo: text, ifInputupdated: true})
                                  }
                                }
                                }}
                                noicon
                              />
                            </Block>
              : (currentState == 2) ?
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
                              <Picker
                                  selectedValue={this.state.State }
                                  style={styles.pickerStyle}
                                  onValueChange={(itemValue, itemIndex) => this.setStates(itemValue)}>
                                      <Picker.Item label='-- Select State --' value={null} />
                                      {ST.States.map( (v)=>{
                                      return <Picker.Item label={v.Name} value={v}  />
                                      })}
                              </Picker>
                              </Block>
                              <Block style={styles.picker}>
                              <Picker
                                  selectedValue={this.state.LGA }
                                  style={styles.pickerStyle}
                                  onValueChange={(itemValue, itemIndex) => this.setLGA(itemValue)}>
                                      <Picker.Item label='-- Select LGA --' value={null} />
                                      {LGAs.map( (v)=>{
                                      return <Picker.Item label={v.Name} value={v}  />
                                      })}
                              </Picker>
                              </Block>
                              
                            </Block>
              :                 
              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
  <Text style={{fontSize: 16, lineHeight: 40, fontFamily: 'HKGrotesk-Bold'}}>Quantity to Load</Text>
      <Block row>
      <GaButton
                      shadowless
                      style={styles.increbutton}
                      color='#23C9F1'
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
                    value={this.state.Quantity}
                    onChangeText={(text) => {
                      this.setState({Quantity: text})
                    }}
                    keyboardType="numeric"
                    noicon
                  />

<GaButton
                      shadowless
                      style={styles.increbutton}
                      color='#23C9F135'
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
  }
              <Block style={{marginBottom:  10}}></Block>
                            <Block width={width * 0.7} center style={{position: 'absolute', bottom: 50}}>
                            { (currentState > 0 && currentState < 3) ?
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
                            </GaButton> : (currentState >= 3) ?
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
              
              </Block>
              
            </Block>
          </Block>
        </Modal>);
  }
  render () {
    const {remainQuantity} = this.state;
      return (<Block style={{width: width, height: height, backgroundColor: '#FAFAFA'}}>
          <Spinner
                visible={this.state.spinner}
                textContent={'Saving...'}
                textStyle={styles.spinnerTextStyle}
              />
          {this.renderFeatures()}
          {this.renderPrograms()}
          {this.renderModal()}
          <Block row style={{zIndex: 3, position: 'absolute', top: 500, right: '5%'}}>
        {(this.state.isNew && this.state.remainQuantity == 0) ?
        <block />
          :
        <FloatingActionButton
          iconName="plus"
          iconType="AntDesign"
          textDisable
          backgroundColor={nowTheme.COLORS.BACKGROUND}
          rippleColor={nowTheme.COLORS.WHITE}
          iconColor={nowTheme.COLORS.WHITE}
          onPress = {() => this.setModalVisible(true)}
        /> }
        {(this.state.programs.length != 0 && this.state.isNew) ?
        <FloatingActionButton
          iconName="check"
          iconType="AntDesign"
          textDisable
          backgroundColor={nowTheme.COLORS.BACKGROUND}
          rippleColor={nowTheme.COLORS.WHITE}
          iconColor={nowTheme.COLORS.WHITE}
          
          onPress = {() => this.saveandnavigate()}
        /> : <Block />} 
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
    paddingVertical: 0,
    width: (width * 0.9) - 202,
    height: 40
  },
  picker: {
    borderWidth: 1,
    borderColor: '#1917181F',
    borderRadius: 0,
    height: 45,
    marginBottom: 10
  },
  pickerStyle: {
    fontFamily: 'HKGrotesk-Regular',
    fontSize: 16,
    color: '#191718',
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
      button: {
        width: (width * 0.7),
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
export default Programming