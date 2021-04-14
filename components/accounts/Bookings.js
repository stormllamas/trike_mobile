import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux';
import { PROJECT_URL } from "@env"
import { useBackButton } from '../common/BackButtonHandler';
import PropTypes from 'prop-types'

import { Layout, Icon, Text, Button, Spinner, Card, Toggle } from '@ui-kitten/components';
import { Dimensions, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import Collapsible from 'react-native-collapsible';

import BookingItem from './BookingItem'
import Header from '../layout/Header'

import Ionicons from 'react-native-vector-icons/Ionicons'

import { styles } from '../common/Styles'

import { getOrders, setCurrentOnly, cancelOrder, syncOrder } from '../../actions/logistics'


const Bookings = ({
  auth: {
    user
  },
  logistics: {
    currentOnly,
    ordersLoading,
    orders,
    moreOrdersLoading,
  },
  getOrders,
  setCurrentOnly,
  cancelOrder,

  syncOrder,

  navigation,
  route,
}) => {

  const [order, setOrder] = useState('');
  const [showCurrentOnly, setShowCurrentOnly] = useState(false);

  const [orderToDelete, setOrderToDelete] = useState('');
  
  const [socket, setSocket] = useState('')

  const handleBackButtonClick = () => {
    navigation.goBack()
    return true
  }
  useBackButton(handleBackButtonClick)

  useEffect(() => {
    setCurrentOnly({
      bool: showCurrentOnly
    })
    return () => {
      setCurrentOnly({
        bool: showCurrentOnly
      })
    }
  }, [showCurrentOnly]);
  
  useEffect(() => {
    getOrders({
      getMore: false,
    })
  }, [currentOnly]);

  // useEffect(() => {
  //   let wsStart = 'ws://'
  //   let port = ''
  //   if (window.location.protocol === 'https:') {
  //     wsStart = 'wss://'
  //     port = ':8001'
  //   }
  //   let endpoint = wsStart + window.location.host + port
  //   setSocket(new ReconnectingWebSocket(endpoint+'/order_update/'))
  // }, []);

  // useEffect(() => {
  //   if (socket) {
  //     socket.onmessage = function(e){
  //       console.log('message', e)
  //       const data = JSON.parse(e.data)
  //       syncOrder({ data })
  //     }
  //     socket.onopen = function(e){
  //       console.log('open', e)
  //     }
  //     socket.onerror = function(e){
  //       console.log('error', e)
  //     }
  //     socket.onclose = function(e){
  //       console.log('close', e)
  //     }
  //   }
  // }, [socket]);


  return (
      <>
        <Header subtitle='My Bookings' backLink={{component:'Root', options: {screen : 'Food'}}} navigation={navigation}/>
        <Layout style={{ flex: 1 }} level="2">
          <ScrollView>
            <View style={{ padding: 15, alignItems: 'flex-start'}}>
              <Text category="h5"style={{ marginBottom: 10, marginLeft: 5, fontFamily: 'Lato-Bold' }}>My Bookings</Text>
              <Toggle
                style={{ margin: 2 }}
                checked={showCurrentOnly}
                onChange={e => setShowCurrentOnly(!showCurrentOnly)}>
                Show Current Only
              </Toggle>
            </View>
            {!ordersLoading && orders && (
              orders.results.length > 0 ? (
                <IOScrollView contentContainerStyle={{}}>
                  {orders.results.map((item, index) => (
                    <BookingItem key={item.id} order={item} orders={orders} index={index} ordersLoading={ordersLoading} setOrder={setOrder} setOrderToDelete={setOrderToDelete} navigation={navigation}/>
                  ))}
                  {moreOrdersLoading ? (
                    <Layout level="2" style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                      <Spinner size='medium'></Spinner>
                    </Layout>
                  ) : undefined}
                </IOScrollView>
              ) : (
                <View style={[styles.fullContainerMedium]}>
                  <Image style={{ height: 200, width: 205 }} source={{ uri: `${PROJECT_URL}/static/frontend/img/Trike_no_bookings.png` }} />
                  <Text category="h5">No Bookings</Text>
                </View>
              )
            )}

            {/* {ordersLoading && (
              <View style={[styles.fullContainerLarge]}>
                <Spinner size='large'/>
              </View>
            )} */}
            {ordersLoading && (
              <>
                <View style={styles.boxWithShadowContainer}>
                  <View style={[styles.boxWithShadow, {height: 500}]}></View>
                </View>
                <View style={styles.boxWithShadowContainer}>
                  <View style={[styles.boxWithShadow, {height: 500}]}></View>
                </View>
                <View style={styles.boxWithShadowContainer}>
                  <View style={[styles.boxWithShadow, {height: 500}]}></View>
                </View>
              </>
            )}
        </ScrollView>
      </Layout>
    </>
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

Bookings.propTypes = {
  getOrders: PropTypes.func.isRequired,
  setCurrentOnly: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,

  syncOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrders, setCurrentOnly, cancelOrder, syncOrder })(Bookings);