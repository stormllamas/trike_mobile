import { SITE_LOADING, SITE_LOADED, SET_SIDEBAR_TOGGLER } from './types'
import axios from 'axios';

const trikeURL = 'https://www.trike.com.ph'

export const loadSite = () => async dispatch => {
  dispatch({ type: SITE_LOADING });
  const res = await axios.get(`${trikeURL}/api/get_site_info`)
  dispatch({
    type: SITE_LOADED,
    payload: res.data
  });
}

export const setMenuToggler = sideBarToggler => async dispatch => {
  dispatch({
    type: SET_SIDEBAR_TOGGLER,
    payload: sideBarToggler
  });
}
