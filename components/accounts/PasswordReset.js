import React, { useEffect, useState, Fragment } from 'react';
import { PROJECT_URL } from "../../actions/siteConfig"
import { useBackButton } from '../common/BackButtonHandler';

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Icon, Spinner, Layout, Text, Button, Card, Input } from '@ui-kitten/components';
import { Alert, Dimensions, StyleSheet, Image, ScrollView, View,  TouchableWithoutFeedback } from 'react-native'

import { reroute, requestPasswordReset } from '../../actions/auth';
import { styles } from '../common/Styles'

const PasswordReset = ({
  auth: {requestLoading, userLoading, isAuthenticated},
  requestPasswordReset,
  reroute,
  navigation
}) => {

  const [email, setEmail] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestingReset, setRequestingReset] = useState('');
  
  const handleBackButtonClick = () => {
    // navigation.goBack()
    navigation.navigate('Root', {screen: 'Login'})
    return true
  }
  useBackButton(handleBackButtonClick)

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onSubmit = async () => {
    setRequestingReset(true)
    if (email) {
      if (validateEmail(email)) {
        const request = await requestPasswordReset(email)
        if (request === 'okay') {
          setRequestEmail(email)
        }
      } else {
        Alert.alert(
          "Error",
          'Please enter a valid email',
          [
            { text: "OK" }
          ],
          { cancelable: true }
        )
      }
    } else {
      Alert.alert(
        "Error",
        'You must set an email',
        [
          { text: "OK" }
        ],
        { cancelable: true }
      )
    }
    setRequestingReset(false)
  }

  useEffect(() => {
    reroute({
      navigation,
      type: 'auth',
      userLoading,
      isAuthenticated
    })
  }, [userLoading]);

  return (
    <Layout level="2" style={{ minHeight: Dimensions.get('window').height, paddingBottom: 50 }}>
      {userLoading || requestingReset ? (
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
          <Spinner size='large'/>
        </View>
      ): undefined}
      <ScrollView>
        <Image
          style={[styles.tinyLogo, { marginTop: 50 }]}
          source={{uri:`${PROJECT_URL}/static/frontend/img/Trike_logo-whole.png`}}
        />
        {!requestEmail ? (
          <Card style={styles.authCard} disabled={true}>
            <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 25, alignSelf: 'center' }}>Password Reset</Text>
            <View style={[styles.inputGroup]}>
              <Input
                value={email}
                onBlur={() => setEmail(email.trim())}
                label='Email'
                placeholder='Enter Your Email'
                onChangeText={nextValue => setEmail(nextValue)}
              />
            </View>
            <Button style={{backgroundColor: '#2196F3', borderColor: '#2196F3', marginTop: 20 }} onPress={onSubmit}>Send Password Reset Email</Button>
          </Card>
        ) : (
          <Card style={styles.authCard} disabled={true}>
            <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 25, alignSelf: 'center' }}>Password Reset</Text>
            <Text style={{ marginBottom: 15, alignSelf: 'center' }}>Please check your email at</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15, alignSelf: 'center' }}>{email}</Text>
            <Text style={{ marginBottom: 15, alignSelf: 'center', textAlign: 'center' }}>for a link to reset your password. If it doesn't appear within a few minutes, please check your spam folder.</Text>
            <Button style={{backgroundColor: '#2196F3', borderColor: '#2196F3', marginTop: 20 }} onPress={() => navigation.navigate('Login')}>Return to Login</Button>
          </Card>
        )}
        <View style={[ { marginTop: 50, marginBottom: 50, alignItems: 'center' } ]}>
          <Text style={[ styles.mute, { marginBottom: 15 } ]}>Don't have an account? <Text style={[ styles.link ]} onPress={() => navigation.navigate('Signup')}>Signup</Text></Text>
          <Text style={[ styles.link ]} onPress={() => navigation.navigate('Login')}>Return to Login</Text>
        </View>
      </ScrollView>
    </Layout>
  )
}

PasswordReset.propTypes = {
  requestPasswordReset: PropTypes.func.isRequired,
  reroute: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {requestPasswordReset, reroute})(PasswordReset);