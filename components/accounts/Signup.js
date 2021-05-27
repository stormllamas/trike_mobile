import React, { useEffect, useState, Fragment } from 'react';

import { PROJECT_URL } from "../../actions/siteConfig"

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Icon, Layout, Text, Button, Card, Input, Spinner } from '@ui-kitten/components';
import { Alert, Dimensions, StyleSheet, Image, ScrollView, SafeAreaView, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

import { signup, socialSignin, reroute } from '../../actions/auth';
import { styles } from '../common/Styles'


const AlertIcon = (props) => (
  <Icon {...props} name='alert-circle-outline'/>
);

const Signup = ({
  auth: {userLoading, isAuthenticated},
  signup,
  socialSignin,
  reroute,
  navigation
}) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true)
    if (firstName && lastName && email && password1 && password2 ? true : false) {
      if (password1 === password2) {
        const newUser = {
          first_name: firstName,
          last_name: lastName,
          email,
          password: password1
        }
        const res = await signup(newUser)
        if (res.status === 'okay') {
          navigation.navigate('ConfirmEmail', {email})
        } else {
          Alert.alert(
            "Error",
            res.msg,
            [
              { text: "OK" }
            ]
          );
        }
      } else {
        Alert.alert(
          "Error",
          'Passwords do not match',
          [
            { text: "OK" }
          ]
        );
      }
    } else {
      Alert.alert(
        "Error",
        'Please fill in all fields',
        [
          { text: "OK" }
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
        <Card style={styles.authCard} disabled={true}>
          <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 25, alignSelf: 'center' }}>Signup</Text>
          <View style={[styles.inputGroup]}>
            <Input
              value={firstName}
              label='First Name'
              // style={{ borderColor: 'red' }}
              // placeholder='Enter Your First Name'
              // caption='Should contain at least 8 symbols'
              // captionIcon={AlertIcon}
              onChangeText={nextValue => setFirstName(nextValue)}
            />
          </View>
          <View style={[styles.inputGroup]}>
            <Input
              value={lastName}
              label='Last Name'
              // placeholder='Enter Your Last Name'
              // caption='Should contain at least 8 symbols'
              // captionIcon={AlertIcon}
              onChangeText={nextValue => setLastName(nextValue)}
            />
          </View>
          <View style={[styles.inputGroup]}>
            <Input
              value={email}
              label='Email'
              // placeholder='Enter Your Email'
              // caption='Should contain at least 8 symbols'
              // captionIcon={AlertIcon}
              onChangeText={nextValue => setEmail(nextValue)}
            />
          </View>
          <View style={[styles.inputGroup]}>
            <Input
              value={password1}
              label='Password'
              // placeholder='Enter Your Password'
              accessoryRight={(props) => (
                <TouchableWithoutFeedback onPress={() => setShowPassword1(!showPassword1)}>
                  <Icon {...props} name={!showPassword1 ? 'eye-off' : 'eye'}/>
                </TouchableWithoutFeedback>
              )}
              secureTextEntry={!showPassword1}
              onChangeText={nextValue => setPassword1(nextValue)}
            />
          </View>
          <View style={[styles.inputGroup]}>
            <Input
              value={password2}
              label='Re-enter Password'
              // placeholder='Enter Your Password'
              caption='Must match your password'
              accessoryRight={(props) => (
                <TouchableWithoutFeedback onPress={() => setShowPassword2(!showPassword2)}>
                  <Icon {...props} name={!showPassword2 ? 'eye-off' : 'eye'}/>
                </TouchableWithoutFeedback>
              )}
              captionIcon={AlertIcon}
              secureTextEntry={!showPassword2}
              onChangeText={nextValue => setPassword2(nextValue)}
            />
          </View>
          <Button style={{backgroundColor: '#2196F3', borderColor: '#2196F3', marginTop: 20 }} onPress={onSubmit}>Signup</Button>
        </Card>
        <View style={[ { marginTop: 50, marginBottom: 50, alignItems: 'center' } ]}>
          <Text style={[ styles.mute, { marginBottom: 15 } ]}>Already have an account? <Text style={[ styles.link ]} onPress={() => navigation.navigate('Login')}>Login</Text></Text>
          <Text style={[ styles.link ]}>Forgot your Password?</Text>
        </View>
      </ScrollView>
    </Layout>
  )
}


let deviceWidth = Dimensions.get('window').width

const signupStyles = StyleSheet.create({
})

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
  socialSignin: PropTypes.func.isRequired,
  reroute: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {socialSignin, reroute, signup})(Signup);