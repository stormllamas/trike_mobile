import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';

import { View, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome'
import { BottomNavigation, BottomNavigationTab, Layout } from '@ui-kitten/components';

const BottomTabs = ({
  auth: {current, all_subjects},
  navigation,
  screen
}) => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onTabSelect = index => {
    setSelectedIndex(index)
    if (index == 0) {
      navigation.navigate('Root', { screen: 'Food'})
    } else if (index == 1) {
      navigation.navigate('Root', { screen: 'Delivery'})
    } else if (index == 2) {
      // navigation.navigate('Delivery')
    }
  }

  useEffect(() => {
    if (screen == 'Food') {
      setSelectedIndex(0)
    } else if (screen == 'Delivery') {
      setSelectedIndex(1)
    }
  }, [screen]);

  return (
    <Layout>
      <BottomNavigation
        selectedIndex={selectedIndex}
        onSelect={index => onTabSelect(index)}>
        <BottomNavigationTab icon={props => <FontAwesome name="cutlery" size={20} color={selectedIndex == 0 ? "#FBA535":"#909CB4"}/>} title='FOOD'/>
        <BottomNavigationTab icon={props => <FontAwesome name="truck" size={20} color={selectedIndex == 1 ? "#FBA535":"#909CB4"}/>} title='DELIVERY'/>
        {/* <BottomNavigationTab icon={props => <FontAwesome name="motorcycle" size={20} color={selectedIndex == 2 ? "#FBA535":"#909CB4"}/>} title='RIDE HAIL'/> */}
      </BottomNavigation>
    </Layout>
  )
}


const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(BottomTabs);