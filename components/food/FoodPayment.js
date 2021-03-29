import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux';
import { useBackButton } from '../common/BackButtonHandler';
import PropTypes from 'prop-types'


import { Icon, Text, Button, Spinner, Card } from '@ui-kitten/components';
import { Dimensions, View, Image, StyleSheet, ScrollView, TouchableHighlight } from 'react-native'

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
          <View style={{ padding: 15 }}>
            <View style={[ styles.boxWithShadow, { borderWidth: 1, borderColor: '#F2F2F2' }]}>
              <View style={{ backgroundColor: '#ffffff' }}>
                <View style={{ padding: 12, backgroundColor: '#F8F8F8' }}>
                  <Text style={{ fontSize: 22, fontWeight: '700', borderColor: '#EAECF1' }}>Payment Summary</Text>
                  <Text style={[styles.mute, styles.small]}>(Please review the details below)</Text>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={{ fontWeight: '700' }}>Pickup Address</Text>
                  <Text style={styles.mute}>{currentOrder.loc1_address}</Text>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={styles.label}>Delivery Address</Text>
                  <Text style={styles.inputSummary}>{currentOrder.loc2_address}</Text>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={styles.label}>Subtotal</Text>
                  <Text style={styles.inputSummary}>₱ {currentOrder.checkout_subtotal.toFixed(2)}</Text>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={styles.label}>Shipping</Text>
                  <Text style={styles.inputSummary}>₱ {currentOrder.shipping.toFixed(2)}</Text>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={styles.label}>Order Total</Text>
                  <Text style={styles.inputSummary}>₱ {currentOrder.checkout_total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ borderTopWidth: 8, borderColor: '#EAECF1'  }}>
            <TouchableHighlight onPress={() => setOrderSummaryActivated(!orderSummaryActivated)}>
              <View style={styles.collapsibleHeader}>
                <Text category="h6" style={{ fontWeight: '700', fontSize: 16 }}>Order Summary</Text>
                <Ionicons name={orderSummaryActivated ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
              </View>
            </TouchableHighlight>
            <Collapsible collapsed={orderSummaryActivated} duration={150} align="center">
              <View style={styles.collapsibleContent}>
                {currentOrder.order_items !== undefined && (
                  currentOrder.order_items.map(orderItem => (
                    <View key={orderItem.id} style={[styles.orderItem, {color: '#606060'}]}>
                      <Image style={styles.orderItemImage} source={{ uri: `https://www.trike.com.ph${orderItem.product.thumbnail}`}}></Image>
                      <View>
                        <Text style={{ marginBottom: 5 }}>{orderItem.product.name} - {orderItem.product_variant.name}</Text>
                        <Text style={{ fontSize: 12 }}>{orderItem.quantity} x ₱ {orderItem.product_variant.price.toFixed(2)}</Text>
                        <Text>₱ {orderItem.total_price.toFixed(2)}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </Collapsible>
          </View>
          
          <View style={{ borderTopWidth: 8, borderColor: '#EAECF1' }}>
            <TouchableHighlight onPress={() => setPersonalDetailsActivated(!personalDetailsActivated)}>
              <View style={styles.collapsibleHeader}>
                <Text category="h6" style={{ fontWeight: '700', fontSize: 16 }}>Personal Details</Text>
                <Ionicons name={personalDetailsActivated ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
              </View>
            </TouchableHighlight>
            <Collapsible collapsed={personalDetailsActivated} duration={150} align="center">
              <View style={styles.collapsibleContent}>
                <View>
                  <Text style={styles.label}>First Name</Text>
                  <Text style={styles.inputSummary}>{currentOrder.first_name}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Last Name</Text>
                  <Text style={styles.inputSummary}>{currentOrder.last_name}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Contact</Text>
                  <Text style={styles.inputSummary}>{currentOrder.contact}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.inputSummary}>{currentOrder.email}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Gender</Text>
                  <Text style={styles.inputSummary}>{currentOrder.gender}</Text>
                </View>
                <View>
                  <Text>Description</Text>
                  <Text style={[styles.inputSummary, {minHeight: 75}]}>{currentOrder.description}</Text>
                </View>
              </View>
            </Collapsible>
          </View>

          <View style={{ borderTopWidth: 8, borderColor: '#EAECF1' }}>
            <TouchableHighlight onPress={() => setPaymentOptionsActivated(!paymentOptionsActivated)}>
              <View style={styles.collapsibleHeader}>
                <Text category="h6" style={{ fontWeight: '700', fontSize: 16 }}>Payment Options</Text>
                <Ionicons name={paymentOptionsActivated ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
              </View>
            </TouchableHighlight>
            <Collapsible collapsed={paymentOptionsActivated} duration={150} align="center">
              <View style={styles.collapsibleContent}>
                <Button style={foodPaymentStyles.CODButton} onPress={() => console.log('COD')}>Proceed with COD</Button>
              </View>
            </Collapsible>
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