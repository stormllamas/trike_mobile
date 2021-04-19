import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux';
import { PROJECT_URL } from "@env"
import { useBackButton } from '../common/BackButtonHandler';
import PropTypes from 'prop-types'


import { Divider, Icon, Text, Button, Spinner, Card } from '@ui-kitten/components';
import { Dimensions, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

import Collapsible from 'react-native-collapsible';

import { getCurrentOrder, proceedWithCOD } from '../../actions/logistics'

import Ionicons from 'react-native-vector-icons/Ionicons'

import Header from '../layout/Header'
import { styles } from '../common/Styles'



const DeliveryPayment = ({
  auth: { isAuthenticated },
  logistics: { 
    currentOrderLoading,
    currentOrder,
    completeOrderLoading
  },
  getCurrentOrder,
  proceedWithCOD,

  navigation,
  route,
}) => {

  const [socket, setSocket] = useState('')

  const [otherDetails, setOtherDetails] = useState(false)
  const [orderSummaryActivated, setOrderSummaryActivated] = useState(false)
  const [paymentOptionsActivated, setPaymentOptionsActivated] = useState(false)

  const handleBackButtonClick = () => {
    navigation.goBack()
    return true
  }
  useBackButton(handleBackButtonClick)

  useEffect(() => {
    isAuthenticated && (
      getCurrentOrder({
        type: 'delivery',
        query: '?for_checkout=true'
      })
    )
  }, [])


  return (
    isAuthenticated && currentOrder ? (
      <>
        <Header backLink={{component:'Root', options: {screen : 'Food'}}} subtitle='Delivery Checkout' navigation={navigation}/>
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
                  <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Shipping Total</Text>
                  <Text style={[styles.mute]}>₱ {currentOrder.shipping.toFixed(2)}</Text>
                </View>
                {/* <View style={{ borderColor: '#EAECF1', borderTopWidth: 1, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Order Total</Text>
                  <Text style={[{fontFamily: 'Lato-Bold'}]}>₱ {currentOrder.checkout_total.toFixed(2)}</Text>
                </View> */}
                <View style={{ borderColor: '#EAECF1', borderTopWidth: 1, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Order Notes</Text>
                  <Text style={[styles.inputSummary, {minHeight: 75}]}>{currentOrder.description}</Text>
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
                  <Button style={foodPaymentStyles.CODButton} onPress={() => {
                    proceedWithCOD({
                      type: 'delivery',
                      navigation,
                      // socket: socket,
                    })
                  }}>Proceed with COD</Button>
                </View>
              </Collapsible>
            </View>
          </View>
          
          <View style={styles.boxWithShadowContainer}>
            <View style={ styles.boxWithShadow }>
              <TouchableOpacity onPress={() => setOtherDetails(!otherDetails)}>
                <View style={[styles.collapsibleHeader, styles.boxHeader, { backgroundColor: '#ffffff', borderColor: '#EAECF1', borderBottomWidth: 1, borderRadius:10}]}>
                  <Text category="h6" style={{ fontSize: 16, fontFamily: 'Lato-Bold' }}>Show Other Details</Text>
                  <Ionicons name={otherDetails ? "chevron-down-outline" : "chevron-up-outline"} size={20}/>
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={otherDetails} duration={150} align="center">
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
                <Divider/>
                <View style={styles.boxBody}>
                  <View>
                    <Text style={styles.label}>Item Weight</Text>
                    <Text style={[styles.inputSummary]}>{currentOrder.weight}{currentOrder.unit}</Text>
                  </View>
                  <View>
                    <Text style={styles.label}>Item Height</Text>
                    <Text style={[styles.inputSummary]}>{currentOrder.height}</Text>
                  </View>
                  <View>
                    <Text style={styles.label}>Item Width</Text>
                    <Text style={[styles.inputSummary]}>{currentOrder.width}</Text>
                  </View>
                  <View>
                    <Text style={styles.label}>Item Length</Text>
                    <Text style={[styles.inputSummary]}>{currentOrder.length}</Text>
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

DeliveryPayment.propTypes = {
  getCurrentOrder: PropTypes.func.isRequired,
  proceedWithCOD: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getCurrentOrder, proceedWithCOD })(DeliveryPayment);