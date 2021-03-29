import { StyleSheet, Dimensions } from 'react-native'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

export const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 15,
  },
  superModal: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
    padding: 0,
    zIndex: 10,
    backgroundColor: '#ffffff'
  },
  sideNav: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth*.75,
    padding: 0,
    zIndex: 10,
    backgroundColor: '#ffffff'
  },
  overlay: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
    padding: 0,
    zIndex: 10,
    backgroundColor: '#000000',
    opacity: .50
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tinyLogo: {
    height: 50,
    width: 155,
    alignSelf: 'center',
    marginBottom: 50,
  },
  mute: {
    color: '#959595'
  },
  small: {
    fontSize: 12
  },
  label: {
    color: '#959595',
    fontSize: 12,
    paddingTop: 10
  },
  inputSummary: {
    backgroundColor: '#EAECF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: '#6A6A6A'
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5
  },
  // Shopping Card List
  shoppingCardsWrapper: {
    flex:1,
  },
  shoppingCardsContainer: {
    paddingTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  shoppingCardOdd: {
    width: (deviceWidth/2)-18,
    margin: 6,
    marginLeft: 12,
    marginRight: 6,
    borderRadius: 15,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  shoppingCardEven: {
    width: (deviceWidth/2)-18,
    margin: 6,
    marginLeft: 6,
    marginRight: 12,
    borderRadius: 15,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  shoppingCardImage: {
    height: 150,
    width: (deviceWidth/2)-18
  },

  // Food Cart
  foodCartButton: {
    width: 55,
    height: 53.5,
    paddingRight: 1.5,
    position: 'absolute',
    bottom: 15,
    right: 18,
    zIndex: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#398d3c',
    borderColor: '#398d3c',
    borderRadius: 100,
  },

  // Order Item List
  orderItem: {
    position: 'relative',
    flexDirection: 'row',
    padding: 5,
    marginBottom: 10
  },
  orderItemImage: {
    height: 50,
    width: 50,
    marginRight: 10,
    borderRadius: 50,
  },

  // Product Quantity
  productQuantity: {
    flexDirection: 'row',
    marginBottom: 10,
    height: 25,
  },
  increaseQuantity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
    marginLeft: -1,
  },
  decreaseQuantity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
  },
  quantity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 25,
    width: 30,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
    marginLeft: -1
  },
  deleteOrderItem: {
    top: 10,
    right: 10,
    position: 'absolute',
    color: 'red'
  },

  // react-native-collapsible
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
  },
  collapsibleContent: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    backgroundColor: 'white',
    padding: 15,
  },
})