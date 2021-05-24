import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { Divider, Icon, MenuItem, OverflowMenu, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

import { logout } from '../../actions/auth'
import { setMenuToggler } from '../../actions/siteConfig'

const Header = ({
  siteConfig: {sideBarToggled}, setMenuToggler,
  logout,
  subtitle,
  sideMenu,
  navigation,
  backLink
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
    <>
      <TopNavigation
        alignment='center'
        title='Trike'
        subtitle={subtitle}
        style={{ zIndex: 5 }}
        accessoryLeft={() => backLink ? (
          <TopNavigationAction icon={props => <Icon {...props} name='arrow-back' onPress={() => navigation.navigate(backLinkComponent, backLinkOptions)}/>}/>
        ) : (
          sideMenu ? (
            <TopNavigationAction icon={props => <Icon {...props} name='menu-outline' onPress={() => setMenuToggler(!sideBarToggled)}/>}/>
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
      <Divider/>
    </>
  )
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  setMenuToggler: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  siteConfig: state.siteConfig,
});

export default connect(mapStateToProps, {logout, setMenuToggler})(Header);