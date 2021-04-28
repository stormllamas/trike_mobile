import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux';
import { PROJECT_URL, DEBUG } from "@env"
console.log('Bookings ENV', PROJECT_URL, DEBUG)
import { useBackButton } from '../common/BackButtonHandler';
import PropTypes from 'prop-types'

import { Layout, Icon, Modal, Text, Button, Spinner, Card, Toggle, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Animated, Easing, Dimensions, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import Collapsible from 'react-native-collapsible';

import BookingItem from './BookingItem'
import Header from '../layout/Header'

import Ionicons from 'react-native-vector-icons/Ionicons'

import { styles } from '../common/Styles'

import { getOrders, setCurrentOnly, cancelOrder, syncOrder } from '../../actions/logistics'


const Bookings = ({
  auth: {
    user, isAuthenticated
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

  // States for order modal
  const [orderModalActive, setOrderModalActive] = useState(false)
  const [modalAnim, setModalAnim] = useState(new Animated.Value(Dimensions.get('window').height))

  // States for deleting orders
  const [deleteModalActive, setDeleteModalActive] = useState(false)
  
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
    if (isAuthenticated) {
      getOrders({
        getMore: false,
      })
    }
  }, [currentOnly, isAuthenticated]);

  useEffect(() => {
    if (orderModalActive) {
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
  }, [modalAnim, orderModalActive])

  useEffect(() => {
    let wsStart = 'ws://'
    let port = ''
    console.log(DEBUG, typeof(DEBUG))
    console.log(PROJECT_URL)
    if (DEBUG === 'False') {
      wsStart = 'wss://'
      port = ':8001'
    }
    let endpoint = wsStart + `${PROJECT_URL.replace('http://', '')}` + port
    console.log(endpoint)
    setSocket(new WebSocket(endpoint+'/order_update/'))
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = function(e){
        console.log('message', e)
        const data = JSON.parse(e.data)
        syncOrder({ data })
      }
      socket.onopen = function(e){
        console.log('open', e)
      }
      socket.onerror = function(e){
        console.log('error', e)
      }
      socket.onclose = function(e){
        console.log('close', e)
      }
    }
  }, [socket]);


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
                    <BookingItem key={item.id} order={item} orders={orders} index={index} ordersLoading={ordersLoading} setOrder={setOrder} setOrderModalActive={setOrderModalActive} setOrderToDelete={setOrderToDelete} setDeleteModalActive={setDeleteModalActive} navigation={navigation}/>
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
          
      <Animated.View style={[styles.superModal, { top: modalAnim }]}>
        <TopNavigation
          accessoryLeft={() => <TopNavigationAction onPress={() => setOrderModalActive(false)} icon={props => <Icon {...props} name='arrow-back'/>}/>}
          title={'Order Tracker'}
          subtitle={`Order #${order ? order.ref_code : ''}`}
        />
        {order ? (
          <Layout level="2" style={{flex: 1, padding: 25}}>
            {order.is_claimed ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Ionicons name="ellipsis-vertical" size={32} color={'#59CD5F'}/>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="search" size={32} color={'#59CD5F'} style={{ marginRight: 10 }}/>
                  <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: '#59CD5F' }}>Rider Found</Text>
                </View>
                <View style={{flexDirection: 'row', marginVertical: 15}}>
                  <Image style={[styles.orderItemImageLarge, {marginRight: 20}]} source={{ uri: `${PROJECT_URL}${order.rider.picture}` }} />
                  <View style={{ justifyContent: 'center'}}>
                    <Text style={{ fontFamily: 'Lato-Bold'}}>{order.rider && order.rider.name}</Text>
                    <Text style={[styles.mute, {marginBottom: 10}]}>{order.rider && order.rider.contact}</Text>
                    <Text style={[styles.mute]}>Plate Number:</Text>
                    <Text style={{ fontFamily: 'Lato-Bold', fontSize: 17 }}>{order.rider && order.rider.plate_number}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={{alignItems: 'center'}}>
                <Ionicons name="ellipsis-vertical" size={32} color={'#1C8DFF'}/>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="search-outline" size={32} color={'#1C8DFF'} style={{ marginRight: 10 }}/>
                  <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: '#1C8DFF' }}>Searching for a rider</Text>
                </View>
              </View>
            )}

            {order.order_type === 'food' ? (
              order.is_claimed && order.is_pickedup ? (
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="ellipsis-vertical" size={32} color={'#59CD5F'}/>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="fast-food" size={32} color={'#59CD5F'} style={{ marginRight: 10 }}/>
                    <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: '#59CD5F' }}>Your food has been picked up</Text>
                  </View>
                </View>
              ) : (
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="ellipsis-vertical" size={32} color={`${order.is_claimed ? '#1C8DFF' : '#959595'}`}/>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="fast-food-outline" size={32} color={`${order.is_claimed ? '#1C8DFF' : '#959595'}`} style={{ marginRight: 10 }}/>
                    <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: order.is_claimed ? '#1C8DFF' : '#959595' }}>Rider is heading to pickup location</Text>
                  </View>
                </View>
              )
            ) : (
              order.is_claimed && order.is_pickedup ? (
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="ellipsis-vertical" size={32} color={'#59CD5F'}/>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="cube" size={32} color={'#59CD5F'} style={{ marginRight: 10 }}/>
                    <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: '#59CD5F' }}>{order.order_type === 'delivery' ? 'Parcel Picked Up' : 'Passenger Picked Up'}</Text>
                  </View>
                </View>
              ) : (
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="ellipsis-vertical" size={32} color={`${order.is_claimed ? '#1C8DFF' : '#959595'}`}/>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="cube-outline" size={32} color={`${order.is_claimed ? '#1C8DFF' : '#959595'}`} style={{ marginRight: 10 }}/>
                    <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: order.is_claimed ? '#1C8DFF' : '#959595' }}>Rider is heading to pickup location</Text>
                  </View>
                </View>
              )
            )}
            {order.order_type === 'ride_hail' ? (
              order.is_delivered ? (
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="ellipsis-vertical" size={32} color='#59CD5F'/>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="checkbox" size={32} color='#59CD5F' style={{ marginRight: 10 }}/>
                    <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: '#59CD5F' }}>Escorting Passenger</Text>
                  </View>
                </View>
              ) : (
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="ellipsis-vertical" size={32} color={`${order.is_pickedup ? '#1C8DFF' : '#959595'}`}/>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="checkbox-outline" size={32} color={`${order.is_pickedup ? '#1C8DFF' : '#959595'}`}/>
                    <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: order.is_pickedup ? '#1C8DFF' : '#959595' }}>Escorting Passenger</Text>
                  </View>
                </View>
              )
            ) : (
              order.is_delivered ? (
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="ellipsis-vertical" size={32} color='#59CD5F'/>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="checkbox" size={32} color='#59CD5F' style={{ marginRight: 10 }}/>
                    <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: '#59CD5F' }}>Your order has been delivered</Text>
                  </View>
                </View>
              ) : (
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="ellipsis-vertical" size={32} color={`${order.is_pickedup ? '#1C8DFF' : '#959595'}`}/>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="checkbox-outline" size={32} color={`${order.is_pickedup ? '#1C8DFF' : '#959595'}`} style={{ marginRight: 10 }}/>
                    <Text category="h6" style={{ fontFamily: 'Lato-Bold', color: order.is_pickedup ? '#1C8DFF' : '#959595' }}>Your order is being delivered</Text>
                  </View>
                </View>
              )
            )}
          </Layout>
        ) : (
          <Layout level="2" style={{flex: 1, padding: 25}}></Layout>
        )}
        <Button
          style={[styles.hoverButton, { marginBottom: 30, backgroundColor: '#146DDB', borderColor: '#146DDB' }]}
          onPress={() => setOrderModalActive(false)}
        >
          CLOSE
        </Button>
      </Animated.View>
      <Modal
        visible={deleteModalActive}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setDeleteModalActive(false)}
        style={{ marginRight: 50, zIndex: 10 }}>
        <Card disabled={true}>
          <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: '700', padding: 15 }}>Are you sure you want to delete your order?</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Button style={{ backgroundColor: '#DB555F', borderColor: '#DB555F', marginRight: 10 }} onPress={() => {cancelOrder({ id: orderToDelete }), setDeleteModalActive(false)}}>DELETE</Button>
            <Button style={{ backgroundColor: '#1C8DFF', borderColor: '#1C8DFF', marginRight: 10 }} onPress={() => setDeleteModalActive(false)}>CANCEL</Button>
          </View>
        </Card>
      </Modal>
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