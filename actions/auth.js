import {
  REQUEST_LOADING, REQUEST_PROCESSED,
  LOGIN_SUCCESS, SOCIAL_AUTH_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, SIGNUP_SUCCESS, SIGNUP_FAIL,
  USER_UPDATED,

  USER_LOADED, USER_LOADING, ACTIVATING_USER, USER_ACTIVATED, ACTIVATION_FAILED,
  PASSWORD_UPDATE,
  ADDRESS_ADDED, ADDRESS_DELETED, ADDRESS_UPDATED,
  
  UPDATE_ERROR, AUTH_ERROR,

  VERIFYING_PASSWORD_RESET, VERIFIED_PASSWORD_RESET, PASSWORD_RESET_VERIFICATION_ERROR,
  PASSWORD_RESET_DONE
} from '../actions/types';

import { Alert } from "react-native";
import axios from 'axios';

import { PROJECT_URL } from "./siteConfig"
console.log('auth url', PROJECT_URL)


export const reroute = ({type, navigation, userLoading, isAuthenticated}) => async dispatch => {
  if (!userLoading) {

    if (type === 'intro') {
      if (isAuthenticated) {
        navigation.navigate("Root", { screen: 'Food'})
      } else {
        navigation.navigate("Login")
      }
    }

    if (type === 'auth') {
      if (isAuthenticated) {
        navigation.navigate("Root", { screen: 'Food'})
      }
    }

    if (type === 'private') {
      if (!isAuthenticated) {
        navigation.navigate("Login")
      }
    }
  }
}

export const login = ({email, password}) => async dispatch => {
  dispatch({ type: USER_LOADING })
  const body = {email, password};

  try {
    const res = await axios.post(`${PROJECT_URL}/api/auth/login`, body)
    if (res.data.status === 'ok') {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          'user': res.data.user,
          'token': res.data.token
        }
      })
    } else {
      Alert.alert(
        "",
        res.data.msg,
        [
          { text: "OK" }
        ],
        { cancelable: true }
      )
    }
  } catch (err) {
    console.log(err)
    Alert.alert(
      "Error",
      "Oops something went wrong, Try again later",
      [
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ],
        { cancelable: false }
      ]
    )
    dispatch({ type: LOGIN_FAIL });
  }
}

export const logout = () => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  try {
    await axios.post(`${PROJECT_URL}/api/auth/logout`, null, tokenConfig(getState))
    dispatch({ type: LOGOUT_SUCCESS })
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

export const signup = ({first_name, last_name, username, email, password}) => async dispatch => {
  // dispatch({ type: USER_LOADING })
  const body = {
    first_name,
    last_name,
    username,
    email,
    password
  };

  try {
    const res = await axios.post(`${PROJECT_URL}/api/auth/signup`, body)
    console.log(res.data)
    if (res.data.status === "okay") {
      dispatch({ type: SIGNUP_SUCCESS })
      return {
        'status': 'okay',
        'msg': 'Please activate your account'
      }
    } else {
      return {
        'status': 'error',
        'msg': res.data.msg
      }
    }
  } catch (err) {
    dispatch({ type: SIGNUP_FAIL });
    return {
      'status': 'Something went wrong. Please try again',
      'msg': res.data.msg
    }
  }
}
export const resendActivation = ({ email }) => async dispatch => {
  const body = {
    email
  }
  try {
    const res = await axios.post(`${PROJECT_URL}/api/auth/resend_activation`, body)
    return {
      'status': res.data.status,
      'msg': res.data.msg
    }
  } catch (err) {
    return {
      'status': 'error',
      'msg': 'Something went wrong. Please try again'
    }
  }
}


export const getFacebookAuthID = async () => {
  const res = await axios.get(`${PROJECT_URL}/api/auth/facebook_keys`)
  return res.data
}
export const socialSignin = ({first_name, last_name, email, facebook_id}, history) => async dispatch => {
  dispatch({
    type: USER_LOADING,
  })

  const fbid = await getFacebookAuthID()
  const body = {
    first_name,
    last_name,
    email,
    facebook_id,
    fbid: fbid.FACEBOOK_AUTH_ID
  }

  try {
    const res = await axios.post(`${PROJECT_URL}/api/auth/social_auth`, body)
    dispatch({
      type: SOCIAL_AUTH_SUCCESS,
      payload: res.data
    })
    history.push('/')
  } catch (err) {
    M.toast({
      html: 'Authentication error',
      displayLength: 3500,
      classes: 'orange'
    });
    dispatch({ type: SIGNUP_FAIL });
  }
}

export const activate = (uidb64, token, history) => async dispatch => {
  dispatch({ type: ACTIVATING_USER })
  const body = {
    uidb64,
    token,
  };
  const res = await axios.post(`${PROJECT_URL}/api/auth/activate`, body)
  if (res.data.status === 'okay') {
    dispatch({
      type: USER_ACTIVATED,
      payload: res.data
    })
    M.toast({
      html: 'You have successfully activated your account!',
      displayLength: 3500,
      classes: 'green'
    });
    history.push('/')
  } else {
    M.toast({
      html: 'Activation error',
      displayLength: 3500,
      classes: 'red'
    });
    dispatch({ type: ACTIVATION_FAILED });
  }
}

export const getServerToken = async () => {
  const res = await axios.get(`${PROJECT_URL}/api/auth/token`)
  return res.data
}

// Check Token and Load User
export const loadUser = () => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  const token = await getServerToken()
  if (token) {
    try {
      const res = await axios.get(`${PROJECT_URL}/api/auth/user`, tokenConfig(getState, token))
      dispatch({
        type: USER_LOADED,
        payload: res.data,
        token: token
      })
    } catch (err) {
      dispatch({type: AUTH_ERROR});
    }
  } else {
    dispatch({type: AUTH_ERROR});
  }
}

