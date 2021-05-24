import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { PROJECT_URL } from "../../actions/siteConfig"
console.log('Intro ENV', PROJECT_URL)

import { styles } from '../common/Styles'

import { Layout, Spinner } from '@ui-kitten/components';
import { Image } from 'react-native'

import { reroute } from '../../actions/auth'

const Intro = ({
  auth: {userLoading, isAuthenticated},
  route,
  reroute,
  navigation
}) => {

  useEffect(() => {
    reroute({
      type: 'intro',
      navigation,
      userLoading,
      isAuthenticated
    })
  }, [userLoading]);

  return (
    <>
      <Layout style={styles.fullContainerMedium}>
        <Image
          style={styles.tinyLogo}
          source={{uri:`${PROJECT_URL}/static/frontend/img/Trike_logo-whole.png`}}
        />
        <Spinner size='large'/>
      </Layout>
    </>
  )
}

Intro.propTypes = {
  reroute: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {reroute})(Intro);