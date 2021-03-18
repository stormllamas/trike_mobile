import React, { useRef, useCallback } from 'react';
import { Icon, Text, Card } from '@ui-kitten/components';
import { View, TouchableOpacity, Image } from 'react-native'

import { InView } from 'react-native-intersection-observer'

import { connect } from 'react-redux';
import { getSellers } from '../../actions/logistics';

// import PropTypes from 'prop-types'


const RestaurantItem = ({ sellersLoading, seller, sellers, index, getSellers, styles, navigation }) => {

  const CardHeader = ({ picture }) => (
    <View style={styles.shoppingCardHeader}>
      <Image style={styles.shoppingCardImage} source={{ uri: picture }} />
    </View>
  );

  const lastProductElement = (inView) => {
    if (inView && sellers.results.length == index+1 && sellers.next !== null && !sellersLoading) {
      getSellers({
        getMore: true
      })
    }
  }
  
  return (
    <InView onChange={inView => lastProductElement(inView)}>
      <Card style={index % 2 === 0 ? styles.shoppingCardOdd : styles.shoppingCardEven}
        header={() => CardHeader({ picture: seller.thumbnail })}
        // footer={() => CardFooter({ address: seller.address })}
        onPress={() => navigation.navigate('RestaurantDetail', { selectedSeller: seller.name })}
      >
        <Text style={{ fontSize: 16, fontWeight: '700' }}>{seller.name}</Text>
        <View style={{ alignItems: 'flex-start' }}>
          {seller.review_count > 0 ? (
            <View style={{ marginLeft: -2, marginTop: 5, flexDirection: 'row' }}>
              {[...Array(seller.total_rating).keys()].map(star => <Icon key={star} name='star' fill='#F2BE4D' style={{ height: 23, width: 23}}>star</Icon>)}
            </View>
          ) : (
            <View style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e8e8e8', borderRadius: 4 }}>
              <Text  style={{ color: '#222222'}}>Unrated</Text>
            </View>
          )}
        </View>
      </Card>
    </InView>
  )
}


// RestaurantItem.propTypes = {
//   getSellers: PropTypes.func.isRequired,
// }

export default connect(null, { getSellers })(RestaurantItem);