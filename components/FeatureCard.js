import React from 'react';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import { nowTheme, Images } from '../constants';
import { Dimensions, StyleSheet, ImageBackground, TouchableWithoutFeedback } from 'react-native';

const { width } = Dimensions.get('screen');
export default class FeatureCard extends React.Component {

    render(){
        const {
            item,
            index,
            bgColor,
            Navigation,
            ...props
          } = this.props;
            const PrimaryColor = nowTheme.COLORS.PRIMARY;
            const BlackColor = nowTheme.COLORS.WHITE;
          return ( 
            <TouchableWithoutFeedback onPress={() => (Navigation) ? Navigation.navigate('ProgramDetail', { Program: item }): {}}>
            <ImageBackground source={Images.ProgramCard} style={{width: 315, height: 105, margin: 10,padding: 15}}>
                <Block>
            <Block row space='between' style={{width:285}}>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 16,
                  fontFamily: 'HKGrotesk-SemiBoldLegacy'
                }}
              >
                {item.truckNo}
                  </Text>
            <Text
                style={{
                  color: '#C4F4FF',
                  fontSize: 16,
                  fontFamily: 'HKGrotesk-SemiBoldLegacy'
                }}
              >
                #{index}
                  </Text>
            </Block>
            <Block row space='between' style={{width:260, marginTop: 5}}>
            <Text size={10} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 14, color: '#C4F4FF'}}>Destination</Text>
            <Text size={10} style={{fontFamily: 'HKGrotesk-Regular', lineHeight: 14, color: '#C4F4FF'}}>Quantity</Text>
            </Block>
            <Block row space='between' style={{width:295, paddingTop: 5}}>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-SemiBoldLegacy',
                }}
              >
                {item.destination.substring(0, 24)}
                  </Text>
            <Text
                style={{
                  color: BlackColor,
                  fontSize: 14,
                  fontFamily: 'HKGrotesk-SemiBoldLegacy',
                }}
              >
                {item.quantity.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} Litres
                  </Text>
                </Block>
                  </Block>
          </ImageBackground>
          </TouchableWithoutFeedback>)
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