import React, { useEffect, useState, useRef } from 'react';
import { useBackButton } from '../common/BackButtonHandler';

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Button, Icon, Text, Spinner, Input } from '@ui-kitten/components';
import { Alert, Dimensions, View, ScrollView, TouchableWithoutFeedback } from 'react-native'

import { GOOGLE_API_KEY } from "../../actions/siteConfig"

import Header from '../layout/Header'

import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../common/Styles'

import { updatePassword, reroute } from '../../actions/auth'


const Security = ({
  auth: { isAuthenticated, userLoading },
  updatePassword,
  
  reroute,
  navigation
}) => {

  const [oldPassword, setoldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  const handleBackButtonClick = () => {
    // navigation.goBack()
    navigation.navigate('Root', {screen: 'Food'})
    return true
  }
  useBackButton(handleBackButtonClick)

  const changePassword = async () => {
    setUpdatingPassword(true)
    if (oldPassword !== '' && newPassword !== '' & newPassword2 !== '') {
      if (newPassword === newPassword2) {
        const result = await updatePassword(oldPassword, newPassword)
        if (result === 'okay') {
          setShowPassword(false)
          setShowPassword1(false)
          setShowPassword2(false)
        }
      } else {
        Alert.alert(
          "Error",
          'Password do not match',
          [
            { text: "OK" }
          ],
          { cancelable: true }
        )
      }
    } else {
      Alert.alert(
        "Error",
        'Fields Required',
        [
          { text: "OK" }
        ],
        { cancelable: true }
      )
    }
    setUpdatingPassword(false)
  }

  useEffect(() => {
    reroute({
      navigation,
      type: 'private',
      userLoading,
      isAuthenticated
    })
  }, [userLoading]);

  return (
    <>
      <Header subtitle='My Account' navigation={navigation}/>
      {userLoading || updatingPassword && (
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
          <Spinner size='large'/>
        </View>
      )}
      {isAuthenticated ? (
        <>
          <ScrollView style={{ flex: 1, padding: 15, backgroundColor: '#F8F8F8' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20 }}>My Account</Text>
            <View style={[styles.inputGroup]}>
              <Input
                value={oldPassword}
                label='Old Password'
                placeholder='What is your old password?'
                accessoryRight={(props) => (
                  <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
                    <Icon {...props} name={!showPassword ? 'eye-off' : 'eye'}/>
                  </TouchableWithoutFeedback>
                )}
                secureTextEntry={!showPassword}
                onChangeText={nextValue => setoldPassword(nextValue)}
                style={{ flex: 1, margin: 4 }}
              />
              <Input
                value={newPassword}
                label='New Password'
                placeholder='Please enter your new Password'
                accessoryRight={(props) => (
                  <TouchableWithoutFeedback onPress={() => setShowPassword1(!showPassword1)}>
                    <Icon {...props} name={!showPassword1 ? 'eye-off' : 'eye'}/>
                  </TouchableWithoutFeedback>
                )}
                secureTextEntry={!showPassword1}
                onChangeText={nextValue => setNewPassword(nextValue)}
                style={{ flex: 1, margin: 4 }}
              />
              <Input
                value={newPassword2}
                label='Re-type Your New Password'
                placeholder='This must match the password above'
                accessoryRight={(props) => (
                  <TouchableWithoutFeedback onPress={() => setShowPassword2(!showPassword2)}>
                    <Icon {...props} name={!showPassword2 ? 'eye-off' : 'eye'}/>
                  </TouchableWithoutFeedback>
                )}
                secureTextEntry={!showPassword2}
                onChangeText={nextValue => setNewPassword2(nextValue)}
                style={{ flex: 1, margin: 4 }}
              />
            </View>
            <Button style={{backgroundColor: '#2196F3', borderColor: '#2196F3', marginTop: 20, width: Dimensions.get('window').width-100, alignSelf: 'center' }} onPress={changePassword}>CHANGE PASSWORD</Button>
          </ScrollView>
        </>
      ) : (
        <Layout></Layout>
      )}
    </>
  )
}

Security.propTypes = {
  updatePassword: PropTypes.func.isRequired,
  reroute: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {reroute, updatePassword})(Security);