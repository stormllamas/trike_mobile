import { SITE_LOADING, SITE_LOADED, SET_SIDEBAR_TOGGLER } from './types'
import axios from 'axios';

export const PROJECT_URL = 'https://trike.com.ph'
// export const PROJECT_URL = 'http://192.168.1.21:8000'
export const GOOGLE_API_KEY = 'AIzaSyBi8DvnA6CTed6XFHBnbXggQG1Ry7YhktA'
export const DEBUG = false

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
