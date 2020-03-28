import React from 'react';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import { nowTheme } from '../constants';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('screen');
export default class PriceCard extends React.Component {

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
              <Block row flex style={{width:width, padding:10}}>
            <Block style={{width:(width - 30) * 0.5}}>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 20,
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
                  fontSize: 22,
                  fontWeight: 'bold',
                  fontFamily: 'montserrat-bold',
                  marginTop: 5,
                  marginBottom: 5,
                  zIndex: 2
                }}
              >
                ₦{Value}
                  </Text>
            </Block>
          </Block>)
    }
}