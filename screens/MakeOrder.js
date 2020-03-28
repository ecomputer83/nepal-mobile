import React from 'react';
import { StyleSheet,  Dimensions, Picker  } from 'react-native';
import { Block, theme,Button as GaButton, Text } from "galio-framework";
import { Input, Icon } from '../components';
import { prod, nowTheme } from '../constants';

const { width } = Dimensions.get("screen");
class MakeOrder extends React.Component {
    state = {
        depot: null,
        product : null,
        quantity: "0",
        unitPrice: null,
        TotalAmount: "0"
    }

    constructor(props) {
        super(props);

      }
    pickerProduct(index){
        prod.DailyPrices.map( (v,i)=>{
         if( index === i ){
           this.setState({
           product: prod.DailyPrices[index],
           unitPrice: prod.DailyPrices[index].Price.toString(),
          })
         }
        })
    }
    pickerDepot(index){
      prod.Depots.map( (v,i)=>{
       if( index === i ){
         this.setState({
         depot: prod.Depots[index]
        })
       }
      })
  }
    saveandnavigate = () => {
        if(this.state.TotalAmount != 0) {
        this.props.navigation.navigate('CardPayment', { product: JSON.stringify(this.state.product), quantity: this.state.quantity, unitPrice: this.state.unitPrice, TotalAmount: this.state.TotalAmount})
    };
}
    render () {
        const {depot, product, quantity, unitPrice, TotalAmount} = this.state
        return (
            <Block flex center>
                <Block flex={1} space="between">
                        <Block center flex={0.9}>
                          <Block flex space="between">
                            <Block>
                            <Block width={width * 0.9} style={{ marginTop: 20 }}>
                                <Text style={{fontSize: 12}}>Depots</Text>
                                <Block style={styles.picker}>
                                <Picker
                                    selectedValue={depot }
                                    onValueChange={(itemValue, itemIndex) => this.pickerDepot(itemIndex)}>
                                        <Picker.Item label='-- Select Depot --' value={null} />
                                        {
                                        prod.Depots.map( (v)=>{
                                        return <Picker.Item label={v.Name} value={v} />
                                        })
                                    }
                                </Picker>
                                </Block>
                              </Block>
                              { (depot != null) ? (
                                <Block>
                              <Block width={width * 0.9} style={{ marginBottom: 5, marginTop: 25 }}>
                                <Text style={{fontSize: 12}}>Products</Text>
                                <Block style={styles.picker}>
                                <Picker
                                    selectedValue={product }
                                    onValueChange={(itemValue, itemIndex) => this.pickerProduct(itemIndex)}>
                                        <Picker.Item label='-- Select Product --' value={null} />
                                        {
                                        prod.DailyPrices.map( (v)=>{
                                        return <Picker.Item label={v.Product} value={v} />
                                        })
                                    }
                                </Picker>
                                </Block>
                              </Block>
                              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                              <Text style={{fontSize: 12}}>Quantity</Text>
                              <Input
                                  placeholder="Quantity"
                                  color="black"
                                  style={styles.inputs}
                                  value={quantity}
                                  onChangeText={(text) => {
                                    if(text != null || text != ''){
                                    var _quantity = parseInt(text);
                                    var _unitPrice = parseInt(this.state.unitPrice);
                                    this.setState({TotalAmount: (_unitPrice * _quantity).toString(), quantity: text})
                                    }
                                  }}
                                  keyboardType="numeric"
                                  noicon
                                />
                              </Block>
                              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                              <Text style={{fontSize: 12}}>Unit Price</Text>
                              <Input
                                  placeholder="Unit Price"
                                  color="black"
                                  style={styles.inputs}
                                  value={unitPrice}
                                  editable={false}
                                  noicon
                                />
                              </Block>
                              <Block width={width * 0.9} style={{ marginBottom: 5 }}>
                              <Text style={{fontSize: 12}}>Total Amount</Text>
                              <Input
                                  placeholder="Total Amount"
                                  color="black"
                                  style={styles.inputs}
                                  value={TotalAmount}
                                  editable={false}
                                  noicon
                                />
                              </Block>
                              </Block>) : (<Block />)}
                              <Block style={{marginBottom:  10}}></Block>
                               
                              { (product != null) ?  (
                              <Block width={width * 0.9} center>
                                <GaButton
                                    shadowless
                                    style={styles.loginbutton}
                                    color={nowTheme.COLORS.PRIMARY}
                                    onPress={() => this.saveandnavigate()}
                                >
                                    <Text
                                        style={{ fontFamily: 'montserrat-bold', fontSize: 14 }}
                                        color={theme.COLORS.WHITE}
                                    >
                                        MAKE PAYMENT
                                    </Text>
                                </GaButton>
                              </Block>)
                               : (<Block />)}
                            </Block>
                        </Block>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    inputs: {
        borderWidth: 1,
        borderColor: nowTheme.COLORS.SECONDARY,
        borderRadius: 0,
        height: 64
      },
      picker: {
        borderWidth: 1,
        borderColor: nowTheme.COLORS.SECONDARY,
        borderRadius: 0,
        height: 64,
        paddingTop: 5
      },
      loginbutton: {
        width: ((width * 0.9)),
        height: 64,
        shadowRadius: 0,
        shadowOpacity: 0
      }
})
export default MakeOrder