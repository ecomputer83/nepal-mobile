import React from 'react';
import { Block, Text, theme, Button } from 'galio-framework';
import { nowTheme } from '../constants';
import { Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('screen');
export default class OrderCard extends React.Component {

    render(){
        const {
            item,
            bgColor,
            Navigation,
            ...props
          } = this.props;
            let ProductColor = '#437FB4';
            let StatusColor = '#417505';

            switch(item.ProductName){
              case 'PMS':
                ProductColor = '#437FB4';
                break;
              case 'AGO':
                ProductColor = '#303E4F';
                break;
              case 'LPG':
                ProductColor = '#909090';
                break;
              case 'ATK':
                ProductColor = '#000000';
                break;
              case 'DPK':
                productColor = '#B3D2B2';
                break;

            }

            switch(item.Status){
              case 'Confirmed':
                StatusColor = '#417505';
                break;
              case 'Unconfirmed':
                StatusColor = '#E35063';
                break;
            }
            const BlackColor = nowTheme.COLORS.BLACK;
          return ( 
              <Block style={{width: width, marginBottom: 1}}>
                <Block row>
                  <Block style={{width: 41, height: 100, backgroundColor: ProductColor, alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                      style={{ fontFamily: 'HKGrotesk-BoldLegacy', paddingBottom: 15 }}
                      size={14}
                      color='#ffffff'>
                    {item.ProductName}
                    </Text>
                  </Block>
                  <Block style={{width: width - 41}}>
                <Block row space='between' style={{marginLeft: 10, marginTop: 10, marginRight: 15}}>
                  <Block>
                  <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', color: '#B4B4B4' }} size={10}>
                    Order no:
                  </Text>
                  <Text style={{
                  color: '#2C4453',
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-BoldLegacy',
                  zIndex: 2
                }}
              >
                {item.OrderId}
                  </Text>
                  </Block>
                  <Block style={{alignItems: 'center', justifycentent: 'center'}}>
                    <Text
                style={{
                  color: BlackColor,
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-BoldLegacy',
                }}
              >
                 ₦{item.Price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  </Text>
                </Block>
                </Block>
                <Block row space='between' style={{marginLeft: 10, marginTop: 10, marginRight: 15}}>
                  <Block>
                  <Text style={{ fontFamily: 'HKGrotesk-SemiBoldLegacy', color: '#B4B4B4' }} size={10}>
                    Order date:
                  </Text>
                  <Text style={{
                  color: '#2C4453',
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-BoldLegacy',
                  zIndex: 2
                }}
              >
                {item.DepositDate}
                  </Text>
                  </Block>
                  <Block style={{width: 85, height: 22, borderRadius: 5, backgroundColor: StatusColor, alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontFamily: 'HKGrotesk-SemiBoldLegacy',
                }}
              >
                {item.Status}
                  </Text>
                </Block>
                </Block></Block>
            </Block>
            
          </Block>)
    }
}