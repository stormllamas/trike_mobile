import React, {useEffect} from 'react';
// import { View, Text, StyleSheet, FlatList, Alert } from 'react-native'
import { Dimensions, StyleSheet, ScrollView, View, Image, FlatList } from 'react-native'
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text, Button, Card } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { default as theme } from './custom-theme.json';
import { default as mapping } from './mapping.json';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './store';

// import PropTypes from 'prop-types'


import {navigationRef} from './components/RootNavigation'

import Intro from './components/common/Intro'
import Login from './components/accounts/Login'
import Profile from './components/accounts/Profile'
import Bookings from './components/accounts/Bookings'
import OrderReview from './components/accounts/review/OrderReview'
import ProductReview from './components/accounts/review/ProductReview'

import Root from './components/RootStackScreen'

import RestaurantDetail from './components/food/RestaurantDetail'
import ProductDetail from './components/food/ProductDetail'
import FoodPayment from './components/food/FoodPayment'

import { loadUser } from './actions/auth'
import { loadSite } from './actions/siteConfig'

const Stack = createStackNavigator();

const App = () => {
  
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadSite());
  });

  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.light, ...theme}} customMapping={mapping}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
            <Stack.Screen
              name="Intro"
              component={Intro}
            />
            <Stack.Screen
              name="Login"
              component={Login}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
            />
            <Stack.Screen
              name="Bookings"
              component={Bookings}
            />
            <Stack.Screen
              name="OrderReview"
              component={OrderReview}
              options={{orderId: null}}
            />
            <Stack.Screen
              name="ProductReview"
              component={ProductReview}
              options={{orderItemId: null}}
            />
            <Stack.Screen
              name="Root"
              component={Root}
            />
            <Stack.Screen
              name="RestaurantDetail"
              component={RestaurantDetail}
              options={{selectedSeller: 'selectedSeller'}}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetail}
              options={{selectedSeller: 'selectedSeller', selectedProduct: 'selectedProduct'}}
            />
            <Stack.Screen
              name="FoodPayment"
              component={FoodPayment}
              options={{selectedSeller: 'selectedSeller'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App;