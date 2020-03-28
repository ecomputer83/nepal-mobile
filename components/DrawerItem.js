import React from 'react';
import { StyleSheet } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import Icon from './Icon';
import nowTheme from '../constants/Theme';

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case 'My Vehicles':
        return (
          <Icon
            name="apps"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
            />
        );
      case 'My Appointments':
        return (
          <Icon
            name="book"
            family="NowExtra"
            size={18} color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
            />
        );
      case 'My Service Status':
        return (
          <Icon
            name="attach-file"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
            />
        );
      case 'Get Estimate':
        return (
          <Icon
            name="person"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
            />
        );
      case 'Vehicle Showroom':
        return (
          <Icon
            name="acount-balance"
            family="NowExtra"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
            style={{ opacity: 0.5 }}
            />
        );
      case 'Parts Enquiry':
        return (
          <Icon
            name="album"
            family="NowExtra"
            size={14}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          />
        );

      case 'Diagnostic Experts':
          return (
            <Icon
              name="album"
              family="NowExtra"
              size={14}
              color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
            />
          );

      case 'Tow Service':
        return (
          <Icon
            name="album"
            family="NowExtra"
            size={14}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          />
        );

      case 'Latest Promos':
        return (
          <Icon
            name="album"
            family="NowExtra"
            size={14}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          />
        );
      case 'Safety Tips':
        return (
          <Icon
            name="mouse"
            family="NowExtra"
            size={18}
            style={{ borderColor: 'rgba(0,0,0,0.5)' }}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          />
        );
        case 'Notifications':
          return (
            <Icon
              name="mouse"
              family="NowExtra"
              size={18}
              style={{ borderColor: 'rgba(0,0,0,0.5)' }}
              color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
            />
          );
          case 'Service Centers':
        return (
          <Icon
            name="mouse"
            family="NowExtra"
            size={18}
            style={{ borderColor: 'rgba(0,0,0,0.5)' }}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          />
        );
        case 'FAQs':
        return (
          <Icon
            name="mouse"
            family="NowExtra"
            size={18}
            style={{ borderColor: 'rgba(0,0,0,0.5)' }}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          />
        );
        case 'Contact us':
        return (
          <Icon
            name="phone"
            family="NowExtra"
            size={18}
            style={{ borderColor: 'rgba(0,0,0,0.5)' }}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          />
        );
      case 'Sign In/Sign Out':
        return (
          <Icon
            name="lock-open"
            family="NowExtra"
            size={18}
            style={{ borderColor: 'rgba(0,0,0,0.5)' }}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { focused, title } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <Block flex row style={containerStyles}>
        <Block middle flex={0.1} style={{ marginRight: 5 }}>
          {this.renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          <Text
            style={{ fontFamily: 'montserrat-regular', textTransform: 'uppercase', fontWeight: '300' }}
            size={12}
            bold={focused ? true : false}
            color={focused ? nowTheme.COLORS.PRIMARY : 'white'}
          >
            {title}
          </Text>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: 'white'
  },
  activeStyle: {
    backgroundColor: nowTheme.COLORS.WHITE,
    color: 'white'
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
