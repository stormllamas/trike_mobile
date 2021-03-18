import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'

import { styles } from '../common/Styles';

import { Layout, Spinner } from '@ui-kitten/components';
import { Image } from 'react-native'

import { reroute } from '../../actions/auth'

const AccountsRoute = ({
  auth: { userLoading, isAuthenticated },
  siteConfig: { siteInfoLoading, siteInfo },

  navigation,
  
  name,
  component: Component,
  Stack,
}) => {

  useEffect(() => {
    reroute({
      navigation,
      type: 'auth',
      userLoading,
      isAuthenticated
    })
  }, [userLoading])
  

  if (userLoading || siteInfoLoading) {
    return(
      <Layout style={styles.container}>
        <Image
          style={styles.tinyLogo}
          source={{uri:`${trikeURL}/static/frontend/img/Trike_logo-whole.png`}}
        />
        <Spinner size='large'/>
      </Layout>
    )
  } else {
    if (siteInfo.maintenance_mode) {
      return <></>
    } else if (isAuthenticated) {
      return <></>
    } else {
      return <Component/>
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
});

export default connect(mapStateToProps)(AccountsRoute);