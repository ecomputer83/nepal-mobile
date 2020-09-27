import React from 'react';
import { StyleSheet,  Dimensions, Image, Alert, FlatList, ScrollView  } from 'react-native';
import { Block, theme,Button, Text } from "galio-framework";
import { BarChart } from 'react-native-chart-kit'
import { prod, Images, nowTheme } from '../constants';
import Spinner from 'react-native-loading-spinner-overlay';
import HttpService from '../services/HttpService';
import { AsyncStorage } from 'react-native';
const { width } = Dimensions.get("screen");
const chartConfigs = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
  };
class Insight extends React.Component {
    
    state = {
        Code: null,
        Marketers: [],
        Data: {
            labels: ["Confirmed Order", "Unconfirmed Order"],
            datasets: [
              {
                data: [0, 0]
              }
            ]
          }
    }
    componentDidMount(){
        AsyncStorage.getItem('userToken').then(token => {
            HttpService.GetAsync('api/order', token).then(resp => resp.json()
              .then(_value => {
                var chart = {
                    labels: ["Confirmed Order", "Unconfirmed Order"],
                    datasets: [
                      {
                        data: [_value.filter(c=>c.status == 1).length, _value.filter(c=>c.status == 0).length]
                      }
                    ]
                  }
              this.setState({Data: chart});
              }))

              HttpService.GetAsync('api/misc/marketer', token).then(resp => {
                  if(resp.status == 200){
                  resp.json()
              .then(_value => {
              this.setState({Code: _value.code, Marketers: _value.marketerCustomers});
              })
            }
            })
          })
    }
    renderChildFilter = () => {
        return this.state.Filters.map((v,i) => {
            let Background = (v.Status == 1) ? '#FFFFFF': '';
            return(<Block style={{ backgroundColor: Background, width: 115, borderRadius: 10, height: 26, alignItems: 'center', justifyContent: 'center'}}>
                <Text size={12} style={{color: '#2C4453', lineHeight: 12, fontFamily: 'HKGrotesk-Medium'}}>
                    {v.Name}
                </Text>
            </Block>)
        })
    };
    renderTableHeader = () => {
        return(
            <Block row style={{paddingLeft: 10, paddingRight: 23, height: 36}}> 
                <Block style={{width: 40, alignItems: 'center', justifyContent: 'center'}}>
                    <Text size={10} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 14, color: '#919191'}}>#</Text>
                </Block>
                <Block row space='between' style={{ width: width-123, alignItems: 'center'}}>
                    <Text size={10} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 14, color: '#919191'}}>My Customers</Text>
                    <Text size={10} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 14, color: '#919191'}}>Order Qty (MTD)</Text>
                </Block>
            </Block>
        )
    }

    renderTableCell = (item, index) => {
        return(
        <Block row style={{paddingLeft: 10, paddingRight: 23, height: 36, borderTopWidth: 1, borderTopColor: '#97979780'}}> 
            <Block style={{width: 40, alignItems: 'center', justifyContent: 'center'}}>
                <Text size={10} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 14, color: '#919191'}}>{index}</Text>
            </Block>
            <Block row space='between' style={{ width: width-123, alignItems: 'center'}}>
                <Text size={12} style={{fontFamily: 'HKGrotesk-SemiBold', lineHeight: 16}}>{item.customerName}</Text>
                <Text size={12} style={{fontFamily: 'HKGrotesk-SemiBold', lineHeight: 16}}>{item.orderQty.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
            </Block>
        </Block>
        )
    }
        
    renderTable = () => {
        let index = 0;
        return (
            <Block style={{margin: 10, padding: 4, backgroundColor: '#FFFFFF', borderRadius: 5, borderWidth: 1, borderColor: '#97979780', width: width-20}}>
                <Block style={{paddingLeft: 10}}>
                    <Text size={12} style={{fontFamily: 'HKGrotesk-SemiBold', lineHeight: 16}}>Marketer's Performance</Text>
                    <Text size={10} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 14}}>Marketer's code</Text>
                    <Text size={20} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 24}}>{this.state.Code}</Text>
                </Block>
                <Block>
                { this.renderTableHeader()

                }
                <FlatList data={this.state.Marketers} keyExtractor={(item, index )=> index.toString()} extraData={this.state} ListHeaderComponent={null} renderItem={({item}) => {
                            index++
                            return (this.renderTableCell(item, index))
                        }}/>
                </Block>
            </Block>
        )
    }

    render () {
        const graphStyle = {
            marginVertical: 8,
            ...chartConfigs.style
          }
        return (
            <ScrollView>
            <Block center>
            
                <Spinner
                  visible={this.state.spinner}
                  textContent={'Searching...'}
                  textStyle={styles.spinnerTextStyle}
                />

                    <Block space="between">
                        <Block>
                            {(this.state.Code != null) ? this.renderTable() : (<Block />)}
                        </Block>
                        <Block style={{margin: 12, padding: 4}}>
                        <BarChart
                            width={width-40}
                            height={200}
                            data={this.state.Data}
                            fromZero={true}
                            chartConfig={chartConfigs}
                            style={graphStyle}
                        />
                        </Block>
                    </Block>
            </Block>
            </ScrollView>
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
        borderColor: nowTheme.COLORS.BORDER,
        
      },

      searchbutton: {
        width: (width  * 0.2),
        height: nowTheme.SIZES.BASE * 3,
        shadowRadius: 0,
        shadowOpacity: 0
      }
    
});

export default Insight