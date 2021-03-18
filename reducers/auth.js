import {
  REQUEST_LOADING, REQUEST_PROCESSED,
  LOGIN_SUCCESS, SOCIAL_AUTH_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, SIGNUP_SUCCESS, SIGNUP_FAIL,

  USER_LOADED, USER_LOADING,
  PASSWORD_UPDATE,
  ADDRESS_ADDED, ADDRESS_DELETED, ADDRESS_UPDATED,
  
  UPDATE_ERROR, AUTH_ERROR,

  ACTIVATING_USER, USER_ACTIVATED, ACTIVATION_FAILED,

  VERIFYING_PASSWORD_RESET, VERIFIED_PASSWORD_RESET, PASSWORD_RESET_VERIFICATION_ERROR,
  PASSWORD_RESET_DONE, USER_UPDATED
} from '../actions/types';
// import moment from 'moment'

const initialState = {
  token: null,
  isAuthenticated: false,
  
  user: null,

  activatingUser: false,
  userLoading: true,
  requestLoading: false,

  passwordResetVerifying: true,
  passwordResetValid: false,
};

export default function(state=initialState, action) {
  switch(action.type) {
    case VERIFYING_PASSWORD_RESET:
      return {
        ...state,
        passwordResetVerifying: true,
      }

    case VERIFIED_PASSWORD_RESET:
      return {
        ...state,
        passwordResetValid: true,
        passwordResetVerifying: false,
        user: action.payload.user
      }

    case PASSWORD_RESET_VERIFICATION_ERROR:
      return {
        ...state,
        passwordResetValid: false,
        passwordResetVerifying: false,
      }

    case PASSWORD_RESET_DONE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        passwordResetVerifying: false,
      }

    case REQUEST_LOADING:
      return {
        ...state,
        requestLoading: true,
      }

    case REQUEST_PROCESSED:
      return {
        ...state,
        requestLoading: false,
      }
      
    case USER_LOADING:
      return {
        ...state,
        userLoading: true,
      }
      
    case ACTIVATING_USER:
      return {
        ...state,
        activatingUser: true,
      }
      
    case USER_ACTIVATED:
      return {
        ...state,
        ...action.payload,
        activatingUser: false,
        isAuthenticated: true,
      }

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        userLoading: false,
        user: action.payload,
        token: action.token ? action.token : state.token
      }

    case USER_UPDATED:
      return {
        ...state,
        userLoading: false,
        user: {
          ...state.user,
          first_name: action.payload.first_name ? action.payload.first_name : state.user.first_name,
          last_name: action.payload.last_name ? action.payload.last_name : state.user.last_name,
          contact: action.payload.contact ? action.payload.contact : state.user.contact,
          gender: action.payload.gender ? action.payload.gender : state.user.gender
        }
      }

    case ADDRESS_ADDED:
      return {
        ...state,
        userLoading: false,
        user: {
          ...state.user,
          addresses: [
            ...state.user.addresses,
            action.payload
          ]
        }
      }

    case ADDRESS_DELETED:
      return {
        ...state,
        userLoading: false,
        user: {
          ...state.user,
          addresses: state.user.addresses.filter(address => address.id !== action.payload)
        }
      }

    case ADDRESS_UPDATED:
      return {
        ...state,
        user : {
          ...state.user,
          addresses: state.user.addresses.map(address => {
            if (address.id === action.payload.id) {
              address.name = action.payload.name
            }
            return address
          })
        },
        userLoading: false
      }

    case PASSWORD_UPDATE:
    case UPDATE_ERROR:
      return {
        ...state,
        userLoading: false,
      }

    case LOGIN_SUCCESS:
    case SOCIAL_AUTH_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        userLoading: false,
      }

    case SIGNUP_SUCCESS:
      return {
        ...state,
        userLoading: false,
      }

    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case SIGNUP_FAIL:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        userLoading: false,
      }

    case ACTIVATION_FAILED:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        activatingUser: false,
      }

    default:
      return state;
  }
}