import React, { useEffect, useState, Fragment } from 'react';
import { default as theme } from '../../custom-theme.json';
import * as eva from '@eva-design/eva';

import { connect } from 'react-redux';
import { Icon, MenuItem, OverflowMenu, TopNavigation, TopNavigationAction, Text, Button } from '@ui-kitten/components';
import { BackHandler, View, StyleSheet, FlatList, Alert, Image } from 'react-native'

import { logout } from '../../actions/auth'

import { styles } from '../common/Styles'

const Header = ({
  auth: {current, all_subjects},
  siteConfig: {sideBarToggler},
  logout,
  backLink,
  subtitle,
  sideMenu,
  navigation
}) => {

  const [menuVisible, setMenuVisible] = useState(false);
  const [backLinkComponent, setBackLinkComponent] = useState(false);
  const [backLinkOptions, setBackLinkOptions] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    if (backLink) {
      setBackLinkComponent(backLink.component)
      setBackLinkOptions(backLink.options)
    }
  }, [backLink])

  return (
    <TopNavigation
      alignment='center'
      title='Trike'
      subtitle={subtitle}
      accessoryLeft={() => backLink ? (
        <TopNavigationAction icon={props => <Icon {...props} name='arrow-back' onPress={() => navigation.navigate(backLinkComponent, backLinkOptions)}/>}/>
      ) : (
        sideMenu ? (
          <TopNavigationAction icon={props => <Icon {...props} name='menu-outline' onPress={() => sideBarToggler(true)}/>}/>
        ) : (
          <TopNavigationAction icon={props => <Icon {...props} name='arrow-back' onPress={() => navigation.goBack()}/>}/>
        )
      )}

      accessoryRight={() => (
        <Fragment>
          <OverflowMenu
            anchor={() => <TopNavigationAction icon={props => <Icon {...props} name='more-vertical'/>} onPress={toggleMenu}/>}
            visible={menuVisible}
            placement='bottom end'
            onBackdropPress={toggleMenu}>
            <MenuItem accessoryLeft={props => <Icon {...props} name='info'/>} title='About'/>
            <MenuItem accessoryLeft={props => <Icon {...props} name='log-out'/>} title='Logout' onPress={() => {toggleMenu(), logout()}}/>
          </OverflowMenu>
        </Fragment>
      )}
    />
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
});

export default connect(mapStateToProps, {logout})(Header);