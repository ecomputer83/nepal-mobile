import React  from 'react';
import { withNavigation } from 'react-navigation';
import { ImageBackground, TouchableOpacity, StyleSheet, Image, Platform, Dimensions, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Button, Block, NavBar, Text, theme, Button as GaButton } from 'galio-framework';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import Icon from './Icon';
import Input from './Input';
import Tabs from './Tabs';
import Theme from '../constants/Theme';
import {Images, prod} from '../constants';
const Fontello = createIconSetFromFontello(fontelloConfig);
const { height, width } = Dimensions.get('window');
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const AddButton = ({ isWhite, style, navigation, link, iconName }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    
  >
   <Fontello name={iconName} size={16}
      color="#ffffff"
    />
  </TouchableOpacity>
);

const AddIconButton = ({ iconFamily, style, navigation, iconName }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate('Onboarding')}
  >
   <Icon name={iconName} family={iconFamily} size={16}
      color="#ffffff"
    />
  </TouchableOpacity>
);


class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Users: prod.Users,
      Name: 'Business Name',
      Limit: 0,
      Balance: 0,
      ipman: 0,
      ipmancode: '',
      isfetched: false
    }

  }
  
  

  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return back ? navigation.goBack() : navigation.openDrawer();
  };

  readData = async () => {
    return await AsyncStorage.getItem('@UserId');
  }
  renderRight = () => {
    const { white, title, navigation } = this.props;
    const { routeName } = navigation.state;

    switch (routeName) {
      case 'TrackOrder':
        return [
          <AddButton key="sort" iconName="sort" navigation={navigation} isWhite={white} />,
          <AddButton key="filter" iconName="filter" navigation={navigation} isWhite={white} />
        ];
      case 'Home':
        return [
          <AddIconButton key="logout" iconName="logout" navigation={navigation} iconFamily="AntDesign" />
        ]
      default:
        break;
    }
  };
  renderSearch = () => {
    const { navigation, bgColor } = this.props;
    return (
      bgColor ? (
      <Block style={{width: width, backgroundColor: Theme.COLORS.BODY}}> 
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        placeholderTextColor={'#8898AA'}
        iconContent={
          <Icon size={16} color={theme.COLORS.MUTED} name="search" family="NowExtra" />
        }
      />
      </Block>)
      : (
        <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        placeholderTextColor={'#8898AA'}
        iconContent={
          <Icon size={16} color={theme.COLORS.MUTED} name="search" family="NowExtra" />
        }
      />
      )
    );
  };
  renderMessage = () => {
    const { navigation, User } = this.props;
    if(!this.state.isfetched){
    this.readData().then( userid => {
      console.log('mylog' + parseInt(userid))
      if(userid !== null){
        
        var user = prod.Users.find(u => u.UserId == parseInt(userid))
        
        this.setState({Name: user.CompanyName,
        Limit: user.limit,
        Balance: user.balance,
        ipman: user.ipman,
        ipmancode: user.ipmancode,
        isfetched: true
        })
      }
    });
  }
    
    return (
      <Block style={styles.options}>
        <Block row>
        <Image source={Images.Logo} style={{ width: 221, height: 53, marginBottom: 20, marginLeft: (width - 221)/2.5, marginTop: 10 }} />
        <AddIconButton key="logout" iconName="logout" navigation={navigation} iconFamily="AntDesign" style={{ marginLeft: 15, marginTop: 15}} />
        </Block>
        <Block row space="between" > 
          <Block>
            <Text size={18} style={{ fontFamily: 'HKGrotesk-Bold', lineHeight: 22,fontWeight: '600', color: Theme.COLORS.HEADER}}>
              Good Morning,
            </Text>
            <Text size={20} style={{ fontFamily: 'HKGrotesk-Light', lineHeight: 24,fontWeight: '300', color: Theme.COLORS.HEADER}}>
              {this.state.Name}
            </Text>
            {this.state.ipman == 1 ? 
            (
              <Block>
                <Text size={12} style={{ fontFamily: 'HKGrotesk-Light', lineHeight: 12,fontWeight: '300', color: Theme.COLORS.HEADER}}>
              IPMAN Code #: {this.state.ipmancode}
            </Text>
              <Text size={12} style={{ fontFamily: 'HKGrotesk-Light', lineHeight: 32,fontWeight: '300', color: Theme.COLORS.HEADER}}>
              Credit limit ₦{this.state.Limit.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>
            <Text size={12} style={{ fontFamily: 'HKGrotesk-Light', lineHeight: 12,fontWeight: '300', color: Theme.COLORS.HEADER}}>
              Credit Balance 
            </Text>
            <Text size={20} style={{ fontFamily: 'HKGrotesk-Bold', lineHeight: 20,fontWeight: '300', color: Theme.COLORS.HEADER}}>
            ₦{this.state.Balance.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>
            </Block>) : (<Block />) }
            </Block>
        <Block>
          <Image source={Images.Profile} style={{ width: 56, height: 55, borderRadius: 50}} />
        </Block>
        
            
        </Block>
      </Block>
    );
  };

  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;

    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })}
      />
    );
  };
  renderHeader = () => {
    const { search, message, tabs } = this.props;
    if (search || tabs || message) {
      return (
        <Block center>
          {message ? this.renderMessage() : null}
          {search ? this.renderSearch() : null}
          {tabs ? this.renderTabs() : null}
        </Block>
      );
    }
  };
  render() {
    const {
      back,
      title,
      User,
      white,
      transparent,
      bgColor,
      noNav,
      iconColor,
      titleColor,
      navigation,
      ...props
    } = this.props;
    const { routeName } = navigation.state;
    const noShadow = ['Search', 'Profile'].includes(routeName);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
      bgColor ? { backgroundColor: bgColor } : null,
    ];

    const navbarStyles = [styles.navbar, bgColor && { backgroundColor: bgColor }];
    

    return (

      <Block style={headerStyles}>
        <StatusBar
                    backgroundColor={Theme.COLORS.PRIMARY}
                    barStyle="light-content"
                />
        {(noNav) ? 
        <Block />
        :
      
        (<NavBar
          title={title}
          style={navbarStyles}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          titleStyle={[
            styles.title,
            { color: Theme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />)
        }
        {this.renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative'
  },
  title: {
    width: '100%',
    fontSize: 18,
    fontFamily: 'HKGrotesk-Bold',
    textAlign: 'center'
  },
  navbar: {
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX() ? theme.SIZES.BASE * 3.5 : theme.SIZES.BASE,
    zIndex: 5,
    width: width
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 0
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  notify: {
    backgroundColor: Theme.COLORS.SUCCESS,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12
  },
  header: {
    backgroundColor: theme.COLORS.WHITE
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON
  },
  search: {
    height: 40,
    width: width - 10,
    marginHorizontal: 4,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: Theme.COLORS.BORDER
  },
  options: {
    marginBottom: 25,
    elevation: 4,
    width:width - 30,
    marginLeft: 15,
    marginRight: 15
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: Theme.COLORS.HEADER
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center'
  },
  profileContainer: {
    width,
    height: 'auto',
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width,
    height: 'auto'
  },
  logo: {
    height: 80,
    width: 88,
    marginRight: 15
  },
  makebutton: {
    width: (width /2) - 7.5,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginRight: 5,
    marginLeft: 5
  },

  trackbutton: {
    width: (width /2) - 7.5,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  }
});

export default withNavigation(Header);
