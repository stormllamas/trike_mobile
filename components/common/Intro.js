import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { PROJECT_URL } from "@env"
import PropTypes from 'prop-types'

import { styles } from '../common/Styles'

import { Layout, Spinner } from '@ui-kitten/components';
import { View, Dimensions, StyleSheet, Image } from 'react-native'

import { reroute } from '../../actions/auth'

const Intro = ({
  auth: {userLoading, isAuthenticated},
  route,
  reroute,
  navigation
}) => {

  useEffect(() => {
    // console.log(route.params)
    reroute({
      navigation,
      type: 'intro',
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