import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { PROJECT_URL } from "@env"
import { connect } from 'react-redux';
console.log('RestaurantDetail', PROJECT_URL)

import { useBackButton } from '../common/BackButtonHandler';

import FoodCart from './FoodCart'
import RestaurantProduct from './RestaurantProduct'

import { Icon, Layout, Text, Card, Autocomplete, AutocompleteItem, Spinner, Divider, Tab, TabBar } from '@ui-kitten/components';
import { BackHandler, Dimensions, View, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'

import { styles } from '../common/Styles'

import Ionicons from 'react-native-vector-icons/Ionicons'

import Header from '../layout/Header'

import { getSeller, getProducts, setCourse } from '../../actions/logistics'

const productsPlaceholder = (placeholderRange) => (
  placeholderRange.map((item, index) => (
    <Card key={index} style={index % 2 === 0 ? styles.shoppingCardOdd : styles.shoppingCardEven}
      header={() => (
        <View style={styles.shoppingCardHeader}>
          <Image style={styles.shoppingCardImage} source={undefined}/>
        </View>
      )}
    >
      <Text style={{ color: '#FAA634', fontWeight: '700', fontSize: 17}}> </Text>
    </Card>
  ))
)

const RestaurantDetail = ({
  auth: { isAuthenticated, user },
  logistics: { 
    currentOrderLoading,
    currentOrder,

    sellerLoading,
    seller,

    courseFilter,

    productsLoading, moreProductsLoading,
    products
  },
  route,
  navigation,
  getSeller,
  getProducts,
  setCourse
}) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rendered, setRendered] = useState(false)

  const [foodCartActive, setFoodCartActive] = useState(false)

  const handleBackButtonClick = () => {
    if (foodCartActive) {
      setFoodCartActive(false)
      return true;
    } else {
      navigation.goBack()
      return true
    }
  }
  useBackButton(handleBackButtonClick)

  const tabSelected = (index) => {
    setSelectedIndex(index);
    let course;
    if (index == 0) course='Main'
    if (index == 1) course='Drinks'
    if (index == 2) course='Sides'
    if (index == 3) course='Desserts'
    setCourse({ course: course })
  }

  useEffect(() => {
    getSeller({
      sellerQuery: route.params.selectedSeller
    })
    setRendered(true)
    return () => {
      setRendered(true)
    }
  }, []);

  useEffect(() => {
    if (!sellerLoading) {
      setCourse({course: 'Main'})
    }
    return () => {
      if (!sellerLoading) {
        setCourse({course: 'Main'})
      }
    }
  }, [sellerLoading]);
  
  useEffect(() => {
    if (!sellerLoading && courseFilter && seller !== null) {
      getProducts({
        getMore: false
      })
    }
  }, [sellerLoading, courseFilter, seller]);

  const placeholderRange = [...Array(4).keys()];

  return (
    !sellerLoading && rendered ? (
    // !sellerLoading ? (
      seller !== null ? (
        <>
          <Layout>
            <Header backLink={{component:'Root', options: {screen : 'Food'}}} subtitle='Food' navigation={navigation}/>
            {/* {!currentOrderLoading && currentOrder && (
              currentOrder.order_items.length > 0 && (
                <div className="fixed-action-btn">
                  <a className="btn-floating btn-large green modal-trigger waves-effect" data-target="cartmodal">
                    <i className="large material-icons">shopping_cart</i>
                  </a>
                </div>
              )
            )} */}
            <View style={{ padding: 15 }}>
              <Text category="h5" style={{ fontFamily: 'Lato-Bold' }}>{seller.name}</Text>
              {seller.categories.length > 0 && (
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  {seller.categories.map((category, index) => (
                    <Text key={category.id} style={{ marginRight: 10, color: '#6f6f6f' }}>{category.name}</Text>
                  ))}
                </View>
              )}
              <View style={{ marginLeft: -2, marginTop: 5, flexDirection: 'row', marginTop: 20 }}>
                {seller.review_count > 0 ? [...Array(seller.total_rating).keys()].map(star => <Icon key={star} name='star' fill='#F2BE4D' style={{ height: 23, width: 23}}>star</Icon>) : <View style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e8e8e8', borderRadius: 4 }}><Text  style={{ color: '#222222'}}>Unrated</Text></View>}
                {seller.review_count > 0 && [...Array(Math.max(5-seller.total_rating, 0)).keys()].map(star => <Icon key={star} name='star' fill='#DEDEDE' style={{ height: 23, width: 23}}>star</Icon>)}
                {seller.review_count > 0 && <Text style={{ fontSize: 14, alignSelf: 'flex-end', color: "#7F7F7F", marginLeft: 5 }}>{seller.total_rating_unrounded.toFixed(2)} ({seller.review_count} ratings)</Text>}
              </View>
            </View>
          </Layout>
          <Divider/>
          <Layout>
            <TabBar
              selectedIndex={selectedIndex}
              onSelect={index => tabSelected(index)}>
              <Tab title='MEALS' icon={props => <Ionicons name="fast-food-outline" size={28} color={selectedIndex == 0 ? "#FBA535":"#909CB4"}></Ionicons>}/>
              <Tab title='DRINKS' icon={props => <Ionicons  name="beer-outline" size={28} color={selectedIndex == 1 ? "#FBA535":"#909CB4"}></Ionicons>}/>
              <Tab title='SIDES' icon={props => <Ionicons name="pizza-outline" size={28} color={selectedIndex == 2 ? "#FBA535":"#909CB4"}></Ionicons>}/>
              <Tab title='DESSERTS' icon={props => <Ionicons name="ice-cream-outline" size={28} color={selectedIndex == 3 ? "#FBA535":"#909CB4"}></Ionicons>}/>
            </TabBar>
          </Layout>
          <Divider/>
          <IOScrollView>
            <Layout style={{ padding: 15 }}>
              <Text category="h6" style={{marginBottom: 10, fontFamily: 'Lato-Bold'}}>Featured Items</Text>
              <FlatList
                horizontal={true}
                data={seller.features}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { selectedProduct: item.name, selectedSeller: item.seller.name })}>
                    <View key={item.id} style={restaurantDetailStyles.featureWrapper}>
                      <Image style={restaurantDetailStyles.featureImage} source={{ uri: `${PROJECT_URL}${item.thumbnail}` }} />
                      <Text style={[restaurantDetailStyles.featureText]}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={feature => feature.id.toString()}
              />
            </Layout>
            <Divider/>
            <Layout level="2" style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 6, paddingBottom: 75 }}>
              {!productsLoading ? (
                products.results.length > 0 ? (
                  products.results[0].seller.name == route.params.selectedSeller ? (
                    products.results.map((product, index) => (
                      <RestaurantProduct key={product.id} product={product} products={products} index={index} productsLoading={productsLoading} styles={styles} navigation={navigation}/>
                    ))
                  ) : (
                    productsPlaceholder(placeholderRange)
                  )
                ) : (
                  <View style={styles.fullContainerSmall}>
                    <Image style={{ height: 200, width: 205 }} source={{ uri: `${PROJECT_URL}/static/frontend/img/Trike_no_products.png` }} />
                    <Text style={{ color: '#FAA634', fontWeight: '700', fontSize: 26}}>No Products Found</Text>
                  </View>
                )
              ) : (
                productsPlaceholder(placeholderRange)
              )}
            </Layout>
            {moreProductsLoading ? (
              <Layout level="2" style={{ alignItems: 'center', padding: 10 }}>
                <Spinner size='medium'></Spinner>
              </Layout>
            ) : undefined}
          </IOScrollView>
          {isAuthenticated && !user.groups.includes('rider') && !currentOrderLoading && currentOrder !== null && currentOrder.order_type === 'food' && currentOrder.order_items.length > 0 ? (
            <Ionicons style={styles.foodCartButton} name="cart" size={28} color={"#ffffff"} onPress={() => setFoodCartActive(!foodCartActive)}/>
          ) : undefined}
          
          <FoodCart seller={seller} foodCartActive={foodCartActive} setFoodCartActive={setFoodCartActive} navigation={navigation}/>
        </>
      ) : (
        <>
          <Text>Not Found</Text>
        </>
      )
    ) : <></>
  )
}


let deviceWidth = Dimensions.get('window').width

const restaurantDetailStyles = StyleSheet.create({
  featureWrapper: {
    paddingRight: 10,
  },
  featureImage: {
    borderRadius: 15,
    width: (deviceWidth/2.5)-20,
    height: (deviceWidth/2.5)-20,
  },
  featureText: {
    marginTop: 5,
    width: (deviceWidth/2.5)-20,
  },
})

RestaurantDetail.propTypes = {
  getSeller: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,
  setCourse: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  logistics: state.logistics,
  auth: state.auth,
});

export default connect(mapStateToProps, { getSeller, getProducts, setCourse })(RestaurantDetail);