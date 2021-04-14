import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import axios from 'axios';
import { GOOGLE_API_KEY, PROJECT_URL } from "@env"

import { Icon, Text, Button, TopNavigationAction, Input, IndexPath, Select, SelectItem, TopNavigation, Spinner } from '@ui-kitten/components';
import { Animated, Easing, Dimensions, View, TouchableHighlight, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native'

import Collapsible from 'react-native-collapsible';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../common/Styles'

import { getDistance } from '../../actions/google'
import { getAddress } from '../../actions/auth'
import { getCurrentOrder, deleteOrderItem, foodCheckout, changeQuantity } from '../../actions/logistics'

const FoodCart = ({
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

    productLoading,

    quantityLoading,
    deleteLoading,
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
  const [delivery, setDelivery] = useState("");

  const [firstName, setFirstName] = useState(user ? (user.first_name ? user.first_name : '') : '');
  const [lastName, setLastName] = useState(user ? (user.last_name ? user.last_name : '') : '');
  const [contact, setContact] = useState(user ? (user.contact ? user.contact : '') : '');
  const [email, setEmail] = useState(user ? (user.email ? user.email : '') : '');

  const [selectedGenderIndex, setSelectedGenderIndex] = useState(new IndexPath(0));

  const [pickupLat, setPickupLat] = useState('');
  const [pickupLng, setPickupLng] = useState('');
  const [pickupAddress, setPickupAddress] = useState("Please set a pickup address");
  const [deliveryLat, setDeliveryLat] = useState('');
  const [deliveryLng, setDeliveryLng] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState("Please set a delivery address");

  const [distanceText, setDistanceText] = useState("");
  const [distanceValue, setDistanceValue] = useState("");
  const [durationText, setDurationText] = useState("");
  const [durationValue, setDurationValue] = useState("");
  
  const [description, setDescription] = useState('');

  const [personalDetailsActivated, setPersonalDetailsActivated] = useState(false)
  const [addressDetailsActivated, setAddressDetailsActivated] = useState(false)

  const [deliveryAddressId, setDeliveryAddressId] = useState('');
  const [deliveryAddressIndex, setDeliveryAddressIndex] = useState(new IndexPath(0));


  const [modalAnim, setModalAnim] = useState(new Animated.Value(Dimensions.get('window').height))
  useEffect(() => {
    if (foodCartActive) {
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
  }, [modalAnim, foodCartActive])

  const proceedToPayments = async () => {
    if(currentOrder.count < 1 && deliveryAddressId === '' && !delivery && !lastName && !firstName && !contact && !email ? false : true) {
      const formData = {
        vehicleChoice: siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].id,
        firstName, lastName, contact, email,
        gender: selectedGenderIndex === 0 ? 'male' : 'female',
        pickupLat, pickupLng, pickupAddress,
        deliveryLat, deliveryLng, deliveryAddress,
        distanceText, distanceValue, durationText, durationValue,
        description
      }
      await foodCheckout({
        formData,
        navigation: navigation,
        orderSeller: seller
      })
    }
  }
  
  const addressSelected = async () => {
    const addressInfo = await getAddress(deliveryAddressId)
    const origin = `${pickupLat},${pickupLng}`;
    const destination = `${addressInfo.latitude},${addressInfo.longitude}`;
    const res = await getDistance({ origin, destination })

    setDeliveryLat(addressInfo.latitude)
    setDeliveryLng(addressInfo.longitude)
    setDeliveryAddress(addressInfo.address)
    setDistanceText(res.data.distanceText);
    setDistanceValue(res.data.distanceValue);
    setDurationText(res.data.durationText);
    setDurationValue(res.data.durationValue);

    let perKmTotal = Math.round((parseInt(res.data.distanceValue)/1000)*siteInfo.vehicles.filter(vehicle => vehicle.name === 'motorcycle')[0].per_km_price)
    let total = siteInfo.shipping_base+perKmTotal
    setDelivery(Math.round(total))
  }

  useEffect(() => {
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
  }, [deliveryAddressIndex])
  useEffect(() => {
    if (deliveryAddressId) {
      addressSelected()
    }
  }, [deliveryAddressId]);

  useEffect(() => {
    if (!userLoading && isAuthenticated) {
      getCurrentOrder({
        type: 'food',
        query: `?order_seller=${seller.id}`
      })
      setPickupLat(seller.latitude)
      setPickupLng(seller.longitude)
      setPickupAddress(seller.address)
    }
    return () => {
      if (!userLoading && isAuthenticated) {
        getCurrentOrder({
          type: 'food',
          query: `?order_seller=${seller.id}`
        })
        setPickupLat(seller.latitude)
        setPickupLng(seller.longitude)
        setPickupAddress(seller.address)
      }
    }
  }, [userLoading, isAuthenticated]);
  
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
  
  return (
    isAuthenticated && !user.groups.includes('rider') && (
      !currentOrderLoading && currentOrder !== null && (
        currentOrder.order_type === 'food' && (
          currentOrder.order_items.length > 0 ? (
            <Animated.View style={[styles.superModal, { top: modalAnim }]}>
              <TopNavigation
                accessoryLeft={() => <TopNavigationAction onPress={() => setFoodCartActive(false)} icon={props => <Icon {...props} name='arrow-back'/>}/>}
                title={`My Order - ${seller.name}`}
              />
              <ScrollView>
                <View style={styles.collapsibleWrapper}>
                  <TouchableHighlight onPress={() => setPersonalDetailsActivated(!personalDetailsActivated)}>
                    <View style={styles.collapsibleHeader}>
                      <Text category="h6" style={{ fontSize: 16, fontFamily: 'Lato-Bold' }}>Personal Details</Text>
                      <Ionicons name={!personalDetailsActivated ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                    </View>
                  </TouchableHighlight>
                  <Collapsible collapsed={!personalDetailsActivated} duration={150} align="center">
                    <View style={styles.collapsibleContent}>
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

                <View style={styles.collapsibleWrapper}>
                  <TouchableHighlight onPress={() => setAddressDetailsActivated(!addressDetailsActivated)}>
                    <View style={styles.collapsibleHeader}>
                      <Text category="h6" style={{ fontSize: 16, fontFamily: 'Lato-Bold' }}>Delivery Details</Text>
                      <Ionicons name={addressDetailsActivated ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                    </View>
                  </TouchableHighlight>
                  <Collapsible collapsed={addressDetailsActivated} duration={150} align="center">
                    <View style={styles.collapsibleContent}>
                      <Select
                        value={deliveryAddressIndex.row > 0 ? user.addresses[deliveryAddressIndex.row-1].name : '-Select an Address-'}
                        selectedIndex={deliveryAddressIndex}
                        style={{ backgroundColor: 'white'}}
                        onSelect={index => setDeliveryAddressIndex(index)}>
                        <SelectItem title='-Select an Address-'/>
                        {user && user.addresses.map(address => (
                          <SelectItem key={address.id} title={address.name ? address.name : `Unnamed Address: ${address.address}`}/>
                        ))}
                      </Select>
                      {delivery && deliveryAddressId ? (
                        <View style={[{ marginLeft: 5 }]}>
                          <Text style={[{ fontFamily: 'Lato-Bold', marginTop: 5 }]}>₱ {delivery.toFixed(2)} <Text style={[styles.mute, styles.small, { marginTop: 5 }]}>Delivery</Text></Text>
                          <Text style={[styles.mute, styles.small, { marginTop: 5 }]}>{deliveryAddressIndex.row > 0 ? user.addresses[deliveryAddressIndex.row-1].address : 'No address selected'}</Text>
                        </View>
                      ): (
                        <View style={[{ marginLeft: 5 }]}>
                          <Text style={[styles.mute, { fontFamily: 'Lato-Bold', marginTop: 5 }]}>-</Text>
                          <Text style={[styles.mute, styles.small, { marginTop: 5 }]}>{deliveryAddressIndex.row > 0 ? user.addresses[deliveryAddressIndex.row-1].address : 'No address selected'}</Text>
                        </View>
                      )}
                      <Input
                        value={description}
                        label='Order Notes'
                        multiline={true}
                        textStyle={{ minHeight: 85, textAlignVertical : 'top' }}
                        placeholder='Leave us some notes'
                        onChangeText={nextValue => setDescription(nextValue)}
                        style={{ backgroundColor: 'white', marginTop: 10 }}
                      />
                    </View>
                  </Collapsible>
                </View>

                <View style={[styles.collapsibleWrapper, { backgroundColor: 'white', padding: 10 }]}>
                  <Text category="h6" style={{ marginTop: 10, marginBottom: 10, fontSize: 16, fontFamily: 'Lato-Bold' }}>Items</Text>
                  {currentOrder.order_items !== undefined && (
                    currentOrder.order_items.map(orderItem => (
                      <View key={orderItem.id} style={[styles.orderItem, (!orderItem.product.is_published ? {backgroundColor: '#EEEEEE', color: '#606060'} : {})]}>
                        <Image style={styles.orderItemImage} source={{ uri: `${PROJECT_URL}${orderItem.product.thumbnail}`}}></Image>
                        <View>
                          <Text style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>{orderItem.product.name} - {orderItem.product_variant.name}</Text>
                          <View style={styles.productQuantity}>
                            <TouchableOpacity
                              style={[styles.decreaseQuantity, (orderItem.quantity > 1 && orderItem.product.is_published ? {} : {backgroundColor: '#EEEEEE'})]}
                              onPress={orderItem.quantity > 1 && !quantityLoading && orderItem.product.is_published ? (() => changeQuantity({ orderItemID: orderItem.id, sellerID: seller.id, operation: 'subtract' })) : undefined}
                            >
                              <Ionicons style={orderItem.quantity > 1 && orderItem.product.is_published ? { color: '#4CAF50' } : {color: '#606060'}} name="chevron-back-outline" size={16}/>
                            </TouchableOpacity>
                            <View style={styles.quantity}>
                              <Text style={{ color: '#4CAF50' }}>{orderItem.quantity}</Text>
                            </View>
                            <TouchableOpacity
                              style={[styles.increaseQuantity, (orderItem.quantity < 10 && orderItem.product.is_published ? {} : {backgroundColor: '#EEEEEE'})]}
                              onPress={orderItem.quantity < 10 && !quantityLoading && orderItem.product.is_published ? (() => changeQuantity({ orderItemID: orderItem.id, sellerID: seller.id, operation: 'add' })) : undefined}
                            >
                              <Ionicons style={orderItem.quantity < 10 && orderItem.product.is_published ? { color: '#4CAF50' } : {color: '#606060'}} name="chevron-forward-outline" size={16}/>
                            </TouchableOpacity>
                          </View>
                          <Text style={[styles.mute, { fontSize: 14 }]}>{orderItem.quantity} x ₱ {orderItem.product_variant.price.toFixed(2)}</Text>
                          <Text>₱ {orderItem.total_price.toFixed(2)}</Text>
                        </View>
                        <Ionicons style={styles.deleteOrderItem} name="trash-outline" size={20} onPress={() => deleteOrderItem({ id:orderItem.id, sellerID: seller.id })}/>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
              <Button
                // style={[foodCardStyles.checkoutButton]}
                style={{ marginBottom: 25, borderRadius: 0 }}
                disabled={currentOrder.count < 1 || deliveryAddressId === '' || !delivery || !lastName || !firstName || !contact || !email ? true : false}
                onPress={proceedToPayments}
              >
                CHECKOUT
              </Button>
              <Text style={[foodCardStyles.checkoutFloatText, {fontFamily: 'Lato-Bold'}]}>{currentOrder.count < 1 || deliveryAddressId === '' || !delivery || !lastName || !firstName || !contact || !email ? '' : `₱${(parseFloat(currentOrder.subtotal)+parseFloat(delivery)).toFixed(2)}` }</Text>
              {quantityLoading || currentOrderLoading || deleteLoading || siteInfoLoading || userLoading ? (
                <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
                  <Spinner size='large'/>
                </View>
              ): undefined}
            </Animated.View>
          ) : (
            <>
              <ScrollView></ScrollView>
            </>
          )
        )
      )
    )
  )
}

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const foodCardStyles = StyleSheet.create({
  checkoutButton: {
    // position:'absolute',
    // bottom: 20,
    marginBottom: 25,
    width: deviceWidth,
    backgroundColor: '#53A557',
    borderColor: '#53A557',
    borderRadius: 0,
    zIndex: 10
  },
  checkoutFloatText: {
    position: 'absolute',
    color: 'white',
    bottom: 39,
    right: 25,
    zIndex: 10
  },
})

FoodCart.propTypes = {
  getCurrentOrder: PropTypes.func.isRequired,
  changeQuantity: PropTypes.func.isRequired,
  deleteOrderItem: PropTypes.func.isRequired,
  getAddress: PropTypes.func.isRequired,
  foodCheckout: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getCurrentOrder, deleteOrderItem, getAddress, changeQuantity, foodCheckout })(FoodCart);