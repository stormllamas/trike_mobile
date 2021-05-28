import React, { useEffect, useState, Fragment } from 'react';
import { PROJECT_URL } from "../../actions/siteConfig"
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Icon, Spinner, Layout, Text, Button, Card, Input, Divider } from '@ui-kitten/components';
import { LogBox, Dimensions, StyleSheet, Image, ScrollView, SafeAreaView, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        email: email.trim(),
        password,
      })
      setLoggingIn(false)
    }
  }

  const getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name,  first_name, last_name, email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          const body = {
            first_name: result.name,
            last_name: '',
            email: result.email,
            facebook_id: result.id,
          }
          socialSignin(body)
          console.log('result:', result);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  useEffect(() => {
    console.log('triggered reroute')
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
              onBlur={() => setEmail(email.trim())}
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
          <Button style={{backgroundColor: '#59CD5F', borderColor: '#59CD5F', marginTop: 20 }} onPress={onSubmit}>Login</Button>
          <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
            <View style={{ backgroundColor: '#DFDFDF', flex: 1, height: 1 }}></View>
            <Text style={{ flex: 0.5, textAlign: 'center' }}>OR</Text>
            <View style={{ backgroundColor: '#DFDFDF', flex: 1, height: 1 }}></View>
          </View>
          <Button style={{backgroundColor: '#2196F3', borderColor: '#2196F3', marginTop: 20 }} accessoryLeft={() => <Ionicons style={{ color: '#ffffff' }} size={20} name="logo-facebook"></Ionicons>} onPress={loginWithFacebook}>Login with Facebook</Button>

          {/* <LoginButton
            onLoginFinished={(error, result) => {
              if (error) {
                console.log('login has error: ' + result.error);
              } else if (result.isCancelled) {
                console.log('login is cancelled.');
              } else {
                console.log('login success')
                AccessToken.getCurrentAccessToken().then(data => {
                  const accessToken = data.accessToken.toString();
                  getInfoFromToken(accessToken);
                });
              }
            }}
            onLogoutFinished={() => console.log('logged out')}
          /> */}
        </Card>
        <View style={[ { marginTop: 50, marginBottom: 50, alignItems: 'center' } ]}>
          <Text style={[ styles.mute, { marginBottom: 15 } ]}>Don't have an account? <Text style={[ styles.link ]} onPress={() => navigation.navigate('Signup')}>Signup</Text></Text>
          <Text style={[ styles.link ]} onPress={() => navigation.navigate('PasswordReset')}>Forgot your Password?</Text>
        </View>
      </ScrollView>
    </Layout>
  )
}
Login.propTypes = {
  login: PropTypes.func.isRequired,
  socialSignin: PropTypes.func.isRequired,
  reroute: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {login, socialSignin, reroute})(Login);