import React from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import { nowTheme } from '../constants';
import { Icon } from '../components';
const { width } = Dimensions.get("screen");

class IconCard extends React.Component {
  render() {
    const {
      navigation,
      item,
      isnavigate,
      onItemClick,
    } = this.props;

    return (
      <Block style={styles.iconCard}>
        <TouchableOpacity onPress={() => (isnavigate) ? navigation.navigate(item.link) : onItemClick}>
          <Block middle >
          <Icon
            family="NowExtra"
            size={30}
            name={item.icon}
            color={nowTheme.COLORS['ICON']}
        />
          </Block>
            <Block middle>
              <Text
                style={{ fontFamily: 'montserrat-regular',  textAlign: 'center' }}
                size={14}
                color={nowTheme.COLORS.SECONDARY}
              >
                {item.title}
              </Text>
          </Block>
        </TouchableOpacity>
      </Block>
    );
  }
}

IconCard.propTypes = {
  item: PropTypes.object,
  isnavigate: PropTypes.bool,
  onItemClick: PropTypes.func
};

const styles = StyleSheet.create({
    iconCard: { 
        width: (width / 3) - 15,
        paddingHorizontal: 2,
        fontFamily: 'montserrat-regular'
    
      },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 4
  },
  cardTitle: {
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 15
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: 'hidden'
  },
  image: {
    // borderRadius: 3,
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  shadow: {
    shadowColor: '#8898AA',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2
  },
});

export default withNavigation(IconCard);
