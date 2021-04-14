import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import axios from 'axios';
import { GOOGLE_API_KEY, PROJECT_URL } from "@env"
import { styles } from '../common/Styles'

import { Layout, Icon, Text, Button, TopNavigationAction, Input, IndexPath, Select, SelectItem, TopNavigation, Spinner, Divider } from '@ui-kitten/components';
import { Keyboard, Animated, Easing, Dimensions, View, TouchableHighlight, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native'

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Collapsible from 'react-native-collapsible';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service'
navigator.geolocation = require('react-native-geolocation-service');

import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '../layout/Header'

import { locationGeocode, getDistance } from '../../actions/google'
import { reroute, getAddress } from '../../actions/auth'
import { getCurrentOrder } from '../../actions/logistics'


const Delivery = ({
  auth: {
    user,
    userLoading,
    isAuthenticated,
  },
  siteConfig: {
    siteInfoLoading,
    siteInfo
  },
  logistics: {
    currentOrderLoading,
    currentOrder,
  },
  seller,
  foodCartActive, setFoodCartActive,

  getCurrentOrder,
  changeQuantity,
  deleteOrderItem,
  getAddress,
  foodCheckout,
  navigation,
}) => {
  const [rendered, setRendered] = useState(false);

  const ref = useRef();
  const mapRef = useRef();

  const [riderPaymentNeeded, setRiderPaymentNeeded] = useState(false);
  const [twoWay, setTwoWay] = useState(false);
  const [vehicleChoice, setVehicleChoice] = useState('');
  
  const [firstName, setFirstName] = useState(user ? (user.first_name ? user.first_name : '') : '');
  const [lastName, setLastName] = useState(user ? (user.last_name ? user.last_name : '') : '');
  const [contact, setContact] = useState(user ? (user.contact ? user.contact : '') : '');
  const [email, setEmail] = useState(user ? (user.email ? user.email : '') : '');
  const [selectedGenderIndex, setSelectedGenderIndex] = useState(new IndexPath(0));

  const [unit, setUnit] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');

  const [description, setDescription] = useState('');
  
  // States for AutoComplete
  const [keyboardActive, setKeyboardActive] = useState('');
  const [autoCompleteText, setAutoCompleteText] = useState('');
  const [autoCompleteFocused, setAutoCompleteFocused] = useState('');

  const [modalActive, setModalActive] = useState('')
  const [modalAnim, setModalAnim] = useState(new Animated.Value(Dimensions.get('window').height))

  const [pickupAddressBook, setPickupAddressBook] = useState(true)
  const [pickupAddressId, setPickupAddressId] = useState('');
  const [pickupAddressIndex, setPickupAddressIndex] = useState(new IndexPath(0));
  const [pickupLat, setPickupLat] = useState('');
  const [pickupLng, setPickupLng] = useState('');
  const [pickupAddress, setPickupAddress] = useState("Please set a pickup address");
  
  const [deliveryAddressBook, setDeliveryAddressBook] = useState(true)
  const [deliveryAddressId, setDeliveryAddressId] = useState('');
  const [deliveryAddressIndex, setDeliveryAddressIndex] = useState(new IndexPath(0));
  const [deliveryLat, setDeliveryLat] = useState('');
  const [deliveryLng, setDeliveryLng] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('Please set a delivery address');

  const [delivery, setDelivery] = useState('');
  const [distanceText, setDistanceText] = useState("");
  const [distanceValue, setDistanceValue] = useState("");
  const [durationText, setDurationText] = useState("");
  const [durationValue, setDurationValue] = useState("");

  // const [promoCode, setPromoCode] = useState('');
  // const [promoCodeSet, setPromoCodeSet] = useState(false);

  const [personalDetailsActivated, setPersonalDetailsActivated] = useState(false)

  const addressSelected = async ({ mode }) => {
    const addressInfo = await getAddress(mode === 'pickup' ? pickupAddressId : deliveryAddressId)
    if (mode === 'pickup') {
      setPickupLat(addressInfo.latitude)
      setPickupLng(addressInfo.longitude)
      setPickupAddress(addressInfo.address)
      if (deliveryLat && deliveryLng) {
        const origin = `${addressInfo.latitude},${addressInfo.longitude}`;
        const destination = `${deliveryLat},${deliveryLng}`;
        const res = await getDistance({ origin, destination })
        setDistanceText(res.data.distanceText);
        setDistanceValue(res.data.distanceValue);
        setDurationText(res.data.durationText);
        setDurationValue(res.data.durationValue);

        let perKmTotal = Math.round((parseInt(res.data.distanceValue)/1000)*siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].per_km_price)
        let total = siteInfo.shipping_base+perKmTotal
        setDelivery(Math.round(total))
      }
    } else if (mode === 'delivery') {
      setDeliveryLat(addressInfo.latitude)
      setDeliveryLng(addressInfo.longitude)
      setDeliveryAddress(addressInfo.address)
      if (pickupLat && pickupLng) {
        const origin = `${pickupLat},${pickupLng}`;
        const destination = `${addressInfo.latitude},${addressInfo.longitude}`;
        const res = await getDistance({ origin, destination })
        setDistanceText(res.data.distanceText);
        setDistanceValue(res.data.distanceValue);
        setDurationText(res.data.durationText);
        setDurationValue(res.data.durationValue);

        let perKmTotal = Math.round((parseInt(res.data.distanceValue)/1000)*siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].per_km_price)
        let total = siteInfo.shipping_base+perKmTotal
        setDelivery(Math.round(total))
      }
    }
    return async() => {
      if (mode === 'pickup') {
        setPickupLat(addressInfo.latitude)
        setPickupLng(addressInfo.longitude)
        setPickupAddress(addressInfo.address)
        if (deliveryLat && deliveryLng) {
          const origin = `${addressInfo.latitude},${addressInfo.longitude}`;
          const destination = `${deliveryLat},${deliveryLng}`;
          const res = await getDistance({ origin, destination })
          setDistanceText(res.data.distanceText);
          setDistanceValue(res.data.distanceValue);
          setDurationText(res.data.durationText);
          setDurationValue(res.data.durationValue);
  
          let perKmTotal = Math.round((parseInt(res.data.distanceValue)/1000)*siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].per_km_price)
          let total = siteInfo.shipping_base+perKmTotal
          setDelivery(Math.round(total))
        }
      } else if (mode === 'delivery') {
        setDeliveryLat(addressInfo.latitude)
        setDeliveryLng(addressInfo.longitude)
        setDeliveryAddress(addressInfo.address)
        if (pickupLat && pickupLng) {
          const origin = `${pickupLat},${pickupLng}`;
          const destination = `${addressInfo.latitude},${addressInfo.longitude}`;
          const res = await getDistance({ origin, destination })
          setDistanceText(res.data.distanceText);
          setDistanceValue(res.data.distanceValue);
          setDurationText(res.data.durationText);
          setDurationValue(res.data.durationValue);
  
          let perKmTotal = Math.round((parseInt(res.data.distanceValue)/1000)*siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].per_km_price)
          let total = siteInfo.shipping_base+perKmTotal
          setDelivery(Math.round(total))
        }
      }
    }
  }

  const mapClicked = async ({mode, lat, lng}) => {
    if ((mode === 'pickup' && deliveryLat && deliveryLng) || (mode === 'delivery' && pickupLat && pickupLng)) {
      const origin = `${mode === 'pickup' ? lat : pickupLat},${mode === 'pickup' ? lng : pickupLng}`;
      const destination = `${mode === 'delivery' ? lat : deliveryLat},${mode === 'delivery' ? lng : deliveryLng}`;
      const res = await getDistance({ origin, destination })
      setDistanceText(res.data.distanceText);
      setDistanceValue(res.data.distanceValue);
      setDurationText(res.data.durationText);
      setDurationValue(res.data.durationValue);

      let perKmTotal = Math.round((parseInt(res.data.distanceValue)/1000)*siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].per_km_price)
      let total = siteInfo.shipping_base+perKmTotal
      setDelivery(Math.round(total))
    }
  }
  
  useEffect(() => {
    if (pickupAddressIndex.row > 0) {
      user.addresses.forEach((address, index) => {
        if (index == pickupAddressIndex.row-1) {
          setPickupAddressId(address.id)
        }
      })
    } else {
      if (modalActive !== 'pickup' && modalActive !== 'delivery') {
        setPickupAddressId('')
        setPickupLat('')
        setPickupLng('')
        setPickupAddress('')
        setDistanceText('');
        setDistanceValue('');
        setDurationText('');
        setDurationValue('');
        setDelivery('')
      }
    }
    return () => {
      if (pickupAddressIndex.row > 0) {
        user.addresses.forEach((address, index) => {
          if (index == pickupAddressIndex.row-1) {
            setPickupAddressId(address.id)
          }
        })
      } else {
        setPickupAddressId('')
        setPickupLat('')
        setPickupLng('')
        setPickupAddress('')
        setDistanceText('');
        setDistanceValue('');
        setDurationText('');
        setDurationValue('');
        setDelivery('')
      }
    }
  }, [pickupAddressIndex])
  useEffect(() => {
    if (pickupAddressId) {
      addressSelected({mode:'pickup'})
    }
    return () => {
      if (pickupAddressId) {
        addressSelected({mode:'pickup'})
      }
    }
  }, [pickupAddressId]);

  useEffect(() => {
    if(deliveryAddressIndex.row > 0) {
      user.addresses.forEach((address, index) => {
      if (index == deliveryAddressIndex.row-1) {
        setDeliveryAddressId(address.id)
      }})
    } else {
      if (modalActive !== 'pickup' && modalActive !== 'delivery') {
        console.log('clear delivery')
        setDeliveryAddressId('')
        setDeliveryLat('')
        setDeliveryLng('')
        setDeliveryAddress('')
        setDistanceText('');
        setDistanceValue('');
        setDurationText('');
        setDurationValue('');
        setDelivery('')
      }
    }
    return () => {
      if(deliveryAddressIndex.row > 0) {
        user.addresses.forEach((address, index) => {
        if (index == deliveryAddressIndex.row-1) {
          setDeliveryAddressId(address.id)
        }})
      } else {
        setDeliveryAddressId('')
        setDeliveryLat('')
        setDeliveryLng('')
        setDeliveryAddress('')
        setDistanceText('');
        setDistanceValue('');
        setDurationText('');
        setDurationValue('');
        setDelivery('')
      }
    }
  }, [deliveryAddressIndex])
  useEffect(() => {
    if (deliveryAddressId) {
      addressSelected({mode:'delivery'})
    }
    return () => {
      if (deliveryAddressId) {
        addressSelected({mode:'delivery'})
      }
    }
  }, [deliveryAddressId]);
  
  useEffect(() => {
    if (modalActive) {
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
  }, [modalAnim, modalActive])

  useEffect(() => {
    if (!userLoading && isAuthenticated) {
      getCurrentOrder({
        type: 'delivery',
      })
    }
  }, [userLoading, isAuthenticated]);

  useEffect(() => {
    if (!siteInfoLoading) {
      setVehicleChoice(siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].id)
    }
    return () => {
      if (!siteInfoLoading) {
        setVehicleChoice(siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].id)
      }
    }
  }, [siteInfoLoading])
  
  useEffect(() => {
    if (!currentOrderLoading && currentOrder !== null) {
      setDescription(currentOrder.description ? currentOrder.description : "")
    }
    return () => {
      if (!currentOrderLoading && currentOrder !== null) {
        setDescription(currentOrder.description ? currentOrder.description : "")
      }
    }
  }, [currentOrderLoading]);


  useEffect(() => {
    reroute({
      navigation,
      type: 'private',
      userLoading,
      isAuthenticated
    })
  }, [userLoading]);

  useEffect(() => {
    mapRef.current?.setMapBoundaries(
      { latitude: 14.064176315019349, longitude: 121.7682355093625 },
      { latitude: 13.87847842331748, longitude: 121.39448686001403 }
    );
    Keyboard.addListener('keyboardDidShow', () => setKeyboardActive(true));
    Keyboard.addListener('keyboardDidHide', () => setKeyboardActive(false));
    setRendered(true)
  
    return () => {
      mapRef.current?.setMapBoundaries(
        { latitude: 14.064176315019349, longitude: 121.7682355093625 },
        { latitude: 13.87847842331748, longitude: 121.39448686001403 }
      );
      Keyboard.removeListener('keyboardDidShow', () => setKeyboardActive(true))
      Keyboard.removeListener('keyboardDidHide', () => setKeyboardActive(false))
      setRendered(true)
    }
  }, [])

  return (
    isAuthenticated && !user.groups.includes('rider') && (
      !currentOrderLoading && currentOrder !== null && rendered && (
        currentOrder.order_type === 'delivery' && (
          <Layout level="1" style={{flex: 1}}>
            <Header subtitle='Delivery' sideMenu={true}/>
            <ScrollView>
              <View style={styles.collapsibleWrapper}>
                <View style={[styles.collapsibleHeader, { flexDirection: 'column' }]}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={deliveryStyles.deliveryPrompt}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text category="h6" style={[ deliveryStyles.promptTitle ]}>Set Up Pickup</Text>
                      </View>
                      <Text style={[styles.mute, styles.small]}>Select or search where you want your parcel to be picked up</Text>
                    </View>
                    <View style={deliveryStyles.deliveryButtons}>
                      <Button
                        style={[deliveryStyles.deliveryButton]}
                        size='small'
                        appearance='outline'
                        status='info'
                        onPress={() => setModalActive('pickup')}
                      >
                        <Ionicons name={"location"} size={14}/> Search Pickup
                      </Button>
                    </View>
                  </View>
                  <Text style={[styles.mute, styles.small, styles.inputSummary, {marginTop:20}]}>
                    <Text style={[{fontFamily:'Lato-Bold'}, styles.small]}>Pickup Address: </Text>
                    {pickupAddress}
                  </Text>
                </View>
                <TouchableHighlight onPress={() => {
                  setPickupAddressBook(!pickupAddressBook)
                }}>
                  <View style={[styles.collapsibleContent, styles.collapsibleHeader]}>
                    <Text category="h6" style={[styles.small, styles.mute, { fontFamily: 'Lato-Bold' }]}>Select from address book</Text>
                    <Ionicons name={pickupAddressBook ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                  </View>
                </TouchableHighlight>
                <Collapsible collapsed={pickupAddressBook} duration={150} align="center">
                  <View style={[styles.collapsibleContent]}>
                    <Select
                      value={pickupAddressIndex.row > 0 ? user.addresses[pickupAddressIndex.row-1].name : '-Select an Address-'}
                      selectedIndex={pickupAddressIndex}
                      style={{ backgroundColor: 'white' }}
                      onSelect={index => setPickupAddressIndex(index)}>
                      <SelectItem title='-Select an Address-'/>
                      {user && (
                        user.addresses.map(address => (
                          <SelectItem key={address.id} title={address.name ? address.name : `Unnamed Address: ${address.address}`}/>
                        ))
                      )}
                    </Select>
                  </View>
                </Collapsible>
              </View>

              <View style={styles.collapsibleWrapper}>
                <View style={[styles.collapsibleHeader, { flexDirection: 'column' }]}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={deliveryStyles.deliveryPrompt}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text category="h6" style={[ deliveryStyles.promptTitle ]}>Set Up Delivery</Text>
                      </View>
                      <Text style={[styles.mute, styles.small]}>Select or search where you want your parcel delivered</Text>
                    </View>
                    <View style={deliveryStyles.deliveryButtons}>
                      <Button
                        style={[deliveryStyles.deliveryButton]}
                        size='small'
                        appearance='outline'
                        status='info'
                        onPress={() => setModalActive('delivery')}
                      >
                        <Ionicons name={"location"} size={14}/> Search Delivery
                      </Button>
                    </View>
                  </View>
                  <Text style={[styles.mute, styles.small, styles.inputSummary, {marginTop:20}]}>
                    <Text style={[{fontFamily:'Lato-Bold'}, styles.small]}>Delivery Address: </Text>
                    {deliveryAddress}
                  </Text>
                </View>
                <TouchableHighlight onPress={() => {
                  setDeliveryAddressBook(!deliveryAddressBook)
                }}>
                  <View style={[styles.collapsibleContent, styles.collapsibleHeader]}>
                    <Text category="h6" style={[styles.small, styles.mute, { fontFamily: 'Lato-Bold' }]}>Select from address book</Text>
                    <Ionicons name={deliveryAddressBook ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                  </View>
                </TouchableHighlight>
                <Collapsible collapsed={deliveryAddressBook} duration={150} align="center">
                  <View style={[styles.collapsibleContent]}>
                    <Select
                      value={deliveryAddressIndex.row > 0 ? user.addresses[deliveryAddressIndex.row-1].name : '-Select an Address-'}
                      selectedIndex={deliveryAddressIndex}
                      style={{ backgroundColor: 'white' }}
                      onSelect={index => setDeliveryAddressIndex(index)}>
                      <SelectItem title='-Select an Address-'/>
                      {user && (
                        user.addresses.map(address => (
                          <SelectItem key={address.id} title={address.name ? address.name : `Unnamed Address: ${address.address}`}/>
                        ))
                      )}
                    </Select>
                  </View>
                </Collapsible>
              </View>
              
              <View style={[styles.collapsibleWrapper]}>
                <TouchableHighlight onPress={() => {
                  setPersonalDetailsActivated(!personalDetailsActivated)
                  // if (personalDetailsActivated) {
                  //   setDeliveryDetailsActivated(true)
                  // }
                }}>
                  <View style={styles.collapsibleHeader}>
                    <Text category="h6" style={{ fontSize: 16, fontFamily: 'Lato-Bold' }}>Personal Details</Text>
                    <Ionicons name={personalDetailsActivated ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                  </View>
                </TouchableHighlight>
                <Collapsible collapsed={personalDetailsActivated} duration={150} align="center">
                  <View style={[styles.collapsibleContent, {borderBottomWidth: 0}]}>
                    <Input
                      value={firstName}
                      label='First Name'
                      placeholder='Enter Your First Name'
                      onChangeText={nextValue => setFirstName(nextValue)}
                      style={{ backgroundColor: 'white'}}
                    />
                    <Input
                      value={lastName}
                      label='Last Name'
                      placeholder='Enter Your Last Name'
                      onChangeText={nextValue => setLastName(nextValue)}
                      style={{ backgroundColor: 'white'}}
                    />
                    <Input
                      value={contact}
                      label='Contact Number'
                      placeholder='Enter Your Contact Number'
                      onChangeText={nextValue => setContact(nextValue)}
                      style={{ backgroundColor: 'white'}}
                    />
                    <Input
                      value={email}
                      label='Email'
                      placeholder='Enter Your Email'
                      onChangeText={nextValue => setEmail(nextValue)}
                      style={{ backgroundColor: 'white'}}
                    />
                    <Select
                      value={selectedGenderIndex.row == 0 ? 'Male' : 'Female'}
                      selectedIndex={selectedGenderIndex}
                      style={{ backgroundColor: 'white'}}
                      label='Gender'
                      onSelect={index => setSelectedGenderIndex(index)}>
                      <SelectItem title='Male'/>
                      <SelectItem title='Female'/>
                    </Select>
                  </View>
                </Collapsible>
              </View>
              <View style={[styles.collapsibleWrapper]}>
                <View style={[styles.collapsibleContent, {marginBottom: 100, borderWidth: 0}]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <Text style={[styles.mute, { fontSize: 14 }]}>Delivery</Text>
                    <Text>{delivery ? `₱${delivery.toFixed(2)}` : '₱0.00' }</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <Text style={[styles.mute, { fontSize: 14 }]}>Promo discount</Text>
                    {/* <Text>{delivery ? `-₱${delivery.toFixed(2)}` : '-0.00' }</Text> */}
                    <Text>- ₱0.00</Text>
                  </View>
                  <Divider/>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 }}>
                    <Text style={[styles.mute]}>Subtotal</Text>
                    {/* <Text>{delivery ? `-₱${delivery.toFixed(2)}` : '-0.00' }</Text> */}
                    <Text style={{ fontFamily: 'Lato-Black', fontSize: 20 }}>{delivery ? `₱${delivery.toFixed(2)}` : '₱0.00' }</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            <Button
              style={[ styles.hoverButton ]}
              disabled={!vehicleChoice || !delivery || !lastName || !firstName || !contact || !email ? true : false}
              onPress={() => console.log('Food Checkout')}
              status="success"
            >
              Confirm Booking
            </Button>
            <Text style={[deliveryStyles.checkoutFloatText, {fontFamily: 'Lato-Bold'}]}>{ !vehicleChoice || !delivery || !lastName || !firstName || !contact || !email ? '' : `₱${(parseFloat(currentOrder.subtotal)+parseFloat(delivery)).toFixed(2)}` }</Text>
            <Animated.View style={[styles.superModal, { top: modalAnim, height: Dimensions.get('window').height-80  }]}>
              <TopNavigation
                accessoryLeft={() => <TopNavigationAction onPress={() => setModalActive('')} icon={props => <Icon {...props} name='arrow-back'/>}/>}
                title={`Add address`}
              />
              <GooglePlacesAutocomplete
                ref={ref}
                placeholder='Search'
                onPress={async (data) => {
                  const res = await locationGeocode({ placeId: data.place_id })
                  const lat = res.data.geometry.location.lat
                  const lng = res.data.geometry.location.lng
                  if (modalActive === 'pickup') {
                    setPickupLat(lat)
                    setPickupLng(lng)
                    setPickupAddress(res.data.formatted_address)
                    mapClicked({ mode: 'pickup', lat, lng })
                  } else if (modalActive === 'delivery') {
                    setDeliveryLat(lat)
                    setDeliveryLng(lng)
                    setDeliveryAddress(res.data.formatted_address)
                    mapClicked({ mode: 'delivery', lat, lng })
                  }
                  setAutoCompleteText(res.data.formatted_address)
                  ref.current?.setAddressText(res.data.formatted_address)
                  ref.current?.blur()
                }}
                query={{
                  key: GOOGLE_API_KEY,
                  language: 'en',
                  components: 'country:ph',
                  location: "13.946958175958924, 121.61064815344236",
                  radius: "15000",
                  strictbounds: true,
                }}
                textInputProps={{
                  onFocus: () => setAutoCompleteFocused(true),
                  onBlur: () => setAutoCompleteFocused(false),
                  onChangeText: e => setAutoCompleteText(e)
                }}
                // currentLocation={true}
                // currentLocationLabel='My Current Location'
                styles={{
                  container: {
                    maxHeight: keyboardActive && autoCompleteFocused && autoCompleteText.length >= 1 ? null : 50,
                    borderTopWidth: 1,
                    borderRadius: 0,
                    borderColor: "#E7EAED",
                  },
                  textInputContainer: {
                    paddingRight: 35
                  },
                  textInput: {
                    height: 45,
                    color: '#5d5d5d',
                    fontSize: 16,
                    borderRadius: 0,
                  },
                  listView: {
                    position: 'absolute',
                    top: 45,
                    left: 0,
                    border: 0,
                    backgroundColor: 'grey',
                  }
                  
                }}
              >
                <Ionicons name="close-circle" size={22} color={'#ECECEC'} style={{ position: 'absolute', zIndex: 9, right: 12, top: 12 }} onPress={() => {ref.current?.setAddressText(''), setAutoCompleteText('')}}/>
              </GooglePlacesAutocomplete>
              
              <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                initialRegion={{
                  latitude: 13.946958175958924,
                  longitude: 121.61064815344236,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                }}
                loadingEnabled={true}
                minZoomLevel={13}
                maxZoomLevel={20}
                // customMapStyle={['c90416c7434e6e52']}
                onPress={async e => {
                  const lat = e.nativeEvent.coordinate.latitude
                  const lng = e.nativeEvent.coordinate.longitude
                  const res = await locationGeocode({ latLng: { lat, lng } })
                  if (modalActive === 'pickup') {
                    setPickupLat(lat)
                    setPickupLng(lng)
                    setPickupAddress(res.data.formatted_address)
                    mapClicked({ mode: 'pickup', lat, lng })
                  } else if (modalActive === 'delivery') {
                    setDeliveryLat(lat)
                    setDeliveryLng(lng)
                    setDeliveryAddress(res.data.formatted_address)
                    mapClicked({ mode: 'delivery', lat, lng })
                  }
                  setAutoCompleteText(res.data.formatted_address)
                  ref.current?.setAddressText(res.data.formatted_address)
                  ref.current?.blur()
                }}
              >
                {pickupLat && pickupLng ? (
                  <Marker
                    pinColor={'#1C8DFF'}
                    onDragEnd={async e => {
                      const lat = e.nativeEvent.coordinate.latitude
                      const lng = e.nativeEvent.coordinate.longitude
                      const res = await locationGeocode({ latLng: { lat, lng } })
                      setPickupLat(lat)
                      setPickupLng(lng)
                      setPickupAddress(res.data.formatted_address)
                      mapClicked({ mode: 'pickup', lat, lng })
                      setAutoCompleteText(res.data.formatted_address)
                      ref.current?.setAddressText(res.data.formatted_address)
                      ref.current?.blur()
                    }}
                    draggable
                    coordinate={{ latitude: parseFloat(pickupLat), longitude: parseFloat(pickupLng) }}
                    title={ 'Delivery' }
                  />
                ) : (
                  <></>
                )}
                {deliveryLat && deliveryLng ? (
                  <Marker
                    pinColor={'#3DAC4C'}
                    onDragEnd={async e => {
                      const lat = e.nativeEvent.coordinate.latitude
                      const lng = e.nativeEvent.coordinate.longitude
                      const res = await locationGeocode({ latLng: { lat, lng } })
                      setDeliveryLat(lat)
                      setDeliveryLng(lng)
                      setDeliveryAddress(res.data.formatted_address)
                      mapClicked({ mode: 'delivery', lat, lng })
                      setAutoCompleteText(res.data.formatted_address)
                      ref.current?.setAddressText(res.data.formatted_address)
                      ref.current?.blur()
                    }}
                    draggable
                    coordinate={{ latitude: parseFloat(deliveryLat), longitude: parseFloat(deliveryLng) }}
                    title={ 'Delivery' }
                  />
                ) : (
                  <></>
                )}
              </MapView>
              <Button
                style={ styles.hoverButton }
                // disabled={!deliveryLat || !deliveryLng ? true : false}
                onPress={() => setModalActive('')}
                status="info"
              >
                DONE
              </Button>
            </Animated.View>
          </Layout>
        )
      )
    )
  )
}


let deviceWidth = Dimensions.get('window').width

const deliveryStyles = StyleSheet.create({
  promptTitle: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    marginBottom: 5,
  },
  deliveryPrompt: {
    width: (deviceWidth*.55)-20
  },
  deliveryButtons: {
    width: (deviceWidth*.45)-20,
    justifyContent: 'center'
  },
  deliveryButton: {
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  checkoutFloatText: {
    position: 'absolute',
    color: 'white',
    bottom: 25,
    right: 58,
    zIndex: 10
  },
})

Delivery.propTypes = {
  getCurrentOrder: PropTypes.func.isRequired,
  getAddress: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getCurrentOrder, getAddress })(Delivery);