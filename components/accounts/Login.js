import React, { useEffect, useState, Fragment } from 'react';
import { PROJECT_URL } from "@env"

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Icon, Spinner, Layout, Text, Button, Card, Input } from '@ui-kitten/components';
import { LogBox, Dimensions, StyleSheet, Image, ScrollView, SafeAreaView, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

import { login, socialSignin, reroute } from '../../actions/auth';
import { styles } from '../common/Styles'

const Login = ({
  auth: {userLoading, isAuthenticated},
  socialSignin,
  login,
  reroute,
  navigation
}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [loggingIn, setLoggingIn] = useState(false);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );
  
  const onSubmit = async e => {
    if(email && password) {
      setLoggingIn(true)
      await login({
        email,
        password,
      })
      setLoggingIn(false)
    }
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
      {userLoading || loggingIn && (
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
          <Spinner size='large'/>
        </View>
      )}
      <ScrollView>
        <Image
          style={[styles.tinyLogo, { marginTop: 50 }]}
          source={{uri:`${PROJECT_URL}/static/frontend/img/Trike_logo-whole.png`}}
        />
        <Card style={styles.authCard} disabled={true}>
          <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 25, alignSelf: 'center' }}>Login</Text>
          <View style={[styles.inputGroup]}>
            <Input
              value={email}
              label='Email'
              placeholder='Enter Your Email'
              onChangeText={nextValue => setEmail(nextValue)}
            />
          </View>
          <View style={[styles.inputGroup]}>
            <Input
              value={password}
              label='Password'
              placeholder='Enter Your Password'
              accessoryRight={renderIcon}
              secureTextEntry={secureTextEntry}
              onChangeText={nextValue => setPassword(nextValue)}
            />
          </View>
          <Button style={{backgroundColor: '#2196F3', borderColor: '#2196F3', marginTop: 20 }} onPress={onSubmit}>Login</Button>
        </Card>
        <View style={[ { marginTop: 50, marginBottom: 50, alignItems: 'center' } ]}>
          <Text style={[ styles.mute, { marginBottom: 15 } ]}>Don't have an account? <Text style={[ styles.link ]} onPress={() => navigation.navigate('Signup')}>Signup</Text></Text>
          <Text style={[ styles.link ]}>Forgot your Password?</Text>
        </View>
      </ScrollView>
    </Layout>
  )
}


let deviceWidth = Dimensions.get('window').width

const loginStyles = StyleSheet.create({
})

Login.propTypes = {
  login: PropTypes.func.isRequired,
  socialSignin: PropTypes.func.isRequired,
  reroute: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {login, socialSignin, reroute})(Login);