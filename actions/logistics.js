import { PROJECT_URL } from "@env"
import axios from 'axios';
import { Alert } from 'react-native'
console.log('logistics url', PROJECT_URL)

import {
  CATEGORIES_LOADING, GET_CATEGORIES,
  CATEGORIES_ERROR,

  CURRENT_ORDER_LOADING, GET_CURRENT_ORDER,
  CURRENT_ORDER_ERROR,

  ORDERS_LOADING, MORE_ORDERS_LOADING,
  GET_ORDERS, ORDERS_ERROR,
  GET_MORE_ORDERS, SET_ORDERS_PAGE,
  FILTER_CURRENT_ONLY,

  ORDER_LOADING,
  GET_ORDER,
  ORDER_ERROR,
  REVIEW_ORDER,

  ORDER_ITEM_LOADING, GET_ORDER_ITEM,
  ORDER_ITEM_ERROR,
  REVIEW_PRODUCT,
  REVIEW_PRODUCT_ORDER,

  QUANTITY_LOADING,
  QUANTITY_CHANGED,
  QUANTITY_CHANGE_ERROR,

  CANCEL_ORDER,

  FILTER_KEYWORDS, CLEAR_KEYWORDS,
  FILTER_CUISINE, CLEAR_CUISINE,
  FILTER_COURSE,

  ALL_SELLERS_LOADING, GET_ALL_SELLERS, ALL_SELLERS_ERROR,
  SELLERS_LOADING, MORE_SELLERS_LOADING,
  GET_SELLERS, GET_MORE_SELLERS, SET_SELLERS_PAGE,
  SELLERS_ERROR,

  SELLER_LOADING,
  GET_SELLER,
  SELLER_ERROR,

  PRODUCTS_LOADING, MORE_PRODUCTS_LOADING,
  GET_PRODUCTS, GET_MORE_PRODUCTS, SET_PRODUCTS_PAGE,
  PRODUCTS_ERROR,

  PRODUCT_LOADING,
  GET_PRODUCT,
  PRODUCT_ERROR,
  
  DELETE_LOADING,
  DELETE_ORDER_ITEM,
  DELETE_ERROR,

  CHECKOUT_LOADING,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILED,

  COMPLETE_ORDER_LOADING,
  COMPLETE_ORDER_SUCCESS,
  COMPLETE_ORDER_FAILED,

  SYNC_ORDER,

  AUTH_ERROR,
} from './types'

import { tokenConfig } from './auth';

export const getCategories = ({ categoryQueries }) => async (dispatch, getState) => {
  dispatch({ type: CATEGORIES_LOADING });

  try {
    let queries = '?'
    categoryQueries.forEach(query => {
      queries += `&group=${query}`
    })
    const categories = await axios.get(`${PROJECT_URL}/api/category/${queries}`)
    // console.log(categories.data)

    dispatch({
      type: GET_CATEGORIES,
      payload: categories.data,
    })
  } catch (err) {
    dispatch({ type: CATEGORIES_ERROR });
    // dispatch({ type: AUTH_ERROR});
  }
}

export const updateSellersQuery = history => async (dispatch, getState) => {
  let cuisinePath = '', keywordsPath = ''
  const { cuisineFilter, keywordsFilter } = getState().logistics;

  // Set Paths
  if (cuisineFilter) cuisinePath = `&cuisine=${cuisineFilter.replaceAll(' ', '-').replaceAll('&', 'and')}`
  if (keywordsFilter) keywordsPath = `&keywords=${keywordsFilter.replaceAll(' ', '-').replaceAll('&', 'and')}`

  history.push({ search: `?${keywordsPath}${cuisinePath}`})
}

