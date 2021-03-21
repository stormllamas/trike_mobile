import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import axios from 'axios';
// import { GOOGLE_API_KEY } from "@env"

import { Icon, Text, Button, TopNavigation, TopNavigationAction, Input, IndexPath, Select, SelectItem  } from '@ui-kitten/components';
import { Animated, Easing, Dimensions, View, TouchableHighlight, Image, StyleSheet, ScrollView } from 'react-native'

import Collapsible from 'react-native-collapsible';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../common/Styles'

import { getAddress } from '../../actions/auth'
import { getCurrentOrder, deleteOrderItem, foodCheckout, changeQuantity } from '../../actions/logistics'

const ProfileModal = ({
  auth: {
    user,
    userLoading,
    isAuthenticated,
  },
  seller,
  foodCartActive, setFoodCartActive,
}) => {

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
  
  return (
    <Animated.View style={[styles.superModal, { top: modalAnim }]}>
      <>
        <TopNavigation
          accessoryLeft={() => <TopNavigationAction onPress={() => setFoodCartActive(false)} icon={props => <Icon {...props} name='arrow-back'/>}/>}
          title={`My Order - ${seller.name}`}
        />
        <>
          <ScrollView>
          </ScrollView>
          <>
            <Button
              style={profileModalStyles.checkoutButton}
              disabled={currentOrder.count < 1 || address === '' || !delivery || !lastName || !firstName || !contact || !email ? true : false}
              onPress={proceedToPayments}
            >
              CHECKOUT
            </Button>
            <Text style={profileModalStyles.checkoutFloatText}>{currentOrder.count < 1 || address === '' || !delivery || !lastName || !firstName || !contact || !email ? '' : `₱${(parseFloat(currentOrder.subtotal)+parseFloat(delivery)).toFixed(2)}` }</Text>
          </>
        </>
      </>
    </Animated.View>
  )
}

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const profileModalStyles = StyleSheet.create({
  checkoutButton: {
    width: deviceWidth,
    backgroundColor: '#398d3c',
    borderColor: '#398d3c',
    borderRadius: 0,
    zIndex: 10
  },
  checkoutFloatText: {
    position: 'absolute',
    color: 'white',
    bottom: 15,
    right: 25,
    zIndex: 10
  },
})

// FoodCart.propTypes = {
//   getCurrentOrder: PropTypes.func.isRequired,
//   changeQuantity: PropTypes.func.isRequired,
//   deleteOrderItem: PropTypes.func.isRequired,
//   getAddress: PropTypes.func.isRequired,
//   foodCheckout: PropTypes.func.isRequired,
// }

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getCurrentOrder, deleteOrderItem, getAddress, changeQuantity, foodCheckout })(ProfileModal);