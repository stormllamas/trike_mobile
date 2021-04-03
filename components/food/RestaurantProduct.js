import React, { useRef, useCallback } from 'react';
import { Icon, Text, Card } from '@ui-kitten/components';
import { PROJECT_URL } from "@env"
import { Dimensions, View, StyleSheet, Image } from 'react-native'

import PropTypes from 'prop-types'

import { InView } from 'react-native-intersection-observer'

import { connect } from 'react-redux';
import { getProducts } from '../../actions/logistics';


const RestaurantProduct = ({ productsLoading, product, products, index, getProducts, navigation, styles }) => {

  const CardHeader = ({ picture }) => (
    <View style={styles.shoppingCardHeader}>
      <Image style={styles.shoppingCardImage} source={{ uri: picture }} />
    </View>
  );

  const lastProductElement = (inView) => {
    if (inView && products.results.length == index+1 && products.next !== null && !productsLoading) {
      getProducts({
        getMore: true
      })
    }
  }
  
  return (
    <InView onChange={inView => lastProductElement(inView)}>
      <Card style={index % 2 === 0 ? styles.shoppingCardOdd : styles.shoppingCardEven}
        header={() => CardHeader({ picture: `${PROJECT_URL}${product.thumbnail}` })}
        onPress={() => navigation.navigate('ProductDetail', { selectedProduct: product.name, selectedSeller: product.seller.name })}
      >
        {product.cheapest_variant.sale_price_active ? (
          <Text><Text>₱ { product.cheapest_variant.price }</Text><Text>-{ product.cheapest_variant.percent_off }%</Text> {product.cheapest_variant.final_price ? `₱ ${product.cheapest_variant.final_price}` : ''}</Text>
        ) : (
          <Text style={{ color: '#FAA634', fontSize: 17, fontFamily: 'Lato-Bold'}}>{product.cheapest_variant.price ? `₱ ${product.cheapest_variant.price.toFixed(2)}` : ''}</Text>
        )}
        <View style={{ alignItems: 'flex-start' }}>
          {product.review_count > 0 ? (
            <View style={{ marginLeft: -2, marginTop: 5, flexDirection: 'row' }}>
              {[...Array(product.total_rating).keys()].map(star => <Icon key={star} name='star' fill='#F2BE4D' style={{ height: 23, width: 23}}>star</Icon>)}
            </View>
          ) : (
            <View style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e8e8e8', borderRadius: 4, marginVertical: 5 }}>
              <Text  style={{ color: '#222222' }}>Unrated</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 16, fontFamily: 'Lato-Bold' }}>{product.name}</Text>
      </Card>
    </InView>
  )
}


RestaurantProduct.propTypes = {
  getProducts: PropTypes.func.isRequired,
}

export default connect(null, { getProducts })(RestaurantProduct);