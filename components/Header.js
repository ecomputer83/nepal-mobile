import * as React  from 'react';
import { withNavigation } from 'react-navigation';
import { Alert, TouchableOpacity, StyleSheet, Image, Platform, Dimensions, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Button, Block, NavBar, Text, theme, Button as GaButton } from 'galio-framework';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import Icon from './Icon';
import Input from './Input';
import Tabs from './Tabs';
import Theme from '../constants/Theme';
import {Images, prod} from '../constants';

import { AuthContext } from '../helpers/authContext';
import HttpService from '../services/HttpService';
const Fontello = createIconSetFromFontello(fontelloConfig);
const { height, width } = Dimensions.get('window');
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);




function Header ({ white, title, back, bgColor, User, search, message, transparent, noNav, iconColor, titleColor, navigation }) {

  const { signOut } = React.useContext(AuthContext);

  const [state, setState] = React.useState({
    Name: 'Business Name',
    Limit: 0,
    Balance: 0,
    ipman: 0,
    ipmancode: '',
    isfetched: false
  });
  
  const AddIconButton = ({ iconFamily, style, iconName }) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => {
        Alert.alert(
          'Log out',
          'Are you sure you want to log out',
          [
            {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
            {text: 'YES', onPress: () => signOut()},
          ]
        );
        
        }
      }
    >
     <Icon name={iconName} family={iconFamily} size={16}
        color="#ffffff"
      />
    </TouchableOpacity>
  );

  const AddButton = ({ isWhite, style, navigation, link, iconName }) => (
    <TouchableOpacity
      style={[styles.button, style]}
      
    >
     <Fontello name={iconName} size={16}
        color="#ffffff"
      />
    </TouchableOpacity>
  );

  const handleLeftPress = () => {
    return back ? navigation.goBack() : navigation.openDrawer();
  };

  React.useEffect(() => {
  const readData = async () => {
    var token = await AsyncStorage.getItem('userToken');
    var _user = await AsyncStorage.getItem('user');
    try {
        if(_user != null) {
          var user = JSON.parse(_user)
          setState({Name: user.businessName,
            Limit: user.creditLimit,
            Balance: user.creditBalance,
            ipman: user.isIPMAN,
            ipmancode: user.ipmanCode,
            isfetched: true
            })
          console.log(user)
        }else{
          signOut();
        }
        HttpService.GetAsync('api/account/user', token)
        .then(response => {
          if (!response.ok) {
            if(!response.statusText){
              if(response.headers.map.www-authenticate){
                signOut();
              }
            }else{
              throw Error(response.statusText);
            }
          }
        })
    } catch (error) {
      console.error(error);
      //signOut();
    }
  };
  readData();
}, []);
  const renderRight = () => {
    const { routeName } = navigation.state;

    switch (routeName) {        
      case 'Home':
        return [
          <AddIconButton key="logout" iconName="logout" iconFamily="AntDesign" />
        ]
      default:
        break;
    }
  };
  const renderSearch = () => {
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
  const renderMessage = () => {
    
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
              {state.Name}
            </Text>
            {state.ipman == 1 ? 
            (
              <Block>
                <Text size={12} style={{ fontFamily: 'HKGrotesk-Light', lineHeight: 12,fontWeight: '300', color: Theme.COLORS.HEADER}}>
              IPMAN Code #: {state.ipmancode}
            </Text>
              
            
            </Block>) : (<Block />) }
            </Block>
        <Block>
          {(state.Limit != null)? 
        (<Text size={12} style={{ fontFamily: 'HKGrotesk-Light', lineHeight: 32,fontWeight: '300', color: Theme.COLORS.HEADER}}>
              Credit limit ₦{state.Limit.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>) :(<Block />)
          }
          {(state.Balance != null)? 
          (<Block><Text size={12} style={{ fontFamily: 'HKGrotesk-Light', lineHeight: 12,fontWeight: '300', color: Theme.COLORS.HEADER}}>
              Credit Balance 
            </Text>
            <Text size={20} style={{ fontFamily: 'HKGrotesk-Bold', lineHeight: 20,fontWeight: '300', color: Theme.COLORS.HEADER}}>
            ₦{state.Balance.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
        </Text></Block>) : <Block /> }
        </Block>
        
            
        </Block>
      </Block>
    );
  };

  // renderTabs = () => {
  //   const { tabs, tabIndex, navigation } = this.props;
  //   const defaultTab = tabs && tabs[0] && tabs[0].id;

  //   if (!tabs) return null;

  //   return (
  //     <Tabs
  //       data={tabs || []}
  //       initialIndex={tabIndex || defaultTab}
  //       onChange={id => navigation.setParams({ tabId: id })}
  //     />
  //   );
  // };
  const renderHeader = () => {
    if (search || message) {
      return (
        <Block center>
          {message ? renderMessage() : null}
          {search ? renderSearch() : null}
        </Block>
      );
    }
  };

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
          right={renderRight()}
          rightStyle={{ alignItems: 'center' }}
          titleStyle={[
            styles.title,
            { color: Theme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          //{...props}
        />)
        }
        {renderHeader()}
      </Block>
    );
  
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
