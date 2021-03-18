import React, { Fragment, useEffect, useState, useRef } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { useBackButton } from '../common/BackButtonHandler';

import FoodCart from './FoodCart'
import RestaurantProduct from './RestaurantProduct'

import { Icon, Text, Button, Radio, RadioGroup } from '@ui-kitten/components';
import { Dimensions, View, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel';

import Ionicons from 'react-native-vector-icons/Ionicons'

import Header from '../layout/Header'

import { getProduct, addOrderItem } from '../../actions/logistics'


const ProductDetail = ({
  auth: {
    user,
    userLoading,
    isAuthenticated,
  },
  siteConfig: {
    siteInfoLoading,
    siteInfo
  },
  logistics: { 
    currentOrderLoading,
    currentOrder,

    productLoading,
    product,

    quantityLoading,
    deleteLoading,
    checkoutLoading,
  },
  getProduct,
  addOrderItem,

  navigation,
  route,
}) => {

  const [rendered, setRendered] = useState(false)

  const [productImages, setProductImages] = useState([])
  const [activeSlide, setActiveSlide] = useState(0)

  const [foodCartActive, setFoodCartActive] = useState(false)

  const [selectedVariant, setSelectedVariant] = useState('')

  const carouselRef = useRef()

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

  useEffect(() => {
    getProduct({
      productQuery: route.params.selectedProduct,
      sellerQuery: route.params.selectedSeller
    })
    setRendered(true)
  }, []);

  useEffect(() => {
    if (!productLoading && product !== null) {
      let imagesArray = [product.thumbnail]
      if (product.photo_1) imagesArray.push(product.photo_1)
      if (product.photo_2) imagesArray.push(product.photo_2)
      if (product.photo_3) imagesArray.push(product.photo_3)
      setProductImages(imagesArray)
    }
  }, [productLoading]);

  const placeholderRange = [...Array(4).keys()];

  return (
    !productLoading && rendered ? (
      product !== null && productImages.length > 0 ? (
        <>
          <Header backLink={{component:'RestaurantDetail', options: {selectedSeller: route.params.selectedSeller }}} navigation={navigation}/>
          <ScrollView>
            <ImageBackground 
              resizeMode='cover'
              blurRadius={8}
              source={{ uri: `https://www.trike.com.ph${product.seller.thumbnail}` }}
              style={styles.imagesBackground}
            >
              <View style={styles.thumbnailsOverlay}>
                <Carousel
                  ref={carouselRef}
                  data={productImages}
                  renderItem={({item , index}) =>(
                    <Image style={styles.productImage} source={{ uri: `https://www.trike.com.ph${item}`}}></Image>
                  )}
                  sliderWidth={Dimensions.get('window').width}
                  itemWidth={300}
                  onSnapToItem={(index) => setActiveSlide(index) }
                />
              </View>
              <Pagination
                carouselRef={carouselRef}
                dotsLength={productImages.length}
                activeDotIndex={activeSlide}
                containerStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.10)',
                }}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  // marginHorizontal: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}
                inactiveDotStyle={{
                  // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                tappableDots={true}
              />
            </ImageBackground>
            <View style={styles.productVariants}>
              <Text category="h6" style={{ fontWeight: '700' }}>{product.name}</Text>
              <Text style={{ fontSize: 16, marginBottom: 20 }}>{product.seller.name}</Text>
              <Text category="h6" style={{ fontWeight: '400' }}>Select a Variant</Text>
              {product.variants.length > 0 ? (
                <RadioGroup
                  selectedIndex={selectedVariant}
                  onChange={index => setSelectedVariant(index)}>
                  {product.variants.map((variant, index) => (
                    <Radio status="success" key={variant.id} >{variant.name}</Radio>
                  ))}
                </RadioGroup>
              ) : undefined}
            </View>
          </ScrollView>
          <Button style={styles.addToCartButton}>Add To Cart</Button>
          {isAuthenticated && !user.groups.includes('rider') && !currentOrderLoading && currentOrder !== null && currentOrder.order_type === 'food' && currentOrder.order_items.length > 0 ? (
            <Ionicons style={styles.foodCartButton} name="cart" size={28} color={"#ffffff"} onPress={() => setFoodCartActive(!foodCartActive)}/>
          ) : undefined}
          <FoodCart seller={product.seller} foodCartActive={foodCartActive} setFoodCartActive={setFoodCartActive}/>
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
let deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  productImages: {
    padding: 15,
  },
  imagesBackground: {
    height: 320,
    width: (deviceWidth/1),
  },
  thumbnailsOverlay: {
    height: 240,
    width: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    height: 230,
    width: 300,
    marginTop: 10,
    borderRadius: 15
  },
  productVariants: {
    padding: 15,
    paddingBottom: 75
  },
  addToCart: {
    borderWidth: 1,
    alignSelf:'flex-end'
  },
  addToCartButton: {
    width: deviceWidth,
    backgroundColor: '#398d3c',
    borderColor: '#398d3c',
    borderRadius: 0
  },
  foodCartButton: {
    width: 55,
    height: 53.5,
    paddingRight: 1.5,
    position: 'absolute',
    bottom: 60,
    right: 18,
    zIndex: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#388D3D',
    borderColor: '#388D3D',
    borderRadius: 100,
  },
  superModal: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
    padding: 0,
    zIndex: 10,
    backgroundColor: '#ffffff'
  },
})

// ProductDetail.propTypes = {
//   getProduct: PropTypes.func.isRequired,
//   addOrderItem: PropTypes.func.isRequired,
// }

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getProduct, addOrderItem })(ProductDetail);