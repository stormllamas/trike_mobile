import React, { useEffect, useState, Fragment } from 'react';
import { PROJECT_URL } from "../../actions/siteConfig"
console.log('ConfirmEmail ENV', PROJECT_URL)

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Layout, Text, Button, Card, Spinner } from '@ui-kitten/components';
import { Alert, Dimensions, StyleSheet, Image, ScrollView, View, TouchableWithoutFeedback } from 'react-native'

import { reroute, resendActivation } from '../../actions/auth';
import { styles } from '../common/Styles'


const ConfirmEmail = ({
  auth: {userLoading, isAuthenticated},
  resendActivation,
  route,
  reroute,
  navigation
}) => {

  const [loading, setLoading] = useState(false);

  const resendActivationClicked = async () => {
    setLoading(true)
    const res = await resendActivation({ email: route.params.email })
    if (res.status === 'okay') {
      Alert.alert(
        "Success",
        res.msg,
        [
          { text: "OK" }
        ]
      );
    } else {
      Alert.alert(
        "Error",
        res.msg,
        [
          {
            text: res.msg === 'Email does not exist. Please signup first' ? "Signup" : (res.msg === 'Email already activated' ? 'Login' : 'OK'),
            onPress: () => {
              if (res.msg === 'Email does not exist. Please signup first') {
                navigation.navigate('Signup')
              } else if (res.msg === 'Email already activated') {
                navigation.navigate('Login')
              }
            }
          }
        ]
      );
    }
    setLoading(false)
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
      {loading && (
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
          <Spinner size='large'/>
        </View>
      )}
      <ScrollView>
        <Image
          style={[styles.tinyLogo, { marginTop: 50 }]}
          source={{uri:`${PROJECT_URL}/static/frontend/img/Trike_logo-whole.png`}}
        />
        <Card style={[styles.authCard]} disabled={true}>
          <Text style={{textAlign: 'center', marginBottom: 20 }} category="h4">Confirm Your Email</Text>
          <Text style={{textAlign: 'center', marginBottom: 15 }}>We've sent you a confirmation email. Please check your email by checking your inbox and clicking the link at</Text>
          <Text category="h6" style={{ textAlign: 'center', fontFamily: 'Lato-Bold', marginBottom: 15 }}>{route.params.email}</Text>
          <Text style={{ textAlign: 'center', marginBottom: 15 }}>If you did not receive an email form us within 5mins please click the button below to request another activation link from us</Text>
          <Button style={{backgroundColor: '#2196F3', borderColor: '#2196F3', marginTop: 20 }} onPress={() => resendActivationClicked()}>Resend Activation Email</Button>
        </Card>
      </ScrollView>
    </Layout>
  )
}


const signupStyles = StyleSheet.create({
})

ConfirmEmail.propTypes = {
  resendActivation: PropTypes.func.isRequired,
  reroute: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {resendActivation, reroute})(ConfirmEmail);