const setSellerQueries = (getState) => {
  let cuisineQuery = '', keywordsQuery = ''
  const { cuisineFilter, keywordsFilter } = getState().logistics;
  
  // Set Queries
  if (cuisineFilter) cuisineQuery = `&cuisine=${cuisineFilter}`
  if (keywordsFilter) keywordsQuery = `&keywords=${keywordsFilter}`

  return {cuisineQuery, keywordsQuery}
}
export const getAllSellers = () => async (dispatch, getState) => {
  try {
    await dispatch({ type: ALL_SELLERS_LOADING });
    const res = await axios.get(`${PROJECT_URL}/api/all_sellers/`)
    dispatch({
      type: GET_ALL_SELLERS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: ALL_SELLERS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const getSellers = ({ getMore, keywordsQuery }) => async (dispatch, getState) => {
  try {
    if (!getMore) {
      await dispatch({ type: SELLERS_LOADING });
      const { cuisineQuery, keywordsQuery } = setSellerQueries(getState)
      const res = await axios.get(`${PROJECT_URL}/api/sellers/?${cuisineQuery}${keywordsQuery}`)
      dispatch({
        type: GET_SELLERS,
        payload: res.data,
      })
    } else {
      dispatch({ type: MORE_SELLERS_LOADING });
      await dispatch({
        type: SET_SELLERS_PAGE,
        payload: getState().logistics.sellersCurrentPage + 1,
      })
      const { cuisineQuery, keywordsQuery } = setSellerQueries(getState)
      const { sellersCurrentPage } = getState().logistics;
      const pageQuery = `?page=${sellersCurrentPage}`
      const res = await axios.get(`${PROJECT_URL}/api/sellers/${pageQuery}${cuisineQuery}${keywordsQuery}`)
      dispatch({
        type: GET_MORE_SELLERS,
        payload: res.data,
      })
    }
  } catch (err) {
    dispatch({ type: SELLERS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const getSeller = ({ sellerQuery }) => async (dispatch, getState) => {
  dispatch({ type: SELLER_LOADING });
  dispatch({ type: PRODUCTS_LOADING });
  try {
    const res = await axios.get(`${PROJECT_URL}/api/seller/${sellerQuery}/`)
    await dispatch({
      type: GET_SELLER,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: SELLER_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}

export const setCuisine = ({ cuisine }) => async (dispatch, getState) => {
  dispatch({
    type: FILTER_CUISINE,
    payload: cuisine,
  })
}
export const clearCuisine = () => {return { type: CLEAR_CUISINE }}
export const setKeywords = text => async dispatch => {
  dispatch({
    type: FILTER_KEYWORDS,
    payload: text,
  })
}
export const clearKeywords = () => {return { type: CLEAR_KEYWORDS }}


export const getProducts = ({ getMore }) => async (dispatch, getState) => {

  try {
    if (!getMore) {
      dispatch({ type: PRODUCTS_LOADING });
      const { productsCurrentPage, courseFilter, seller } = getState().logistics;
      const productsQuery = `&page=${productsCurrentPage}&course=${courseFilter ? courseFilter : ''}`
      const seller_products = await axios.get(`${PROJECT_URL}/api/products/?seller=${seller.name_to_url}${productsQuery}`)
      dispatch({
        type: GET_PRODUCTS,
        payload: seller_products.data,
      })
    } else {
      dispatch({ type: MORE_PRODUCTS_LOADING });
      await dispatch({
        type: SET_PRODUCTS_PAGE,
        payload: getState().logistics.productsCurrentPage + 1,
      })
      const { productsCurrentPage, courseFilter, seller } = getState().logistics;
      const productsQuery = `&page=${productsCurrentPage}&course=${courseFilter ? courseFilter : ''}`
      const seller_products = await axios.get(`${PROJECT_URL}/api/products/?seller=${seller.name_to_url}${productsQuery}`)
      dispatch({
        type: GET_MORE_PRODUCTS,
        payload: seller_products.data,
      })
    }
  } catch (err) {
    dispatch({ type: PRODUCTS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const getProduct = ({ productQuery, sellerQuery }) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_LOADING });
    const res = await axios.get(`${PROJECT_URL}/api/product/${productQuery}/${sellerQuery}/`)
    dispatch({
      type: GET_PRODUCT,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: PRODUCT_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const setCourse = ({ course }) => async (dispatch, getState) => {
  dispatch({
    type: FILTER_COURSE,
    payload: course,
  })
}


export const getCurrentOrder = ({ type, query, updateOnly }) => async (dispatch, getState) => {
  !updateOnly && dispatch({ type: CURRENT_ORDER_LOADING });
  try {
    const res = await axios.get(`${PROJECT_URL}/api/current_order/${type}/${query ? query : ''}`, tokenConfig(getState))
    dispatch({
      type: GET_CURRENT_ORDER,
      payload: res.data,
    })
  } catch (err) {
    console.log(err)
    dispatch({ type: CURRENT_ORDER_ERROR });
    dispatch({ type: AUTH_ERROR });
  }
}
export const getOrders = ({ getMore }) => async (dispatch, getState) => {
  try {
    if (!getMore) {
      dispatch({ type: ORDERS_LOADING });
      const { ordersCurrentPage, currentOnly } = getState().logistics;
      const ordersQuery = `page=${ordersCurrentPage}`
      const orders = await axios.get(`${PROJECT_URL}/api/orders/?${ordersQuery}${currentOnly ? `&delivered=false`: ''}`, tokenConfig(getState))
      dispatch({
        type: GET_ORDERS,
        payload: orders.data,
      })
    } else {
      dispatch({ type: MORE_ORDERS_LOADING });
      await dispatch({
        type: SET_ORDERS_PAGE,
        payload: getState().logistics.ordersCurrentPage + 1,
      })
      const { ordersCurrentPage, currentOnly } = getState().logistics;
      const ordersQuery = `?page=${ordersCurrentPage}`
      const orders = await axios.get(`${PROJECT_URL}/api/orders/${ordersQuery}${currentOnly ? `&delivered=false`: ''}`, tokenConfig(getState))
      dispatch({
        type: GET_MORE_ORDERS,
        payload: orders.data,
      })
    }
  } catch (err) {
    dispatch({ type: ORDERS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const getOrder = ({ orderID }) => async (dispatch, getState) => {
  dispatch({type: ORDER_LOADING});
  try {
    const res = await axios.get(`${PROJECT_URL}/api/order/${orderID}/`, tokenConfig(getState))
    dispatch({
      type: GET_ORDER,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: AUTH_ERROR});
    dispatch({type: ORDER_ERROR});
  }
}
export const setCurrentOnly = ({ bool }) => async (dispatch, getState) => {
  dispatch({
    type: FILTER_CURRENT_ONLY,
    payload: bool
  })
}


export const addOrderItem = ({ productId, sellerID }) => async (dispatch, getState) => {
  const body = {
    order: getState().logistics.currentOrder.id,
    product_variant: productId
  }
  try {
    const res = await axios.post(`${PROJECT_URL}/api/order_item/`, body, tokenConfig(getState))
    console.log(res.data)
    await dispatch(getCurrentOrder({
      type: 'food',
      query: `?order_seller=${sellerID}`,
      updateOnly: true
    }));
    // M.toast({
    //   html: res.data.msg,
    //   displayLength: 3500,
    //   classes: res.data.class,
    // });
  } catch (err) {
    dispatch({ type: AUTH_ERROR});
  }
}
export const deleteOrderItem = ({ id, sellerID }) => async (dispatch, getState) => {
  dispatch({ type: DELETE_LOADING });
  try {
    await axios.delete(`${PROJECT_URL}/api/order_item/${id}/`, tokenConfig(getState))
    await dispatch(getCurrentOrder({
      type: 'food',
      query: `?order_seller=${sellerID}`,
      updateOnly: true
    }));
    dispatch({
      type: DELETE_ORDER_ITEM,
      payload: id
    })
  } catch (err) {
    dispatch({ type: DELETE_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const changeQuantity = ({ orderItemID, sellerID, operation }) => async (dispatch, getState) => {
  dispatch({ type: QUANTITY_LOADING })  
  try {
    const res = await axios.put(`${PROJECT_URL}/api/change_quantity/${orderItemID}/${operation}/`, null, tokenConfig(getState))
    if (res.data.status === 'okay') {
      dispatch({ type: QUANTITY_CHANGED })
      dispatch(getCurrentOrder({
        type: 'food',
        query: `?order_seller=${sellerID}`,
        updateOnly:true
      }))
    } else {
      dispatch({ type: QUANTITY_CHANGE_ERROR })
    }
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
    dispatch({ type: QUANTITY_CHANGE_ERROR })
  }
}
export const cancelOrder = ({ id }) => async (dispatch, getState) => {
  try {
    const res = await axios.put(`${PROJECT_URL}/api/cancel_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      await dispatch(getOrders({
        getMore: false,
      }))
      if (res.data.status === 'error') {
        Alert.alert(
          "Error",
          res.data.msg,
          [
            { text: "OK" }
          ]
        );
      }
    } else {
      dispatch({
        type: CANCEL_ORDER,
        payload: res.data.id
      });
      Alert.alert(
        "Order Canceled",
        '',
        [
          { text: "OK" }
        ]
      );
    }
  } catch (err) {
    await dispatch(getOrders({
      page: 1,
      claimed: false,
      delivered: false,
      keywords: ''
    }))
  }
}


export const foodCheckout = ({ formData, orderSeller, navigation }) => async (dispatch, getState) => {
  // dispatch({ type: CHECKOUT_LOADING })
  try {
    const orderBody = {
      // user: getState().auth.user.id,
      vehicle_chosen: formData.vehicleChoice,
  
      first_name: formData.firstName,
      last_name: formData.lastName,
      contact: formData.contact,
      email: formData.email,
      gender: formData.gender,

      description: formData.description,
  
      loc1_latitude: parseFloat(formData.pickupLat),
      loc1_longitude: parseFloat(formData.pickupLng),
      loc1_address: formData.pickupAddress,
      loc2_latitude: parseFloat(formData.deliveryLat),
      loc2_longitude: parseFloat(formData.deliveryLng),
      loc2_address: formData.deliveryAddress,
      distance_text: formData.distanceText,
      distance_value: formData.distanceValue,
      duration_text: formData.durationText,
      duration_value: formData.durationValue,
    }
    console.log(orderBody)
    const res = await axios.put(`${PROJECT_URL}/api/food_checkout/${orderSeller.id}/`, orderBody, tokenConfig(getState))
    if (res.data.status === "okay") {
      dispatch({ type: CHECKOUT_SUCCESS })
      navigation.navigate('FoodPayment', { selectedSeller: orderSeller.name })
    } else {
      dispatch({ type: CHECKOUT_FAILED })
      Alert.alert(
        "Error",
        res.data.msg,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
      await dispatch(getCurrentOrder({
        type: 'food',
        query: `?order_seller=${orderSeller.id}`,
        updateOnly: true
      }));
    }
  } catch (err) {
    console.log('error', err)
  }
}
export const confirmDelivery = ({ formData, navigation }) => async (dispatch, getState) => {
  // dispatch({ type: CURRENT_ORDER_LOADING });

  try {
    const orderBody = {
      user: getState().auth.user.id,
      rider_payment_needed: formData.riderPaymentNeeded,
      two_way: formData.twoWay,
      vehicle_chosen: formData.vehicleChoice,

      first_name: formData.firstName,
      last_name: formData.lastName,
      contact: formData.contact,
      email: formData.email,
      gender: formData.gender,

      description: formData.description,
      
      unit: formData.unit ? formData.unit : null,
      weight: formData.weight ? formData.weight : 0,
      height: formData.height ? formData.height : 0,
      width: formData.width ? formData.width : 0,
      length: formData.length ? formData.length : 0,
      
      promo_code: formData.promoCode,

      loc1_latitude: parseFloat(formData.pickupLat),
      loc1_longitude: parseFloat(formData.pickupLng),
      loc1_address: formData.pickupAddress,
      loc2_latitude: parseFloat(formData.deliveryLat),
      loc2_longitude: parseFloat(formData.deliveryLng),
      loc2_address: formData.deliveryAddress,
      distance_text: formData.distanceText,
      distance_value: formData.distanceValue,
      duration_text: formData.durationText,
      duration_value: formData.durationValue,
    }
    const res = await axios.put(`${PROJECT_URL}/api/current_order/delivery/`, orderBody, tokenConfig(getState))
    navigation.navigate('DeliveryPayment')
  } catch (err) {
    console.log('error', err)
  }
}
export const confirmRideHail = ({ formData, history }) => async (dispatch, getState) => {
  dispatch({ type: CURRENT_ORDER_LOADING });

  const origin = new google.maps.LatLng(formData.pickupLat, formData.pickupLng);
  const destination =  new google.maps.LatLng(formData.deliveryLat, formData.deliveryLng);

  try {
    const distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: 'DRIVING',
    }, async (response, status) => {
      if (status === 'OK') {
        const distanceString = response.rows[0].elements[0].distance.text
        const distanceValue = response.rows[0].elements[0].distance.value
        const durationString = response.rows[0].elements[0].duration.text
        const durationValue = response.rows[0].elements[0].duration.value
        const orderBody = {
          user: getState().auth.user.id,
          vehicle_chosen: formData.vehicleChoice,

          first_name: formData.firstName,
          last_name: formData.lastName,
          contact: formData.contact,
          email: formData.email,
          gender: formData.gender,

          loc1_latitude: parseFloat(formData.pickupLat),
          loc1_longitude: parseFloat(formData.pickupLng),
          loc1_address: formData.pickupAddress,
          loc2_latitude: parseFloat(formData.deliveryLat),
          loc2_longitude: parseFloat(formData.deliveryLng),
          loc2_address: formData.deliveryAddress,
          distance_text: distanceString,
          distance_value: distanceValue,
          duration_text: durationString,
          duration_value: durationValue,
        }
        const currentOrder = await axios.put(`${PROJECT_URL}/api/current_order/ride_hail/`, orderBody, tokenConfig(getState))
        history.push('/ride_hail/payments')
      }
    });
  } catch (err) {
    console.log('error', err.data)
  }
}
export const finalizeTransaction = ({ authID, currentOrder, history, type, query }) => async (dispatch, getState) => {
  dispatch({ type: COMPLETE_ORDER_LOADING });

  let paypalkeys
  try {
    const res = await axios.get(`${PROJECT_URL}/api/auth/paypal_keys`, tokenConfig(getState))
    paypalkeys = res.data
  } catch (err) {
    dispatch({type: AUTH_ERROR});
    M.toast({
      html: 'Session Timed Out',
      displayLength: 5000,
      classes: 'red'
    });
  }
  const paypalClient = paypalkeys['PAYPAL_CLIENT_ID']
  const paypalSecret = paypalkeys['PAYPAL_CLIENT_SECRET']
  const paypalOauth = 'https://api.sandbox.paypal.com/v1/oauth2/token/'
  const paypalAuth = 'https://api.sandbox.paypal.com/v2/payments/authorizations/'

  // Get access token
  const basicAuth = btoa(`${ paypalClient }:${ paypalSecret }`)
  const config = {
    headers: {
      Accept: `application/json`,
      Authorization: `Basic ${ basicAuth }`
    },
  }
  const auth = await axios.post(paypalOauth, `grant_type=client_credentials`, config)

  // Capture or Void Transaction
  const authConfig = {
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${ auth.data.access_token }`
    }
  }

  try {
    const capture = await axios.post(paypalAuth+authID+'/capture/', {}, authConfig)
    const body = {
      'auth_id': authID,
      'capture_id': capture.data.id,
    }
    await axios.put(`${PROJECT_URL}/api/complete_order/2/${type}/${query ? query : ''}`, body, tokenConfig(getState))
    dispatch({ type: COMPLETE_ORDER_SUCCESS });
    M.toast({
      html: 'Delivery Booked',
      displayLength: 5000,
      classes: 'green'
    });
    $('.loader').fadeOut();
    history.push('/')
  } catch (err) {
    await axios.post(paypalAuth+authID+'/void', {}, authConfig)
    dispatch({ type: COMPLETE_ORDER_FAILED });
    dispatch({ type: AUTH_ERROR });
    M.toast({
      html: 'Session timed out. Please login again.',
      displayLength: 5000,
      classes: 'red'
    });
  }
}
export const proceedWithCOD = ({ navigation, type, query, socket }) => async (dispatch, getState) => {
  // dispatch({ type: COMPLETE_ORDER_LOADING });
  try {
    const res = await axios.put(`${PROJECT_URL}/api/complete_order/1/${type}/${query ? query : ''}`, null, tokenConfig(getState))
    if (res.data.status === 'success') {
      dispatch({ type: COMPLETE_ORDER_SUCCESS });
      Alert.alert(
        "Success",
        "Order Booked!",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
      navigation.navigate('Bookings')
    } else {
      dispatch({ type: COMPLETE_ORDER_FAILED });
      Alert.alert(
        "Error",
        "'You already reviewed that'",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
      if (type === 'food') {
        navigation.navigate('RestaurantDetail', { selectedSeller: res.data.seller_name_to_url })
      } else {
        navigation.navigate('Bookings')
      }
    }
    // axios.post(`${PROJECT_URL}/api/new_order_update/`, { 'ref_code': res.data.ref_code }, tokenConfig(getState))
  } catch (error) {
    console.log(error)
    dispatch({ type: COMPLETE_ORDER_FAILED });
    Alert.alert(
      "Error",
      "Something went wrong. Please try again",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK" }
      ]
    );
  }
}


export const getOrderItem = ({ orderItemID }) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_ITEM_LOADING });
    const res = await axios.get(`${PROJECT_URL}/api/order_item/${orderItemID}/`, tokenConfig(getState))
    dispatch({
      type: GET_ORDER_ITEM,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: ORDER_ITEM_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const reviewProduct = ({ order_item, product_variant, userID, rating, comment }) => async (dispatch, getState) => {
  const body = {
    order_item,
    product_variant,
    user: userID,
    rating,
    comment
  }
  try {
    const res = await axios.post(`${PROJECT_URL}/api/review_product/`, body, tokenConfig(getState));
    if (res.data.status === "okay") {
      dispatch({
        type: REVIEW_PRODUCT,
        payload: res.data,
        orderItemId: order_item
      })
    } else if (res.data.status === "error") {
      Alert.alert(
        "Error",
        "'You already reviewed that'",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
    }
  } catch (err) {
    console.error(err)
    Alert.alert(
      "Error",
      "'You already reviewed that'",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK" }
      ]
    );
  }
}
export const reviewProductOrder = ({ order, userID, rating, comment, history }) => async (dispatch, getState) => {
  const body = {
    order,
    user: userID,
    rating,
    comment
  }
  try {
    const res = await axios.post(`${PROJECT_URL}/api/review_order/`, body, tokenConfig(getState));
    if (res.data.status === "okay") {
      dispatch({
        type: REVIEW_PRODUCT_ORDER,
        payload: res.data,
        orderId: order
      })
    } else if (res.data.status === "error") {
      Alert.alert(
        "Error",
        "'You already reviewed that'",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
    }
  } catch (err) {
    console.error(err)
    Alert.alert(
      "Error",
      "'You already reviewed that'",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK" }
      ]
    );
  }
}
export const reviewOrder = ({ order, userID, rating, comment, history }) => async (dispatch, getState) => {
  const body = {
    order,
    user: userID,
    rating,
    comment
  }
  try {
    const res = await axios.post(`${PROJECT_URL}/api/review_order/`, body, tokenConfig(getState));
    if (res.data.status === "okay") {
      dispatch({
        type: REVIEW_ORDER,
        payload: res.data,
        orderId: order
      })
    } else if (res.data.status === "error") {
      Alert.alert(
        "Error",
        "'You already reviewed that'",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
    }
  } catch (err) {
    console.error(err)
    Alert.alert(
      "Error",
      "'You already reviewed that'",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK" }
      ]
    );
  }
}

export const syncOrder = ({ data }) => async (dispatch, getState) => {
  dispatch({
    type: SYNC_ORDER,
    payload: data
  })
}