import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { useBackButton } from '../../common/BackButtonHandler';
import PropTypes from 'prop-types'

import { PROJECT_URL } from "../../../actions/siteConfig"

import { Layout, Icon, Text, Button, Divider, Spinner, Input } from '@ui-kitten/components';
import { Dimensions, View, StyleSheet, ScrollView, Image } from 'react-native'

import Header from '../../layout/Header'

import { styles } from '../../common/Styles'

import { getOrderItem, reviewProduct, reviewProductOrder } from '../../../actions/logistics'


const ProductReview = ({
  auth: {
    isAuthenticated,
    user
  },
  logistics: {
    orderItemLoading,
    orderItem,
  },
  getOrderItem,
  reviewProduct, reviewProductOrder,

  navigation,
  route,
}) => {

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [orderRating, setOrderRating] = useState(5);
  const [orderComment, setOrderComment] = useState('');

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

  const checkOrderRating = num => {
    if (orderRating >= num) {
      return 'active'
    } else {
      return ''
    }
  }

  const checkOrderText = () => {
    if (orderRating === 5) {
      return 'Excellent!'
    } else if (orderRating === 4) {
      return 'Good!'
    } else if (orderRating === 3) {
      return 'Okay'
    } else if (orderRating === 2) {
      return 'Poor'
    } else if (orderRating === 1) {
      return 'Very Poor'
    }
  }

  const submitProductReview = () => {
    reviewProduct({
      order_item: orderItem.id,
      product_variant: orderItem.product_variant.id,
      userID: user.id,
      rating,
      comment,
    })
  }

  const submitOrderReview = () => {
    reviewProductOrder({
      order: orderItem.order.id,
      userID: user.id,
      rating: orderRating,
      comment: orderComment,
    })
  }

  useEffect(() => {
    isAuthenticated && (
      getOrderItem({
        orderItemID: route.params.orderItemId
      })
    )
  }, []);

  return (
    isAuthenticated ? (
      !orderItemLoading && (orderItem ? orderItem.id === route.params.orderItemId : false) ? (
        orderItem.is_delivered && orderItem.order.user.id === user.id && !user.groups.includes('rider') ? (
          <>
            <Header subtitle='Product Review' backLink={{component:'Bookings'}} navigation={navigation}/>
            <Layout style={{ flex: 1 }} level="2">
              <ScrollView>
                <View style={{ padding: 15, alignItems: 'flex-start'}}>
                  <Text category="h5"style={{ marginBottom: 10, marginLeft: 5, fontFamily: 'Lato-Bold' }}>Review the Delivery</Text>
                </View>
                {!orderItem.is_reviewed ? (
                  <View style={styles.boxWithShadowContainer}>
                    <View style={styles.boxWithShadow}>
                      <View style={[styles.boxHeader, { alignItems: 'center', backgroundColor: 'white' }]}>
                        <Image style={[styles.orderItemImageLarge, { marginBottom: 10 }]} source={{ uri: `${PROJECT_URL}${orderItem.product.thumbnail ? orderItem.product.thumbnail : '/static/frontend/img/no-image.jpg'}`}}></Image>
                        <Text category="h6"style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>How was the {orderItem.product.name}?</Text>
                        <Text style={[{ color: '#9e9e9e' }]}>Order #{orderItem.order.ref_code}</Text>
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
                        <Text style={[styles.small, {alignSelf: 'flex-end'}]}>{comment.length}/1200</Text>
                        <Button
                          style={[{marginVertical: 15}]}
                          onPress={submitProductReview}
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
                        <Image style={[styles.orderItemImageLarge, { marginBottom: 10 }]} source={{ uri: `${PROJECT_URL}${orderItem.product.thumbnail ? orderItem.product.thumbnail : '/static/frontend/img/no-image.jpg'}`}}></Image>
                        <Text category="h6"style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>Product Reviewed</Text>
                        <Text style={[{ color: '#9e9e9e' }]}>Order #{orderItem.order.ref_code}</Text>
                      </View>
                      <Divider/>
                      <View style={[styles.boxBody, { alignItems: 'center' }]}>
                        <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end' }}>
                          {[...Array(parseInt(orderItem.review.rating)).keys()].map(star => <Icon key={star} name='star' fill='#F2BE4D' style={{ height: 23, width: 23}}>star</Icon>)}
                          {[...Array(Math.max(5-parseInt(orderItem.review.rating), 0)).keys()].map(star => <Icon key={star} name='star' fill='#E0E0E0' style={{ height: 23, width: 23}}>star</Icon>)}
                          <Text style={[styles.mute, styles.small, { marginLeft: 5 }]}>({orderItem.review.rating} stars)</Text>
                        </View>
                        <View style={[{flexDirection: 'row'}]}>
                          <Text style={[styles.inputSummary, {flexDirection:'row', flex: 1, minHeight: 150}]}>{orderItem.review.comment}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                {orderItem.order.is_delivered && !orderItem.order.is_reviewed ? (
                  <View style={styles.boxWithShadowContainer}>
                    <View style={styles.boxWithShadow}>
                      <View style={[styles.boxHeader, { alignItems: 'center', backgroundColor: 'white' }]}>
                        <Text category="h6"style={{ marginBottom: 5, fontFamily: 'Lato-Bold' }}>How was the Delivery?</Text>
                        <Text style={[{ color: '#9e9e9e' }]}>Order #{orderItem.order.ref_code}</Text>
                      </View>
                      <Divider/>
                      <View style={[styles.boxBody, { alignItems: 'center' }]}>
                        <Text category="h6" style={[styles.mute, styles.small, { marginBottom: 5 }]}>{checkOrderText()}</Text>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                          <Icon name='star' fill={checkOrderRating(1) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setOrderRating(1)}}>star</Icon>
                          <Icon name='star' fill={checkOrderRating(2) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setOrderRating(2)}}>star</Icon>
                          <Icon name='star' fill={checkOrderRating(3) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setOrderRating(3)}}>star</Icon>
                          <Icon name='star' fill={checkOrderRating(4) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setOrderRating(4)}}>star</Icon>
                          <Icon name='star' fill={checkOrderRating(5) === 'active' ? '#F2BE4D' : '#E0E0E0'} style={{ height: 30, width: 30}} onPress={() => {setOrderRating(5)}}>star</Icon>
                        </View>
                        <Input
                          value={orderComment}
                          multiline={true}
                          textStyle={{ minHeight: 150, textAlignVertical : 'top' }}
                          placeholder='What did you think?'
                          onChangeText={nextValue => setOrderComment(nextValue)}
                          style={{ marginTop: 10, backgroundColor: 'white' }}
                        />
                        <Text style={[styles.small, {alignSelf: 'flex-end'}]}>{orderComment.length}/1200</Text>
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
                        <Text style={[{ color: '#9e9e9e' }]}>Order #{orderItem.order.ref_code}</Text>
                      </View>
                      <Divider/>
                      <View style={[styles.boxBody, { alignItems: 'center' }]}>
                        <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end' }}>
                          {[...Array(parseInt(orderItem.order.review.rating)).keys()].map(star => <Icon key={star} name='star' fill='#F2BE4D' style={{ height: 23, width: 23}}>star</Icon>)}
                          {[...Array(Math.max(5-parseInt(orderItem.order.review.rating), 0)).keys()].map(star => <Icon key={star} name='star' fill='#E0E0E0' style={{ height: 23, width: 23}}>star</Icon>)}
                          <Text style={[styles.mute, styles.small, { marginLeft: 5 }]}>({orderItem.order.review.rating} stars)</Text>
                        </View>
                        <View style={[{flexDirection: 'row'}]}>
                          <Text style={[styles.inputSummary, {flexDirection:'row', flex: 1, minHeight: 150}]}>{orderItem.order.review.comment}</Text>
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

const productReviewStyles = StyleSheet.create({
})

ProductReview.propTypes = {
  getOrderItem: PropTypes.func.isRequired,
  reviewProduct: PropTypes.func.isRequired,
  reviewProductOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrderItem, reviewProduct, reviewProductOrder })(ProductReview);