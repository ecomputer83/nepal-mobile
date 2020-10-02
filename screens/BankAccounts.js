import React, { Profiler } from 'react';
import { Modal, StyleSheet, TouchableHighlight, Dimensions, FlatList, Alert, ScrollView , Picker } from 'react-native';
import { Block, theme,Button as GaButton, Button, Text } from "galio-framework";
import HttpService from '../services/HttpService';
import { AsyncStorage } from 'react-native';
const { width, height } = Dimensions.get("screen");
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);
class BankAccount extends React.Component {

    state = {
        Banks: []
    }
    constructor(props) {
        super(props);
        const Params = props.navigation.state.params

        state = {
            Banks: Params.Banks
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('userToken').then( value => {
            this.setState({ token: value})
            HttpService.GetAsync('api/misc/banks', value).then(response => {
              response.json().then(art => {
                var banks = art.map((d, i) => {
                  return { key: d.no, label: d.name + ' - ' + d.bankAccountNo}
                });
                this.setState({ Banks: banks});
              })
            })
          })
    }

    render(){

        return (<Block style={{width: width, height: height, backgroundColor: '#FAFAFA'}}>
            <Text size={14} style={{fontFamily: 'HKGrotesk-SemiBoldLegacy', lineHeight: 16,  marginBottom: 10}}>NOTE: After payment, kindly go to Orders tab, select the order and submit bank deposit information</Text>
            <FlatList data={this.state.Banks} keyExtractor={(item, index )=> index.toString()} extraData={this.state} ListHeaderComponent={null} renderItem={({item}) => {
        return <Text size={14} style={{fontFamily: 'HKGrotesk-SemiBoldLegacy', lineHeight: 18, padding: 5}}>{item.label}</Text>
      }}/>
        </Block>)
    }
}


export default BankAccount;