export const updateUser = body => async (dispatch, getState) => {
  // dispatch({ type: USER_LOADING });

  try {
    const res = await axios.put(`${PROJECT_URL}/api/auth/user`, body, tokenConfig(getState))
    dispatch({ 
      type: USER_UPDATED,
      payload: res.data
    })
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

export const addAddress = body => async (dispatch, getState) => {
  // dispatch({ type: USER_LOADING });

  try {
    const res = await axios.post(`${PROJECT_URL}/api/auth/address/`, body, tokenConfig(getState))
    dispatch({ 
      type: ADDRESS_ADDED,
      payload: res.data
    })
    return res.data
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

export const getAddress = id => async (dispatch, getState) => {
  if (id) {
    try {
      const res = await axios.get(`${PROJECT_URL}/api/auth/address/${id}/`, tokenConfig(getState))
      return res.data
    } catch (error) {
      return null
    }
  }
}

export const updateAddressName = body => async (dispatch, getState) => {
  // dispatch({ type: USER_LOADING });
  try {
    const res = await axios.put(`${PROJECT_URL}/api/auth/address/${body.id}/`, body, tokenConfig(getState))
    dispatch({ 
      type: ADDRESS_UPDATED,
      payload: body
    })
  } catch (error) {
    dispatch({ type: AUTH_ERROR })
  }
}

export const deleteAddress = id => async (dispatch, getState) => {
  // dispatch({ type: USER_LOADING });

  try {
    const res = await axios.delete(`${PROJECT_URL}/api/auth/address/${id}/`, tokenConfig(getState))
    dispatch({ 
      type: ADDRESS_DELETED,
      payload: id
    })
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

// Update Password
export const updatePassword = (old_password, new_password) => async (dispatch, getState) => {;
  dispatch({ type: USER_LOADING })
  const body = {
    old_password,
    new_password,
  };

  try {
    const res = await axios.put(`${PROJECT_URL}/api/auth/change_password`, body, tokenConfig(getState))
    if (res.data.status === 'okay') {
      dispatch({ type: PASSWORD_UPDATE })
      M.toast({
        html: res.data.message,
        displayLength: 3500,
        classes: 'green',
      });
      return 'okay'
    } else {
      dispatch({ type: UPDATE_ERROR })
      M.toast({
        html: res.data.message,
        displayLength: 3500,
        classes: 'red',
      });
      return 'wrong password'
    }
  } catch (err) {
    dispatch({ type: UPDATE_ERROR })
    M.toast({
      html: 'Session timed out. Please login again.',
      displayLength: 3500,
      classes: 'red',
    });
    return 'error'
  }
}

// Request Password Reset
export const requestPasswordReset = (email) => async (dispatch, getState) => {;
  dispatch({ type: REQUEST_LOADING })
  const body = {
    email
  }

  try {
    const res = await axios.post(`${PROJECT_URL}/api/auth/request_password_reset`, body)
    if (res.data.status === 'okay') {
      M.toast({
        html: res.data.msg,
        displayLength: 3500,
        classes: 'green',
      });
      dispatch({ type: REQUEST_PROCESSED })
      return 'okay'
    } else {
      M.toast({
        html: res.data.msg,
        displayLength: 3500,
        classes: 'red',
      });
      dispatch({ type: REQUEST_PROCESSED })
      return 'error'
    }
  } catch (err) {
    M.toast({
      html: res.data.msg,
      displayLength: 3500,
      classes: 'red',
    });
    dispatch({ type: REQUEST_PROCESSED })
    return 'error'
  }
}

export const verifyPasswordReset = (uidb64, token) => async dispatch => {
  dispatch({ type: VERIFYING_PASSWORD_RESET })
  const body = {
    uidb64,
    token,
  };
  const res = await axios.post(`${PROJECT_URL}/api/auth/verify_password_reset`, body)
  if (res.data.status === 'okay') {
    dispatch({ 
      type: VERIFIED_PASSWORD_RESET,
      payload: res.data
    })
  } else {
    dispatch({ type: PASSWORD_RESET_VERIFICATION_ERROR })
  }
}

export const resetPassword = (uidb64, token, newPassword, history) => async dispatch => {
  dispatch({ type: VERIFYING_PASSWORD_RESET })
  const body = {
    uidb64,
    token,
    new_password: newPassword
  };
  const res = await axios.put(`${PROJECT_URL}/api/auth/reset_password`, body)
  if (res.data.status === 'okay') {
    M.toast({
      html: 'Password reset successful',
      displayLength: 3500,
      classes: 'green',
    });
    dispatch({ type: PASSWORD_RESET_DONE })
    history.push('/login')
  } else {
    dispatch({ type: PASSWORD_RESET_VERIFICATION_ERROR })
  }
}

// Setup config with token
export const tokenConfig = (getState, rtoken) => {
  let token
  if (rtoken) {
    token = rtoken; 
  } else {
    token = getState().auth.token; 
  }
  
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if(token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return config
}