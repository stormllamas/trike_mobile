import { SITE_LOADING, SITE_LOADED, SET_SIDEBAR_TOGGLER } from './types'
import { PROJECT_URL } from "@env"
import axios from 'axios';

export const loadSite = () => async dispatch => {
  dispatch({ type: SITE_LOADING });
  const res = await axios.get(`${PROJECT_URL}/api/get_site_info`)
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
