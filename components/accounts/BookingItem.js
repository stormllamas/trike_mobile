import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { PROJECT_URL } from "../../actions/siteConfig"
console.log('BookingItem ENV', PROJECT_URL)

import { Text, Button, Divider } from '@ui-kitten/components';
import { Dimensions, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { InView } from 'react-native-intersection-observer'

import Collapsible from 'react-native-collapsible';

import { getOrders } from '../../actions/logistics';

import Ionicons from 'react-native-vector-icons/Ionicons'

import Header from '../layout/Header'
import { styles } from '../common/Styles'



const BookingItem = ({ ordersLoading, order, orders, index, getOrders, setOrder, setOrderModalActive, setOrderToDelete, setDeleteModalActive, navigation }) => {

  const lastProductElement = (inView) => {
    if (inView && orders.results.length == index+1 && orders.next !== null && !ordersLoading) {
      getOrders({
        getMore: true
      });
    }
  }

  const deletePressed = () => {
    setOrderToDelete(order.id)
    setDeleteModalActive(true)
  }

  return (
    <InView onChange={inView => lastProductElement(inView)} style={styles.boxWithShadowContainer}>
      <View style={styles.boxWithShadow}>
        <View style={[styles.boxHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <View style={{ paddingHorizontal: 15, flexDirection: 'row', backgroundColor: '#EEEEEE', borderRadius: 50, alignItems: 'center', height: 35 }}>
            <Text style={[{ fontFamily: 'Lato-Bold', marginRight: 5 }]}>RN</Text>
            <Text style={[{ color: '#03A9F4' }]}>#{order.ref_code}</Text>
          </View>
          {!order.is_delivered ? (
            !order.is_canceled ? (
              <Button style={[{ borderRadius: 50 }]} size='small' onPress={() => {setOrder(order); setOrderModalActive(true)}}>Status</Button>
            ) : (
              <Text style={[styles.mute, { fontFamily: 'Lato-Bold', alignSelf: 'center' }]}>Order Canceled</Text>
            )
          ) : (
            !order.is_reviewed ? (
              <View style={{ alignItems: 'flex-end' }}>
                <Button style={[{ borderRadius: 50, width: 100 }]} size='small' onPress={() => navigation.navigate('OrderReview', { orderId: order.id })}>REVIEW</Button>
                <Text style={[styles.small, styles.mute, { marginTop: 5 }]}>delivered by {order.rider && order.rider.name}</Text>
              </View>
            ) : (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[{ paddingHorizontal: 15, backgroundColor: '#EEEEEE', borderRadius: 50, textAlign: 'center', paddingVertical: 5 }]}>Reviewed</Text>
                <Text style={[styles.small, styles.mute]}>delivered by {order.rider && order.rider.name}</Text>
              </View>
            )
          )}
        </View>
        <View style={styles.boxBody}>
          {order.order_type === 'food' && (
            order.order_items && (
              order.order_items.map((orderItem, index) => (
                <View key={orderItem.id} style={[styles.orderItem, {color: '#606060'}, index !== 0 ? {borderColor: '#EAECF1', borderTopWidth: 1, paddingVertical: 5} : {} ]}>
                  <Image style={styles.orderItemImage} source={{ uri: `${PROJECT_URL}${orderItem.product.thumbnail ? orderItem.product.thumbnail : '/static/frontend/img/no-image.jpg'}`}}></Image>
                  <View style={{ position: 'relative', flex: 1 }}>
                    <Text style={{ marginBottom: 5 }}>{orderItem.product.name} - {orderItem.product_variant.name}</Text>
                    {orderItem.is_delivered && (
                      orderItem.is_reviewed ? (
                        <Text style={{ paddingHorizontal:10, paddingVertical: 5, backgroundColor: '#EEEEEE', width: 100 }}>Reviewed</Text>
                      ) : (
                        <Button style={[{ backgroundColor: '#FFC107', width: 100, position: 'absolute', bottom: 0, right: 0, zIndex: 1 }]} size='small' onPress={() => navigation.navigate('ProductReview', { orderItemId: orderItem.id })}>REVIEW</Button>
                      )
                    )}
                    <Text style={{ fontSize: 12 }}>{orderItem.quantity} x ₱ {orderItem.ordered_price.toFixed(2)}</Text>
                    <Text>₱ {orderItem.quantity*orderItem.ordered_price.toFixed(2)}</Text>
                  </View>
                </View>
              ))
            )
          )}
          <View>
            <Text style={styles.label}>Order Notes</Text>
            <Text style={[styles.inputSummary, {minHeight: 75}]}>{order.description}</Text>
          </View>
          {order.order_type === 'delivery' && (
            <View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '30%', marginRight: '5%' }}>
                  <Text style={[styles.label]}>Height</Text>
                  <Text style={[styles.inputSummary]}>{order.height}</Text>
                </View>
                <View style={{ width: '30%' }}>
                  <Text style={styles.label}>Width</Text>
                  <Text style={[styles.inputSummary]}>{order.width}</Text>
                </View>
                <View style={{ width: '30%', marginLeft: '5%' }}>
                  <Text style={styles.label}>Length</Text>
                  <Text style={[styles.inputSummary]}>{order.length}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.label}>Weight</Text>
                <Text style={[styles.inputSummary]}>{order.weight}{order.unit}</Text>
              </View>
            </View>
          )}
          
          <Divider/>
          <View style={{ paddingVertical: 5, marginTop: 10 }}>
            <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>{order.order_type === 'food' ? order.seller.name : 'Pickup Address:'} </Text>
            <Text style={[styles.mute]}>{order.loc1_address}</Text>
          </View>
          <View style={{ paddingVertical: 5 }}>
            <Text style={{ fontFamily: 'Lato-Bold', marginBottom:5 }}>Delivery Address: </Text>
            <Text style={[styles.mute]}>{order.loc2_address}</Text>
          </View>
          
          {order.order_type === 'food' && (
            <View style={{ marginVertical: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.mute, { fontFamily: 'Lato-Bold', marginBottom:5 }]}>Subtotal</Text>
                <Text>₱ {order.ordered_subtotal.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.mute, { fontFamily: 'Lato-Bold', marginBottom:5 }]}>Shipping</Text>
                <Text style={[styles.mute]}>{order.promo_discount && <Text style={[styles.mute, styles.strikethrough]}>₱ {order.promo_discount ? (order.ordered_shipping+order.promo_discount).toFixed(2) : order.ordered_shipping.toFixed(2) }</Text>} ₱ {order.ordered_shipping.toFixed(2)}</Text>
              </View>
            </View>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[styles.mute, { fontFamily: 'Lato-Bold', marginBottom:5, fontSize: 18 }]}>Total</Text>
            <Text style={{ fontFamily: 'Lato-Bold', fontSize: 18 }}>₱ {order.ordered_total.toFixed(2)}</Text>
          </View>

          <View style={{ borderColor: '#EAECF1', borderTopWidth: 1 }}>
            <Text onPress={() => {setOrder(order); setOrderModalActive(true)}} style={[{ fontFamily: 'Lato-Black', marginTop:5, marginTop: 15 }, order.order_type === 'ride_hail' && { color: '#4CAF50'}, order.order_type === 'delivery' && { color: '#2196F3'}, order.order_type === 'food' && { color: '#FAA634'}]}>{ order.order_type.replace('_', ' ').toUpperCase()}</Text>
          </View>
        </View>
        {!order.is_claimed && !order.is_canceled && (
          <>
            <Divider/>
            <View style={[styles.boxBody, { backgroundColor: '#F8F8F8', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center'}} onPress={() => deletePressed()}>
                <Ionicons name="close-outline" size={26} color={'#959595'}/>
                <Text style={[styles.mute, { fontSize: 14 }]}>CANCEL BOOKING</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </InView>
  )
}

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const bookingItemStyles = StyleSheet.create({
})

BookingItem.propTypes = {
  getOrders: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrders })(BookingItem);