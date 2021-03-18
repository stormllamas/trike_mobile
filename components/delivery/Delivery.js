import React, { useEffect, useState, Fragment } from 'react';
import { default as theme } from '../../custom-theme.json';
import * as eva from '@eva-design/eva';

import { connect } from 'react-redux';
// import PropTypes from 'prop-types'

import { Icon, Layout, Text, Button, Card, Tab, TabBar } from '@ui-kitten/components';
import { LogBox, Dimensions, StyleSheet, ScrollView, SafeAreaView, View, Image, FlatList, TouchableOpacity } from 'react-native'

import { v4 as uuid } from 'uuid'

import Header from '../layout/Header'
import BottomTabs from '../layout/BottomTabs'

import { getCategories } from '../../actions/logistics'


const Delivery = ({
  // logistics: {
  //   categoriesLoading, categories,

  //   // allSellers, allSellersLoading,

  //   // sellersLoading, moreSellersLoading,
  //   // sellers,

  //   // cuisineFilter, keywordsFilter
  // },
  // auth: {current, all_subjects},
  // getCategories,
  navigation
}) => {

  // const [menuVisible, setMenuVisible] = useState(false);
  
  // const CardHeader = (index) => (
  //   <View style={styles.shoppingCardHeader}>
  //     <Image style={styles.shoppingCardImage} source={{ uri: `https://randomuser.me/api/portraits/men/${index}.jpg`}} />
  //   </View>
  // );

  // const CardFooter = (props) => (
  //   <View {...props} style={[props.style, styles.shoppingCardFooter]}>
  //     <Text style={{ fontSize: 16, fontWeight: '700' }}>P250.00</Text>
  //   </View>
  // );

  // const toggleMenu = () => {
  //   setMenuVisible(!menuVisible);
  // };

  
  // useEffect(() => {
  //   console.log('refresh')
  //   getCategories({
  //     categoryQueries: [
  //       'Cuisine'
  //     ]
  //   })
  // }, []);

  // useEffect(() => {
  //   console.log(categoriesLoading)
  // }, [categoriesLoading]);

  const placeholderRange = [...Array(4).keys()];
  const productRange = [...Array(9).keys()];

  return (
    <>
      <Header backLink={{component: 'Root', screen: 'Food'}} navigation={navigation}/>
      <ScrollView level="3">
        <Text>Delivery</Text>
      </ScrollView>
      <Layout>

      </Layout>
    </>
  )
}


let deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
})

// Delivery.propTypes = {
//   // getCategories: PropTypes.func.isRequired,
// }

const mapStateToProps = state => ({
  // auth: state.auth,
  // logistics: state.logistics,
});

export default connect(mapStateToProps, {})(Delivery);