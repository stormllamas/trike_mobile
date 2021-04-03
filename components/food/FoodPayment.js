import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux';
import { PROJECT_URL } from "@env"
import { useBackButton } from '../common/BackButtonHandler';
import PropTypes from 'prop-types'


import { Icon, Text, Button, Spinner, Card } from '@ui-kitten/components';
import { Dimensions, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

import Collapsible from 'react-native-collapsible';

import { getCurrentOrder, proceedWithCOD } from '../../actions/logistics'

import Ionicons from 'react-native-vector-icons/Ionicons'

import Header from '../layout/Header'
import { styles } from '../common/Styles'



const FoodPayment = ({
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
    product,

    quantityLoading,
    deleteLoading,
    checkoutLoading,
  },
  getCurrentOrder,
  proceedWithCOD,

  navigation,
  route,
}) => {

  const [personalDetailsActivated, setPersonalDetailsActivated] = useState(false)
  const [orderSummaryActivated, setOrderSummaryActivated] = useState(false)
  const [paymentOptionsActivated, setPaymentOptionsActivated] = useState(false)

  const handleBackButtonClick = () => {
    navigation.goBack()
    return true
  }
  useBackButton(handleBackButtonClick)
  
  const checkCurrentOrder = CO => {
    if (CO.first_name !== null && CO.last_name !== null && CO.contact !== null && CO.email !== null && CO.gender !== null && CO.loc1_latitude !== null && CO.loc1_longitude !== null && CO.loc1_address !== null && CO.loc2_latitude !== null && CO.loc2_longitude !== null && CO.loc2_address !== null) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    getCurrentOrder({
      type: 'food',
      query: `?order_seller_name=${route.params.selectedSeller}&for_checkout=true`
    })
  }, [])

  useEffect(() => {
    if(!currentOrderLoading) {
      if (currentOrder) {
        if (checkCurrentOrder(currentOrder)) {
        } else {
          // Alert.alert(
          //   "Error",
          //   "Checkout session expired",
          //   [
          //     {
          //       text: "Cancel",
          //       style: "cancel"
          //     },
          //     { text: "OK" }
          //   ]
          // );
        }
        if (!currentOrder.has_valid_item) {
          navigation.navigate('RestaurantDetail', { selectedSeller: route.params.selectedSeller })
        }
      }
    }
  }, [currentOrderLoading])


  return (
    isAuthenticated && !currentOrderLoading && currentOrder ? (
      <>
        <Header subtitle='Food Checkout' backLink={{component:'RestaurantDetail', options: {selectedSeller: route.params.selectedSeller }}} navigation={navigation}/>
        <ScrollView>
          <View style={styles.boxWithShadowContainer}>
            <View style={ styles.boxWithShadow }>
              <View style={styles.boxHeader}>
                <Text style={{ fontSize: 22, borderColor: '#EAECF1', fontFamily: 'Lato-Bold' }}>Order Summary</Text>
                <Text style={[styles.mute, styles.small]}>(Please review the details below)</Text>
              </View>
              <View style={styles.boxBody}>
                <View style={{ paddingVertical: 5 }}>
                  <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Pickup Address</Text>
                  <Text style={[styles.mute]}>{currentOrder.loc1_address}</Text>
                </View>
                <View style={{ borderColor: '#EAECF1', borderTopWidth: 1, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Delivery Address</Text>
                  <Text style={[styles.mute]}>{currentOrder.loc2_address}</Text>
                </View>
                <View style={{ borderColor: '#EAECF1', borderTopWidth: 1, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Subtotal</Text>
                  <Text style={[styles.mute]}>₱ {currentOrder.checkout_subtotal.toFixed(2)}</Text>
                </View>
                <View style={{ borderColor: '#EAECF1', borderTopWidth: 1, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Shipping</Text>
                  <Text style={[styles.mute]}>₱ {currentOrder.shipping.toFixed(2)}</Text>
                </View>
                <View style={{ borderColor: '#EAECF1', borderTopWidth: 1, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Order Total</Text>
                  <Text style={[{fontFamily: 'Lato-Bold'}]}>₱ {currentOrder.checkout_total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.boxWithShadowContainer}>
            <View style={ styles.boxWithShadow }>
              <TouchableOpacity onPress={() => setPaymentOptionsActivated(!paymentOptionsActivated)}>
                <View style={[styles.collapsibleHeader, styles.boxHeader, { backgroundColor: '#ffffff', borderColor: '#EAECF1', borderBottomWidth: 1, borderRadius:10}]}>
                  <Text category="h6" style={{ fontSize: 16, fontFamily: 'Lato-Bold' }}>Payment Options</Text>
                  <Ionicons name={paymentOptionsActivated ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={paymentOptionsActivated} duration={150} align="center">
                <View style={styles.boxBody}>
                  <Button style={foodPaymentStyles.CODButton} onPress={() => console.log('COD')}>Proceed with COD</Button>
                </View>
              </Collapsible>
            </View>
          </View>

          <View style={styles.boxWithShadowContainer}>
            <View style={ styles.boxWithShadow }>
              <TouchableOpacity onPress={() => setOrderSummaryActivated(!orderSummaryActivated)}>
                <View style={[styles.collapsibleHeader, styles.boxHeader, { backgroundColor: '#ffffff', borderColor: '#EAECF1', borderBottomWidth: 1, borderRadius:10}]}>
                  <Text category="h6" style={{ fontSize: 16, fontFamily: 'Lato-Bold' }}>Cart Summary</Text>
                  <Ionicons name={orderSummaryActivated ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={orderSummaryActivated} duration={150} align="center">
                <View style={styles.boxBody}>
                  {currentOrder.order_items !== undefined && (
                    currentOrder.order_items.map((orderItem, index) => (
                      <View key={orderItem.id} style={[styles.orderItem, {color: '#606060'}, index !== 0 ? {borderColor: '#EAECF1', borderTopWidth: 1, paddingVertical: 5} : {} ]}>
                        <Image style={styles.orderItemImage} source={{ uri: `${PROJECT_URL}${orderItem.product.thumbnail}`}}></Image>
                        <View>
                          <Text style={{ marginBottom: 5 }}>{orderItem.product.name} - {orderItem.product_variant.name}</Text>
                          <Text style={{ fontSize: 12 }}>{orderItem.quantity} x ₱ {orderItem.product_variant.price.toFixed(2)}</Text>
                          <Text>₱ {orderItem.total_price.toFixed(2)}</Text>
                        </View>
                      </View>
                    ))
                  )}
                  <View>
                    <Text style={styles.label}>Order Notes</Text>
                    <Text style={[styles.inputSummary, {minHeight: 75}]}>{currentOrder.description}</Text>
                  </View>
                </View>
              </Collapsible>
            </View>
          </View>
          
          <View style={styles.boxWithShadowContainer}>
            <View style={ styles.boxWithShadow }>
              <TouchableOpacity onPress={() => setPersonalDetailsActivated(!personalDetailsActivated)}>
                <View style={[styles.collapsibleHeader, styles.boxHeader, { backgroundColor: '#ffffff', borderColor: '#EAECF1', borderBottomWidth: 1, borderRadius:10}]}>
                  <Text category="h6" style={{ fontSize: 16, fontFamily: 'Lato-Bold' }}>Personal Details</Text>
                  <Ionicons name={personalDetailsActivated ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={personalDetailsActivated} duration={150} align="center">
                <View style={styles.boxBody}>
                  <View>
                    <Text style={styles.label}>First Name</Text>
                    <Text style={[styles.inputSummary]}>{currentOrder.first_name}</Text>
                  </View>
                  <View>
                    <Text style={styles.label}>Last Name</Text>
                    <Text style={[styles.inputSummary]}>{currentOrder.last_name}</Text>
                  </View>
                  <View>
                    <Text style={styles.label}>Contact</Text>
                    <Text style={[styles.inputSummary]}>{currentOrder.contact}</Text>
                  </View>
                  <View>
                    <Text style={styles.label}>Email</Text>
                    <Text style={[styles.inputSummary]}>{currentOrder.email}</Text>
                  </View>
                  <View>
                    <Text style={styles.label}>Gender</Text>
                    <Text style={[styles.inputSummary]}>{currentOrder.gender}</Text>
                  </View>
                </View>
              </Collapsible>
            </View>
          </View>
        </ScrollView>
      </>
    ) : (
      <>
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
          <Spinner size='large'/>
        </View>
      </>
    )
  )
}

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const foodPaymentStyles = StyleSheet.create({
  CODButton: {
    marginBottom: 25,
    backgroundColor: '#398d3c',
    borderColor: '#398d3c',
    borderRadius: 5,
  },
})

FoodPayment.propTypes = {
  getCurrentOrder: PropTypes.func.isRequired,
  proceedWithCOD: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getCurrentOrder, proceedWithCOD })(FoodPayment);