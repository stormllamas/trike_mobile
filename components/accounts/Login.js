import React, { useEffect, useState, Fragment } from 'react';
import { default as theme } from '../../custom-theme.json';
import * as eva from '@eva-design/eva';

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Icon, Layout, Text, Button, Card, Input } from '@ui-kitten/components';
import { LogBox, Dimensions, StyleSheet, Image, ScrollView, SafeAreaView, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

import { v4 as uuid } from 'uuid'

import Header from '../layout/Header'
import BottomTabs from '../layout/BottomTabs'

import { login, socialSignin, reroute } from '../../actions/auth';


const AlertIcon = (props) => (
  <Icon {...props} name='alert-circle-outline'/>
);

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
      login({
        email,
        password,
      })
    }
  }

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
      <Layout level="2">
        <Image
          style={styles.tinyLogo}
          source={{uri:`${trikeURL}/static/frontend/img/Trike_logo-whole.png`}}
        />
        <Card style={styles.authCard}>
          <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 25, alignSelf: 'center' }}>Login</Text>
          <View style={[styles.inputGroup]}>
            <Input
              value={email}
              label='Email'
              placeholder='Enter Your Email'
              // caption='Should contain at least 8 symbols'
              // captionIcon={AlertIcon}
              onChangeText={nextValue => setEmail(nextValue)}
            />
          </View>
          <View style={[styles.inputGroup]}>
            <Input
              value={password}
              label='Password'
              placeholder='Enter Your Password'
              // caption='Should contain at least 8 symbols'
              accessoryRight={renderIcon}
              // captionIcon={AlertIcon}
              secureTextEntry={secureTextEntry}
              onChangeText={nextValue => setPassword(nextValue)}
            />
          </View>
          <Button style={{backgroundColor: '#2196F3', borderColor: '#2196F3'}} onPress={onSubmit}>Login</Button>
        </Card>
      </Layout>
    </>
  )
}


let deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  authCard: {
    marginTop: 50,
    marginHorizontal: 20,
    justifyContent: 'center',
    padding: 25,
    paddingHorizontal: 10
  },
  inputGroup: {
    marginBottom: 15,
  },
  tinyLogo: {
    height: 50,
    width: 155,
    alignSelf: 'center',
    marginTop: 50,
  }
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