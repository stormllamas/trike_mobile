import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { Icon, Layout, Text, Card, Autocomplete, AutocompleteItem, Spinner, Divider } from '@ui-kitten/components';
import { Dimensions, StyleSheet, View, Image, FlatList, TouchableOpacity } from 'react-native'

import { IOScrollView } from 'react-native-intersection-observer'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../common/Styles'

import Header from '../layout/Header'
import RestaurantItem from './RestaurantItem'

import { getCategories, getAllSellers, getSellers, setCuisine, setKeywords } from '../../actions/logistics'

const Food = ({
  logistics: {
    categoriesLoading, categories,

    allSellers, allSellersLoading,

    sellersLoading, moreSellersLoading,
    sellers,

    cuisineFilter, keywordsFilter
  },
  getCategories, getSellers, getAllSellers,
  setCuisine,
  setKeywords,

  navigation
}) => {

  const [activeCuisine, setActiveCuisine] = useState(false);

  const [searchValue, setSearchValue] = useState(null);
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [filteredAutoComplete, setFilteredAutoComplete] = useState([]);

  // const client = new Client({});
  
  const filter = (item, query) => item.title.toLowerCase().includes(query.toLowerCase());

  const onSelect = (index) => {
    if(filteredAutoComplete.length > 0) {
      setSearchValue(filteredAutoComplete[index].title);
      setKeywords(filteredAutoComplete[index].title)
    } else {
      setSearchValue(autoCompleteData[index].title);
      setKeywords(autoCompleteData[index].title)
    }
  };

  const onClear = (index) => {
    setSearchValue('');
    setKeywords('')
  };

  const onChangeText = (query) => {
    setSearchValue(query);
    setFilteredAutoComplete(autoCompleteData.filter(item => filter(item, query)));
  };

  const renderOption = (item, index) => (
    <AutocompleteItem
      key={index}
      title={item.title}
    />
  );
  
  useEffect(() => {
    getAllSellers()
    if (categories.length < 1) {
      getCategories({
        categoryQueries: [
          'Cuisine'
        ]
      })
    }
  }, []);
  
  useEffect(() => {
    if (!allSellersLoading) {
      const data = []
      allSellers.forEach(seller => {
        data.push({title: seller.name})
      })
      setAutoCompleteData(data)
    }
    return () => {
      if (!allSellersLoading) {
        const data = []
        allSellers.forEach(seller => {
          data.push({title: seller.name})
        })
        setAutoCompleteData(data)
      }
    }
  }, [allSellersLoading]);
  
  useEffect(() => {
    // if (sellers.results.length < 1) {
      getSellers({
        getMore: false,
      })
    // }
    // setSearch(keywordsFilter)
  }, [cuisineFilter, keywordsFilter]);

  const placeholderRange = [...Array(4).keys()];
  const productRange = [...Array(8).keys()];

  return (
    <>
      <Header subtitle='Food' sideMenu={true}/>
      <Layout style={{ paddingHorizontal: 10, paddingVertical:5, paddingTop: 15 }} level="1">
        <Autocomplete
          placeholder='Search for a Restaurant'
          style={{ backgroundColor: '#ffffff' }}
          value={searchValue}
          onSelect={onSelect}
          onChangeText={onChangeText}>
          {filteredAutoComplete.length > 0 ? filteredAutoComplete.map(renderOption) : autoCompleteData.map(renderOption)}
        </Autocomplete>
        <Ionicons name="close-circle" size={22} color={'#ECECEC'} style={{ position: 'absolute', zIndex: 9, right: 16, top: 22 }} onPress={onClear}/>
      </Layout>
      <Layout style={[foodStyles.listSliderWrapper]} level="1">
        {!categoriesLoading ? (
          <FlatList
            horizontal={true}
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {activeCuisine == item.id ? setActiveCuisine('') : setActiveCuisine(item.id), setCuisine({ cuisine: item.name })}}>
                <View style={[foodStyles.categoryCard, activeCuisine == item.id ? {backgroundColor: '#53A557'}: {}]}>
                  <View style={foodStyles.categoryContent}>
                    <Image style={foodStyles.categoryImage} source={{ uri: item.thumbnail }} />
                    <Text style={[foodStyles.sliderText, activeCuisine == item.id ? {color: '#fff'} : {}]}>{item.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={category => category.id.toString()}
          />
        ) : (
          <FlatList
            horizontal={true}
            data={placeholderRange}
            renderItem={({ item, index }) => (
              <TouchableOpacity>
                <View style={foodStyles.categoryCard}>
                  <View style={foodStyles.categoryContent}>
                    <Image style={foodStyles.categoryImage} source={{ uri: undefined }} />
                    <Text style={foodStyles.sliderText}>{undefined}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={index => index.toString()}
          />
        )}
      </Layout>
      <Divider/>
      <Layout style={styles.shoppingCardsWrapper} level="2">
        {!sellersLoading && sellers ? (
          <IOScrollView contentContainerStyle={styles.shoppingCardsContainer}>
            {sellers.results.map((item, index) => (
              <RestaurantItem key={item.id} seller={item} sellers={sellers} index={index} sellersLoading={sellersLoading} navigation={navigation}/>
            ))}
            {moreSellersLoading ? (
              <Layout level="2" style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                <Spinner size='medium'></Spinner>
              </Layout>
            ) : undefined}
          </IOScrollView>
        ) : (
          <FlatList
            style={styles.shoppingCardsContainer}
            numColumns={2}
            data={productRange}
            renderItem={({range, index}) => (
              <TouchableOpacity>
                <Card style={index % 2 === 0 ? styles.shoppingCardOdd : styles.shoppingCardEven}>
                  <Text style={{ fontSize: 16, fontWeight: '700', minHeight: 200 }}></Text>
                  <View style={{ marginLeft: -2, marginTop: 5, flexDirection: 'row' }}>
                    {[...Array(0).keys()].map(star => <Icon key={star} name='star' fill='#E0E0E0' style={{ height: 23, width: 23}}>star</Icon>)}
                  </View>
                </Card>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </Layout>
    </>
  )
}


let deviceWidth = Dimensions.get('window').width

const foodStyles = StyleSheet.create({
  listSliderWrapper: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  categoryCard: {
    alignItems:'center',
    // borderTopWidth: 0,
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
    // borderLeftWidth: 0,
    margin: 5,
    width: (deviceWidth/4)-20,
    height: 110,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  categoryContent: {
    width: (deviceWidth/4)-20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    borderRadius: 100,
    width: (deviceWidth/4)-35,
    height: (deviceWidth/4)-35
  },
  sliderText: {
    marginTop: 5,
    color: '#222'
  },
})

Food.propTypes = {
  getCategories: PropTypes.func.isRequired,
  getSellers: PropTypes.func.isRequired,
  getAllSellers: PropTypes.func.isRequired,
  setCuisine: PropTypes.func.isRequired,
  setKeywords: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getCategories, getSellers, getAllSellers, setCuisine, setKeywords })(Food);