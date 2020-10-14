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
import Timeline from 'react-native-timeline-flatlist'
import NaijaStates from 'naija-state-local-government';
import { AsyncStorage } from 'react-native';
const { width, height } = Dimensions.get("screen");
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);
class ProgramDetail extends React.Component {

  state = {
    Program: null,
    status: [],
    token: null,
}

constructor(props) {
  super(props);
  const Params = props.navigation.state.params
  this.renderDetail = this.renderDetail.bind(this)
  this.state = {
    Program: (Params.Program) ? Params.Program : null,
    status: [],
  token: null,

}
}
componentDidMount(){
  this.setState({spinner: true})
  AsyncStorage.getItem('userToken').then(token => {
    HttpService.GetAsync('api/program/'+this.state.Program.id, token)
    .then(response => response.json().then(value => {
      console.log(value)
      
      var status = this.state.status;
      status.push({time: '14:00', title: 'Programmed', description: value.programDate, adddescription: '', lineColor:'rgb(45,156,219)', circleColor:'rgb(45,156,219)'});
      status.push({time: '14:00', title: 'Loading Ticket Ready', description: value.loadingDate, adddescription: value.loadingTicketNo ? 'Ticket No: '+value.loadingTicketNo: '', lineColor:value.loadingTicketNo ? 'rgb(45,156,219)': '#dedede', circleColor:value.loadingTicketNo ? 'rgb(45,156,219)': '#dedede'});
      status.push({time: '14:00', title: 'Dispatched', description: value.dispatchDate, adddescription: '', lineColor:value.quantityShipped ? 'rgb(45,156,219)': '#dedede', circleColor:value.quantityShipped ? 'rgb(45,156,219)': '#dedede'});
      status.push({time: '14:00', title: 'Waybill Generated', description: value.waybillDate, adddescription: value.waybillNo ? 'Waybill No: '+value.waybillNo: '', lineColor:value.quantityInvoiced ? 'rgb(45,156,219)': '#dedede', circleColor:value.quantityInvoiced ? 'rgb(45,156,219)': '#dedede'});
      this.setState({Program: value, status: status, token: token, spinner: false});
    }

    ))
  })
  
}

renderDetail(rowData, sectionID, rowID) {
  console.log(rowData)
  let title = <Text style={[styles.title]}>{rowData.title}</Text>
  var desc = null
  if(rowData.description || rowData.adddescription)
    desc = (
      <Block style={styles.descriptionContainer}>   
        <Text style={[styles.textDescription]}>{rowData.description}</Text>
        <Text style={[styles.textDescription]}>{rowData.adddescription}</Text>
      </Block>
    )

  return (
    <Block style={{flex:1}}>
      {title}
      {desc}
    </Block>
  )
}

renderOption = (label, value) => {

  return (<Block row>
    <Block style={{width: width/2,  paddingVertical: 5, paddingHorizontal: 10}}>
    <Text style={{
                color: '#2C4453',
                fontSize: 14,
                fontFamily: 'HKGrotesk-BoldLegacy',
                zIndex: 2
              }}
            >
              {label}
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
              {value}
                </Text>
    </Block>
  </Block>)
}
  renderFeatures = () => {
    const BlackColor = nowTheme.COLORS.BLACK;
    console.log(this.state.Program.truckNo)
    return (
      <Block flex={0.3}>
        {this.state.Program != null ?
        (<DetailCard item={this.state.Program} index={1} />) : (<Block />) }
        </Block>
    )
  }

  renderStatus = () => {
    return (
      <Block flex style={{ padding: 10}}>
        
        {this.state.status != null ?
        (<Timeline 
          style={styles.list}
          data={this.state.status}
          circleSize={20}
          circleColor='rgb(45,156,219)'
          lineColor='rgb(45,156,219)'
          showTime={false}
          
          options={{
            style:{paddingTop:0}
          }}
          renderDetail={this.renderDetail}
          innerCircle={'dot'}
        />) : (<Block />) }
        
      </Block>
    )
  }

  
  render () {
    const {remainQuantity} = this.state;
      return (<Block flex style={{width: width, backgroundColor: '#FAFAFA'}}>
          <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
              />
          {this.renderOption("Order Number", this.state.Program.orderNumber)}
          {this.renderOption("Product", this.state.Program.product)}
          {this.renderFeatures()}
          {this.renderStatus()}
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
  list: {
    flex: 1,
    marginTop:5,
  },
  selectStyle: {
    borderWidth: 0,
    justifyContent: 'center',  
  },
  title:{
    fontFamily: 'HKGrotesk-Regular',
    fontSize:16,
    color: '#E37E2E'
  },
  descriptionContainer:{
    paddingRight: 50
  },
  textDescription: {
    fontFamily: 'HKGrotesk-Regular',
    marginLeft: 10,
    color: 'gray'
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
export default ProgramDetail