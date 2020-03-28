import React from 'react';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import { nowTheme } from '../constants';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('screen');
export default class DetailCard extends React.Component {

    render(){
        const {
            item,
            index,
            bgColor,
            ...props
          } = this.props;
            const PrimaryColor = nowTheme.COLORS.PRIMARY;
            const BlackColor = nowTheme.COLORS.BLACK;
          return ( 
              <Block flex style={styles.shadow, {width:(width - 20), padding:10, marginBottom:10, backgroundColor: '#ffffff'
            }}>
                <Block>
            <Block row space='between' style={{width:(width - 10) * 0.9}}>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 16,
                  fontFamily: 'HKGrotesk-SemiBoldLegacy'
                }}
              >
                {item.TruckNo}
                  </Text>
            <Text
                style={{
                  color: '#B4B4B4',
                  fontSize: 16,
                  fontFamily: 'HKGrotesk-SemiBoldLegacy'
                }}
              >
                #{index}
                  </Text>
            </Block>
            <Block row space='between' style={{width: (width - 10) * 0.8, marginTop: 15}}>
            <Text size={10} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 14, color: '#919191'}}>Destination</Text>
            <Text size={10} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 14, color: '#919191'}}>Quantity</Text>
            </Block>
            <Block row space='between' style={{width:(width - 10) * 0.9}}>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-SemiBoldLegacy',
                }}
              >
                {item.Destination.substring(0, 24)}
                  </Text>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-SemiBoldLegacy',
                }}
              >
                {item.Quantity} Litres
                  </Text>
                </Block>
                  </Block>
          </Block>)
    }
}

const styles = StyleSheet.create({
shadow: {
  shadowColor: '#8898AA',
  shadowOffset: { width: 0, height: 1 },
  shadowRadius: 6,
  shadowOpacity: 0.1,
  elevation: 2
}
})