import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { styles } from '../common/Styles'

import { Layout, Spinner } from '@ui-kitten/components';
import { View, Dimensions, StyleSheet, Image } from 'react-native'

import { reroute } from '../../actions/auth'

const Intro = ({
  auth: {userLoading, isAuthenticated},
  reroute,
  navigation
}) => {

  useEffect(() => {
    reroute({
      navigation,
      type: 'intro',
      userLoading,
      isAuthenticated
    })
  }, [userLoading]);

  const trikeURL = 'https://www.trike.com.ph'

  return (
    <>
      <Layout style={styles.fullContainer}>
        <Image
          style={styles.tinyLogo}
          source={{uri:`${trikeURL}/static/frontend/img/Trike_logo-whole.png`}}
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