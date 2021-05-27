
import React from 'react';
import axios from 'axios';

import { GOOGLE_API_KEY } from './siteConfig'

// Gets a latLng or placeId param
// Requests information of param coordinates
// Returns an object of the first address with no Unnamed Road
export const locationGeocode = async ({latLng, placeId}) => {
  try {
    let res
    if(latLng) {
      res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&key=${GOOGLE_API_KEY}`)
    } else if (placeId) {
      res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`)
    }
    for (let i=0; i < res.data.results.length; i++) {
      if (!res.data.results[i].formatted_address.includes('Unnamed Road')) {
        return {
          status: 'ok',
          data: res.data.results[i]
        }
      }
    }
  } catch (err) {
    console.log('error', err)
    return {
      status: 'error',
      data: err
    }
  }
}

// Gets origin and destionation param
// Requests and Returns distance information
export const getDistance = async ({ origin, destination }) => {
  try {
    const res = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_API_KEY}`)
    if (res.data.status === 'OK' && res.data.rows[0].elements[0].distance) {
      return {
        status: 'ok',
        data: {
          distanceText: res.data.rows[0].elements[0].distance.text,
          distanceValue: res.data.rows[0].elements[0].distance.value,
          durationText: res.data.rows[0].elements[0].duration.text,
          durationValue: res.data.rows[0].elements[0].duration.value
        }
      }
    } else {
      return {
        status: 'error',
        data: 'no distance returned'
      }
    }
  } catch (err) {
    console.log('error', err.data)
    return {
      status: 'error',
      data: err
    }
  }
}