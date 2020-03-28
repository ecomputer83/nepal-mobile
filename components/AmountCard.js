import React from 'react';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import { nowTheme } from '../constants';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('screen');
export default class AmountCard extends React.Component {

    render(){
        const {
            Key,
            Value,
            bgColor,
            ...props
          } = this.props;
            const PrimaryColor = nowTheme.COLORS.PRIMARY;
            const BlackColor = nowTheme.COLORS.BLACK;
          return ( 
              <Block row flex style={{width:(width - 20), padding:10, borderBottomWidth: 1,
                borderBottomColor: '#E3E3E3',
            }}>
            <Block style={{width:(width - 30) * 0.5}}>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 16,
                  fontFamily: 'montserrat-bold',
                  marginTop: 5,
                  marginBottom: 5,
                  zIndex: 2
                }}
              >
                {Key}
                  </Text>
            </Block>
            <Block style={{width: (width - 30) * 0.5, alignItems:'flex-end'}}>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 18,
                  fontWeight: 'bold',
                  fontFamily: 'montserrat-bold',
                  marginTop: 5,
                  marginBottom: 5,
                  zIndex: 2
                }}
              >
                ₦{Value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  </Text>
            </Block>
          </Block>)
    }
}