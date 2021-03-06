import React, { Fragment, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { useBackButton } from '../common/BackButtonHandler';

import { PROJECT_URL } from "../../actions/siteConfig"

import FoodCart from './FoodCart'
import RestaurantProduct from './RestaurantProduct'

import { Layout, Icon, Text, Button, Radio, RadioGroup, Spinner } from '@ui-kitten/components';
import { Animated, Easing, Alert, Dimensions, View, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel';

import Ionicons from 'react-native-vector-icons/Ionicons'

import Header from '../layout/Header'
import { styles } from '../common/Styles'

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
  const [selectedVariantIndex, setSelectedVariantIndex] = useState('')

  const [topAlertActive, setTopAlertActive] = useState(false)
  const [topAlertAnim, setTopAlertAnim] = useState(new Animated.Value(-20))
  const [topAlertText, setTopAlertText] = useState('')
  const [topAlertTimeout, setTopAlertTimeout] = useState(0)

  // useEffect(() => {
  //   clearTimeout(topAlertTimeout);
  // }, [topAlertTimeout])

  const clickAddToCard = () => {
    clearTimeout(topAlertTimeout);
    setTopAlertAnim(new Animated.Value(-20))
    setTopAlertTimeout(
      setTimeout(function () {
        setTopAlertActive(false)
      }, 4000)
    );
  }

  useEffect(() => {
    if (topAlertActive) {
      Animated.timing(
        topAlertAnim,
        {
          toValue: 46,
          duration: 400,
          easing: Easing.elastic(),
          useNativeDriver: false,
        }
      ).start();
    } else {
      Animated.timing(
        topAlertAnim,
        {
          toValue: -20,
          duration: 400,
          easing: Easing.back(),
          useNativeDriver: false,
        }
      ).start();
    }
    return () => {
      clearTimeout(topAlertTimeout)
    }
  }, [topAlertActive, topAlertAnim])


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

  const addToOrder = () => {
    if (selectedVariant !== '') {
      addOrderItem({
        productId: selectedVariant,
        sellerID: product.seller.id
      })
      setTopAlertText(`Added ${product.name} to cart`)
      setTopAlertActive(true)
      clickAddToCard()
    } else {
      Alert.alert(
        "Error",
        "Please Select a Variant",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK" }
        ]
      );
    }
  }

  useEffect(() => {
    getProduct({
      productQuery: route.params.selectedProduct,
      sellerQuery: route.params.selectedSeller
    })
    setRendered(true)
    return () => {
      setRendered(true)
    };
  }, []);

  useEffect(() => {
    getProduct({
      productQuery: route.params.selectedProduct,
      sellerQuery: route.params.selectedSeller
    })
    setRendered(true)
    return () => {
      setRendered(true)
    };
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
          <Header subtitle='Food' backLink={{component:'RestaurantDetail', options: {selectedSeller: route.params.selectedSeller }}} navigation={navigation}/>
          <Animated.View style={[ styles.topAlert, { top: topAlertAnim }]}>
            <Text style={styles.topAlertText}>{topAlertText}</Text>            
          </Animated.View>
          <ScrollView>
            <ImageBackground 
              resizeMode='cover'
              blurRadius={8}
              source={{ uri: `${PROJECT_URL}${product.seller.thumbnail}` }}
              style={productDetailsStyles.imagesBackground}
            >
              <View style={productDetailsStyles.thumbnailsOverlay}>
                <Carousel
                  ref={carouselRef}
                  data={productImages}
                  renderItem={({item , index}) => (
                    <Image style={productDetailsStyles.productImage} source={{ uri: `${PROJECT_URL}${item}`}}></Image>
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
            <View style={productDetailsStyles.productVariants}>
              <Text category="h6" style={{ fontWeight: '700' }}>{product.name}</Text>
              <Text style={{ fontSize: 16, marginBottom: 20 }}>{product.seller.name}</Text>
              <Text category="h6" style={{ fontWeight: '400' }}>Select a Variant</Text>
              {product.variants.length > 0 ? (
                <RadioGroup
                  selectedIndex={selectedVariantIndex}
                  onChange={index => {setSelectedVariantIndex(index), setSelectedVariant(product.variants[index].id)}}>
                  {product.variants.map((variant, index) => (
                    <Radio key={variant.id} ><Text>??? {variant.final_price} - {variant.name}</Text></Radio>
                  ))}
                </RadioGroup>
              ) : undefined}
            </View>
          </ScrollView>
          <Button style={productDetailsStyles.addToCartButton} onPress={() => {addToOrder()}}>Add To Cart</Button>
          {isAuthenticated && !user.groups.includes('rider') && !currentOrderLoading && currentOrder !== null && currentOrder.order_type === 'food' && currentOrder.order_items.length > 0 ? (
            <Ionicons style={[styles.foodCartButton, {bottom: 60}]} name="cart" size={28} color={"#ffffff"} onPress={() => setFoodCartActive(!foodCartActive)}/>
          ) : undefined}
          <FoodCart seller={product.seller} foodCartActive={foodCartActive} setFoodCartActive={setFoodCartActive} navigation={navigation} />
        </>
      ) : (
        <>
          <Text>Not Found</Text>
        </>
      )
    ) : (
      <>
        <View style={[styles.overlay, {backgroundColor:'transparent', opacity: 1, alignItems: 'center', justifyContent: 'center', zIndex: 11}]}>
          <Spinner size='large'/>
        </View>
      </>
    )
  )
}

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const productDetailsStyles = StyleSheet.create({
  productImages: {
    padding: 15,
  },
  imagesBackground: {
    height: 320,
    width: (deviceWidth/1),
  },
  thumbnailsOverlay: {
    flex: 1,
    width: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    height: 230,
    width: 300,
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: '#ffffff'
  },
  productVariants: {
    padding: 15,
    paddingBottom: 40
  },
  addToCart: {
    borderWidth: 1,
    alignSelf:'flex-end'
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    width: deviceWidth,
    backgroundColor: '#53A557',
    borderColor: '#53A557',
    borderRadius: 0
  },
})

ProductDetail.propTypes = {
  getProduct: PropTypes.func.isRequired,
  addOrderItem: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getProduct, addOrderItem })(ProductDetail);