import React, { useEffect, useState, Fragment } from 'react';

import { connect } from 'react-redux';
import axios from 'axios';
// import PropTypes from 'prop-types'

import { Icon, Text, Button, Spinner, Input, Modal, Card, Select, SelectItem, Divider, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Animated, Easing, Dimensions, View, StyleSheet, ScrollView } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import { GOOGLE_API_KEY } from "@env"

import { v4 as uuid } from 'uuid'

import Header from '../layout/Header'

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

  const [editingProfile, setEditingProfile] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  
  const [searchBox, setSearchBox] = useState(''); 
  
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [addressName, setAddressName] = useState('');
  const [addressNameModal, setAddressNameModal] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedAddressName, setSelectedAddressName] = useState('');

  const [firstName, setFirstName] = useState(user ? (user.first_name ? user.first_name : '') : '');
  const [lastName, setLastName] = useState(user ? (user.last_name ? user.last_name : '') : '');
  const [contact, setContact] = useState(user ? (user.contact ? user.contact : '') : '');
  const [gender, setGender] = useState(user ? (user.gender ? user.gender : '') : '');

  const [modalAnim, setModalAnim] = useState(new Animated.Value(Dimensions.get('window').height))
  const [addressmodalActive, setAddressmodalActive] = useState(false)
  
  const locationGeocode = async (latLng) => {
    console.log(latLng)
    try {
      const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&key=${GOOGLE_API_KEY}`)
      
      for (let i=0; i < res.data.results.length; i++) {
        console.log(res.data.results[i].formatted_address)
        if (!res.data.results[i].formatted_address.includes('Unnamed Road')) {
          setAddress(res.data.results[i].formatted_address)
          break
        }
      }
    } catch (err) {
      console.log('error', err.data)
    }
  }

  const addNewAddress = async () => {
    setUpdatingUser(true)
    const body = {
      user: user.id,
      latitude,
      longitude,
      address,
      name: addressName
    }
    await addAddress(body)
    setAddressmodalActive(false)
    setUpdatingUser(false)
  }
  const deleteAddressPressed = async (id) => {
    setUpdatingUser(true)
    await deleteAddress(id)
    setUpdatingUser(false)
  }
  const addressSelected = async (id) => {
    const address = await getAddress(id)
    setSelectedAddress(address)
    setSelectedAddressName(address.name ? address.name : '')
    setAddressNameModal(true)
  }
  const saveAddressChanges = async () => {
    setUpdatingUser(true)
    const body = {
      id: selectedAddress.id,
      user: selectedAddress.user,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      address: selectedAddress.address,
      name: selectedAddressName
    }
    setAddressNameModal(false)
    await updateAddressName(body)
    setUpdatingUser(false)
  }

  const saveUserChanges = async () => {
    setUpdatingUser(true)
    const body = {
      username: user.username,
      first_name: firstName,
      last_name: lastName,
      contact: contact,
      gender: gender
    }
    await updateUser(body)
    setEditingProfile(false)
    setUpdatingUser(false)
  }
  
  const cancelEditing = () => {
    setFirstName(user.first_name)
    setLastName(user.last_name)
    setContact(user.contact)
    setGender(user.gender)
    setEditingProfile(false)
  }
  
  useEffect(() => {
    if (addressmodalActive) {
      Animated.timing(
        modalAnim,
        {
          toValue: 0,
          duration: 400,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
    } else {
      Animated.timing(
        modalAnim,
        {
          toValue: Dimensions.get('window').height,
          duration: 400,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
    }
  }, [modalAnim, addressmodalActive])

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
      {userLoading || updatingUser && (
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
          <Spinner size='large'/>
        </View>
      )}
      {isAuthenticated && user ? (
        <>
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
                    <FontAwesome name='edit' size={22} color={"#03A9F4"} onPress={() => addressSelected(address.id)}/>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '500' }}>{address.address}</Text>
                  <Ionicons style={styles.deleteOrderItem} name="trash-outline" size={20} onPress={() => deleteAddressPressed(address.id)}/>
                </View>
              ))}
            </View>
            <View style={{ marginBottom: 30 }}>
              <Button style={{ backgroundColor:"#66BB6A", borderColor: "#66BB6A", alignSelf:'flex-start', marginBottom: 25, marginRight: 20, alignSelf: 'center', flexDirection: 'row', justifyContent: 'center' }} onPress={() => setAddressmodalActive(true)}><Ionicons name="add-outline" size={22}/> <Text style={{fontSize: 18, color: '#ffffff', fontWeight: '700' }}>Add an Address</Text></Button>
            </View>
          </ScrollView>
          
          <Animated.View style={[styles.superModal, { top: modalAnim }]}>
            <>
              <TopNavigation
                accessoryLeft={() => <TopNavigationAction onPress={() => setAddressmodalActive(false)} icon={props => <Icon {...props} name='arrow-back'/>}/>}
                title={`Add address`}
              />
              <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                initialRegion={{
                  latitude: 13.946958175958924,
                  longitude: 121.61064815344236,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                }}
                customMapStyle={['c90416c7434e6e52']}
                onPress={e => {
                  let lat = e.nativeEvent.coordinate.latitude
                  let lng = e.nativeEvent.coordinate.longitude
                  locationGeocode({ lat, lng })
                  setLatitude(lat)
                  setLongitude(lng)
                }}
              >
                <Marker
                  // pinColor={'blue'}
                  draggable
                  coordinate={{ latitude: 13.946958175958924, longitude: 121.61064815344236 }}
                  title={ 'Delivery' }
                />
              </MapView>
              <Button
                // style={profileModalStyles.checkoutButton}
                // disabled={currentOrder.count < 1 || address === '' || !delivery || !lastName || !firstName || !contact || !email ? true : false}
                onPress={() => addNewAddress(false)}
              >
                ADD ADDRESS
              </Button>
            </>
          </Animated.View>
          <Modal
            visible={addressNameModal}
            backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onBackdropPress={() => setAddressNameModal(false)}
            style={{ marginRight: 50, zIndex: 10 }}>
            <Card disabled={true}>
              <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: '700', padding: 15, backgroundColor: '#EDF0F6' }}>{selectedAddress.address}</Text>
              <Input
                value={selectedAddressName}
                label='What would you like to call this address?'
                placeholder='Address Name'
                disabled={addressNameModal ? false : true}
                onChangeText={nextValue => setSelectedAddressName(nextValue)}
                style={{ flex: 1, marginBottom: 40 }}
              />
              <Button style={{ backgroundColor: '#66BB6A', borderColor: '#66BB6A' }}onPress={() => saveAddressChanges(false)}>
                Update Address
              </Button>
            </Card>
          </Modal>
        </>
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

// Profile.propTypes = {
//   reroute: PropTypes.func.isRequired,
//   addAddress: PropTypes.func.isRequired,
//   deleteAddress: PropTypes.func.isRequired,
//   getAddress: PropTypes.func.isRequired,
//   updateAddressName: PropTypes.func.isRequired,
//   updateUser: PropTypes.func.isRequired,
// }

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {reroute, addAddress, deleteAddress, getAddress, updateAddressName, updateUser})(Profile);