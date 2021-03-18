import React, { useEffect, useState, Fragment } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Icon, Text, Layout, Button, Spinner, Input, useTheme, Select, SelectItem, Divider } from '@ui-kitten/components';
import { Animated, Easing, Dimensions, View, TouchableHighlight, Image, StyleSheet, ScrollView, FlatList } from 'react-native'

import { v4 as uuid } from 'uuid'

import Header from '../layout/Header'
import BottomTabs from '../layout/BottomTabs'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../common/Styles'

import { addAddress, deleteAddress, getAddress, updateUser, updateAddressName, reroute } from '../../actions/auth'


const Profile = ({
  auth: { userLoading, user, isAuthenticated },
  addAddress, deleteAddress, getAddress, updateAddressName,
  updateUser,
  
  reroute,
  navigation
}) => {
  const theme = useTheme();

  const [editingProfile, setEditingProfile] = useState(false);

  const [firstName, setFirstName] = useState(user ? (user.first_name ? user.first_name : '') : '');
  const [lastName, setLastName] = useState(user ? (user.last_name ? user.last_name : '') : '');
  const [contact, setContact] = useState(user ? (user.contact ? user.contact : '') : '');
  const [gender, setGender] = useState(user ? (user.gender ? user.gender : '') : '');
  
  const saveUserChanges = () => {
    const body = {
      username: user.username,
      first_name: firstName,
      last_name: lastName,
      contact: contact,
      gender: gender
    }
    updateUser(body)
  }
  
  const cancelEditing = () => {
    setFirstName(user.first_name)
    setLastName(user.last_name)
    setContact(user.contact)
    setGender(user.gender)
    setEditingProfile(false)
  }

  useEffect(() => {
    reroute({
      navigation,
      type: 'private',
      userLoading,
      isAuthenticated
    })
  }, [userLoading]);

  const trikeURL = 'https://www.trike.com.ph'

  return (
    <>
      <Header subtitle='My Profile' navigation={navigation}/>
      {userLoading && (
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center'}]}>
          <Spinner size='large'/>
        </View>
      )}
      {isAuthenticated && user ? (
        <ScrollView style={{ flex: 1, padding: 15, backgroundColor: '#F8F8F8' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', }}>My Profile</Text>
          <View style={{ marginBottom: 30, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>{user.email}</Text>
          </View>
          <View style={[styles.inputGroup, { flexDirection: 'row' }]}>
            {!editingProfile ? (
              <Button style={{backgroundColor:"#03A9F4", borderColor: '#03A9F4', alignSelf:'flex-start', marginBottom: 25 }} onPress={() => setEditingProfile(true)}>EDIT PROFILE</Button>
            ) : (
              <>
                <Button style={{backgroundColor:"#66BB6A", borderColor: "#66BB6A", alignSelf:'flex-start', marginBottom: 25, marginRight: 15 }} onPress={() => saveUserChanges()}>SAVE CHANGES</Button>
                <Button style={{backgroundColor:"#FF5858", borderColor: "#FF5858", alignSelf:'flex-start', marginBottom: 25 }} onPress={() => cancelEditing()}>CANCEL</Button>
              </>
            )}
          </View>
          <View style={[styles.inputGroup, { flexDirection: 'row' }]}>
            <Input
              value={editingProfile ? firstName : user.first_name}
              label='First Name'
              placeholder='First Name'
              disabled={editingProfile ? false : true}
              onChangeText={nextValue => setFirstName(nextValue)}
              style={{ flex: 1, margin: 4 }}
            />
            <Input
              value={editingProfile ? lastName : user.last_name}
              label='Last Name'
              placeholder='Last Name'
              disabled={editingProfile ? false : true}
              onChangeText={nextValue => setLastName(nextValue)}
              style={{ flex: 1, margin: 4 }}
            />
          </View>
          <View style={styles.inputGroup}>
            <Input
              value={editingProfile ? contact : user.contact}
              onChangeText={nextValue => setPassword(nextValue)}
              label='Contact'
              placeholder='Enter Your Contact'
              disabled={editingProfile ? false : true}
              accessoryLeft={props => <FontAwesome name='phone' size={22} color={"#03A9F4"}/>}
              caption='We use this to inform you about your order'
              captionIcon={props => <Icon {...props} name='alert-circle-outline'/>}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Input
              value={editingProfile ? gender : user.gender}
              onChangeText={nextValue => setGender(nextValue)}
              disabled={editingProfile ? false : true}
              label='Gender'
              placeholder='Select a Gender'
              accessoryLeft={props => <FontAwesome name="transgender" size={22} color={"#03A9F4"}/>}
            />
          </View>
          <Divider style={{ marginBottom: 15 }}/>
          <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 15 }}>Saved Addresses</Text>
          <View style={{ marginBottom: 30 }}>
            {user.addresses.map(address => (
              <View key={address.id} style={ profileStyles.addressItem }>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', marginRight: 10 }}>{address.name ? address.name : 'Unnamed Address'}</Text>
                  <FontAwesome name='edit' size={22} color={"#03A9F4"}/>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '500' }}>{address.address}</Text>
                <Ionicons style={styles.deleteOrderItem} name="trash-outline" size={20} onPress={() => console.log(`delete ${address.name} - ${address.address}`)}/>
              </View>
            ))}
          </View>
          <View style={{ marginBottom: 30 }}>
            <Button style={{backgroundColor:"#66BB6A", borderColor: "#66BB6A", alignSelf:'flex-start', marginBottom: 25, marginRight: 20, alignSelf: 'center' }} onPress={() => console.log('Add an Address')}><Ionicons name="add-outline" size={20}/> Add an Address</Button>
          </View>
        </ScrollView>
      ) : (
        <></>
      )}
    </>
  )
}


let deviceWidth = Dimensions.get('window').width

const profileStyles = StyleSheet.create({
  addressItem: {
    backgroundColor: '#FFFFFF',
    borderColor: "#E0E0E0",
    borderWidth: 1,
    padding: 15,
    paddingRight: 40
  }
})

Profile.propTypes = {
  reroute: PropTypes.func.isRequired,
  addAddress: PropTypes.func.isRequired,
  deleteAddress: PropTypes.func.isRequired,
  getAddress: PropTypes.func.isRequired,
  updateAddressName: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {reroute, addAddress, deleteAddress, getAddress, updateAddressName, updateUser})(Profile);