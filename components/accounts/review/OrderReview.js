import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux';
import { useBackButton } from '../../common/BackButtonHandler';
import PropTypes from 'prop-types'

import { Layout, Icon, Text, Button, Divider, Spinner, Card, Input } from '@ui-kitten/components';
import { Dimensions, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import Collapsible from 'react-native-collapsible';

import Header from '../../layout/Header'

import Ionicons from 'react-native-vector-icons/Ionicons'

import { styles } from '../../common/Styles'

import { getOrder, reviewOrder } from '../../../actions/logistics'


const OrderReview = ({
  auth: {
    isAuthenticated,
    user
  },
  logistics: {
    orderLoading,
    order,
  },
  getOrder,
  reviewOrder,

  navigation,
  route,
}) => {

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleBackButtonClick = () => {
    navigation.goBack()
    return true
  }
  useBackButton(handleBackButtonClick)

  const checkRating = num => {
    if (rating >= num) {
      return 'active'
    } else {
      return ''
    }
  }

  const checkText = () => {
    if (rating === 5) {
      return 'Excellent!'
    } else if (rating === 4) {
      return 'Good!'
    } else if (rating === 3) {
      return 'Okay'
    } else if (rating === 2) {
      return 'Poor'
    } else if (rating === 1) {
      return 'Very Poor'
    }
  }

  const submitOrderReview = () => {
    reviewOrder({
      order: order.id,
      userID: user.id,
      rating: rating,
      comment: comment,
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      if (order === null || order.id !== route.params.orderId) {
        getOrder({
          orderID: route.params.orderId
        })
      }
    }
  }, []);

  // useEffect(() => {
  //   console.log('----------------')
  //   console.log(orderLoading)
  //   console.log(order)
  //   console.log(order.id)
  //   console.log(route.params.orderId)
  // }, [orderLoading, order]);

  return (
    isAuthenticated ? (
      !orderLoading && (order ? order.id === route.params.orderId : false) ? (
        order.is_delivered && order.user.id === user.id && !user.groups.includes('rider') ? (
          <>
            <Header subtitle='Delivery Review' backLink={{component:'Bookings'}} navigation={navigation}/>
            <Layout style={{ flex: 1 }} level="2">
              <ScrollView>
                <View style={{ padding: 15, alignItems: 'flex-start'}}>
                  <Text category="h5"style={{ marginBottom: 10, marginLeft: 5, fontFamily: 'Lato-Bold' }}>Review the Delivery</Text>
                </View>
                {!order.is_reviewed ? (
                  <View style={styles.boxWithShadowContainer}>
                    <View style={styles.boxWithShadow}>
                      <View style={[styles.boxHeader, { alignItems: 'center', backgroundColor: 'white' }]}>
                        <Text category="h6"style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>How was the Delivery?</Text>
                        <Text style={[{ color: '#9e9e9e' }]}>Order #{order.ref_code}</Text>
                      </View>
                      <Divider/>
                      <View style={[styles.boxBody, { alignItems: 'center' }]}>
                        <Text category="h6" style={[styles.mute, styles.small, { marginBottom: 5 }]}>{checkText()}</Text>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                          <Icon name='star' fill={checkRating(1) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setRating(1)}}>star</Icon>
                          <Icon name='star' fill={checkRating(2) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setRating(2)}}>star</Icon>
                          <Icon name='star' fill={checkRating(3) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setRating(3)}}>star</Icon>
                          <Icon name='star' fill={checkRating(4) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setRating(4)}}>star</Icon>
                          <Icon name='star' fill={checkRating(5) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setRating(5)}}>star</Icon>
                        </View>
                        <Input
                          value={comment}
                          multiline={true}
                          textStyle={{ minHeight: 150, textAlignVertical : 'top' }}
                          placeholder='What did you think?'
                          onChangeText={nextValue => setComment(nextValue)}
                          style={{ marginTop: 10, backgroundColor: 'white' }}
                        />
                        <Text style={[styles.small, {alignSelf: 'flex-end'}]}>{comment.length}/4000</Text>
                        <Button
                          style={[{marginVertical: 15}]}
                          onPress={submitOrderReview}
                        >
                          SUBMIT REVIEW
                        </Button>
                      </View>

                    </View>
                  </View>
                ) : (
                  <View style={styles.boxWithShadowContainer}>
                    <View style={styles.boxWithShadow}>
                      <View style={[styles.boxHeader, { alignItems: 'center' }]}>
                        <Text category="h6"style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>Delivery Reviewed</Text>
                        <Text style={[{ color: '#9e9e9e' }]}>Order #{order.ref_code}</Text>
                      </View>
                      <Divider/>
                      <View style={[styles.boxBody, { alignItems: 'center' }]}>
                        <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end' }}>
                          {[...Array(parseInt(order.review.rating)).keys()].map(star => <Icon key={star} name='star' fill='#F2BE4D' style={{ height: 23, width: 23}}>star</Icon>)}
                          {[...Array(Math.max(5-parseInt(order.review.rating), 0)).keys()].map(star => <Icon key={star} name='star' fill='#E0E0E0' style={{ height: 23, width: 23}}>star</Icon>)}
                          <Text style={[styles.mute, styles.small, { marginLeft: 5 }]}>({order.review.rating} stars)</Text>
                        </View>
                        <View style={[{flexDirection: 'row'}]}>
                          <Text style={[styles.inputSummary, {flexDirection:'row', flex: 1, minHeight: 150}]}>{order.review.comment}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </Layout>
          </>
        ) : (
          <>
            <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
              <Spinner size='large'/>
            </View>
          </>
        )
      ) : (
        <>
          <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
            <Spinner size='large'/>
          </View>
        </>
      )
    ) : (
      <>
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center'}]}>
          <Spinner size='large'/>
        </View>
      </>
    )
  )
}

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const orderReviewStyles = StyleSheet.create({
})

OrderReview.propTypes = {
  getOrder: PropTypes.func.isRequired,
  reviewOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrder, reviewOrder })(OrderReview);