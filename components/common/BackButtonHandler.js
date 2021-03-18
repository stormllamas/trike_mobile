import React, { useEffect } from 'react';

import { BackHandler, Animated, Easing, Dimensions, View, Image, TouchableWithoutFeedback } from 'react-native'


export const useBackButton = (handler) => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler);
    
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handler);
    };
  }, [handler]);
}