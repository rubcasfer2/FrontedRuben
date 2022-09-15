/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable, Text, Modal } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getDetail } from '../../api/RestaurantEndpoints'
import { create } from '../../api/OrderEndpoint'
import { getRestaurantProducts } from '../../api/ProductEndpoints'
import ImageCard from '../../components/ImageCard'
import ImageCardPromotion from '../../components/ImageCardPromotion'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'

import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'

export default function RestaurantDetailScreen ({ navigation, route }) {
  const eggsIcon = process.env.API_BASE_URL + '/public/restaurants/products/huevos.ico'
  const milkIcon = process.env.API_BASE_URL + '/public/restaurants/products/lacteos.ico'
  const fishIcon = process.env.API_BASE_URL + '/public/restaurants/products/pescado.ico'
  const glutenIcon = process.env.API_BASE_URL + '/public/restaurants/products/gluten.ico'

  const [restaurant, setRestaurant] = useState({})
  const [orderProducts, setOrderProducts] = useState(new Map())
  const [modalOpen, setModalOpen] = useState(false)
  const [restaurantProducts, setRestaurantProducts] = useState([])

  const renderEmptySelectedProductsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        Please select a product.
      </TextRegular>
    )
  }

  const renderMap = ({ item }) => {
    const producto = restaurant.products.find(prod => prod.id === item)
    const quantity = orderProducts.get(item)
    let precioTotal = 0
    if (producto.promotion) {
      precioTotal = producto.price * (Math.floor(quantity / 2) + quantity % 2)
    } else {
      precioTotal = producto.price * quantity
    }

    return (
      <View>
      <Text>{orderProducts.get(item)} x <Text>{producto.name} ...... </Text><Text>{precioTotal} €</Text></Text>
      </View>

    )
  }

  const estructurarPedido = (values) => {
    const order = {}
    const products = []
    order.address = restaurant.address
    order.restaurantId = restaurant.id
    for (let i = 0; i < values.length; i++) {
      products.push({ productId: values[i], quantity: orderProducts.get(values[i]) })
    }
    order.products = products
    createOrder(order)
  }
  const createOrder = async (value) => {
    try {
      console.log(value)
      const newOrder = await create(value)
      console.log(newOrder)
      showMessage({
        message: 'Order succesfully created',
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
      navigation.navigate('RestaurantsScreen', { dirty: true })
      setModalOpen(!modalOpen)
      setOrderProducts(new Map())
    } catch (error) {
      if (error.errors[0].msg == 'There allergens products that affects to you') {
        showMessage({
          message: 'There are allergens in one of these products, choose another product',
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
      console.log(error.errors[0].msg)
    }
  }
  const totalPrice = (list) => {
    let price = 0

    let message
    for (let i = 0; i < list.length; i++) {
      const producto = restaurant.products.find(prod => prod.id === list[i])
      const quantity = orderProducts.get(list[i])
      if (producto.promotion) {
        price += producto.price * (Math.floor(quantity / 2) + quantity % 2)
      } else {
        price += producto.price * quantity
      }
    }
    if (price < 10) {
      price += restaurant.shippingCosts

      message = <View><Text>Costes de envio ...... {restaurant.shippingCosts} €</Text><TextSemiBold>Coste total ...... {price} €</TextSemiBold></View>
    } else {
      message = <TextSemiBold>Coste total ...... {price} €</TextSemiBold>
    }
    return (
      message
    )
  }
  const modalControl = (value) => {
    if (value) {
      return false
    } else {
      return true
    }
  }
  useEffect(() => {
    async function fetchRestaurantDetail () {
      try {
        const fetchedRestaurant = await getDetail(route.params.id)
        setRestaurant(fetchedRestaurant)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    fetchRestaurantDetail()
  }, [route])

  useEffect(() => {
    async function fetchRestaurantProducts () {
      try {
        const products = await getRestaurantProducts(route.params.id)
        setRestaurantProducts(products)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants products. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    fetchRestaurantProducts()
  }, [route])

  const renderFooter = () => {
    return (
<>
<Modal
        animationType="slide"
        transparent={true}
        visible={modalOpen}
        onRequestClose={() => {
          setModalOpen(!modalOpen)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <View style={{ padding: 2, alignContent: 'center' }}>
            <Pressable
              style={[styles.button3, styles.buttonClose]}
              onPress={() => setModalOpen(!modalOpen)}
            >
              <Text style={{ alignContent: 'center' }}>Back</Text>
            </Pressable>
            </View>
            <View style={{ padding: 8, alignContent: 'center' }}>
            <FlatList
            ListEmptyComponent={renderEmptySelectedProductsList}
            style={styles.container}
            data={Array.from(orderProducts.keys())}
            renderItem={renderMap}
            />
            {totalPrice(Array.from(orderProducts.keys()))}
            </View>
            <View style={{ padding: 5 }}>
            <Pressable
              style={[styles.button3, styles.buttonOpen]}
              onPress={() => { setOrderProducts(new Map()); setModalOpen(!modalOpen) }}
            >
              <Text style={styles.text}>Delete Order</Text>
            </Pressable>
            </View>
           <View style={{ padding: 5 }}>
            <Pressable
              style={[styles.button3, styles.buttonClose]}
              onPress={() => estructurarPedido(Array.from(orderProducts.keys()))}
            >
              <Text style={styles.text}>Create Order</Text>
            </Pressable>

            </View>
          </View>
        </View>
      </Modal>
<Pressable
          onPress={() => setModalOpen(modalControl(modalOpen))
          }
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? brandPrimaryTap
                : brandPrimary
            },
            styles.button
          ]}>
          <MaterialCommunityIcons name='plus-circle' color={brandSecondary} size={20} />
          <TextRegular textStyle={styles.text}>
            Create product
          </TextRegular>
        </Pressable>
        </>
    )
  }
  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
            <Image style={styles.image} source={restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined} />
            <TextRegular textStyle={styles.description}>{restaurant.description}</TextRegular>
            <TextRegular textStyle={styles.description}>{restaurant.restaurantCategory ? restaurant.restaurantCategory.name : ''}</TextRegular>
          </View>
        </ImageBackground>

      <View style = {styles.botones}>
        <View>
        <Pressable
          onPress={() => navigation.navigate('CreateProductScreen', { id: restaurant.id })
          }
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? brandPrimaryTap
                : brandPrimary
            },
            styles.button
          ]}>
          <MaterialCommunityIcons name='plus-circle' color={brandSecondary} size={20} />
          <TextRegular textStyle={styles.text}>
            Create product
          </TextRegular>
        </Pressable>
        </View>
        <View style={{ paddingLeft: 10 }}>
        <Pressable
          onPress={() => navigation.navigate('ShowValorations', { id: restaurant.id })
          }
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? brandPrimaryTap
                : brandPrimary
            },
            styles.button
          ]}>
          <MaterialCommunityIcons name='plus-circle' color={brandSecondary} size={20} />
          <TextRegular textStyle={styles.text}>
            See Valorations
          </TextRegular>
        </Pressable>

        </View>

        </View>
      </View>

    )
  }

  const sumarCantidad = (id) => {
    if (orderProducts.has(id)) {
      const quantity = orderProducts.get(id)
      setOrderProducts(new Map(orderProducts.set(id, quantity + 1)))
    } else {
      setOrderProducts(new Map(orderProducts.set(id, 1)))
    }
  }

  const restarCantidad = (id) => {
    const quantity = orderProducts.get(id)
    if (quantity === 1) {
      setOrderProducts(new Map(orderProducts.delete(id)))
    } else {
      setOrderProducts(new Map(orderProducts.set(id, quantity - 1)))
    }
  }

  const renderAllergerns = ({ item }) => {
    let milk = <Text></Text>
    let eggs = <Text></Text>
    let fish = <Text></Text>
    let gluten = <Text></Text>
    if (item.milk === true) {
      milk = <Image source={milkIcon} fadeDuration={0} style={{ width: 30, height: 30 }} />
    } if (item.eggs === true) {
      eggs = <Image source={eggsIcon} fadeDuration={0} style={{ width: 30, height: 30 }} />
    } if (item.fish === true) {
      fish = <View><Image source={fishIcon} fadeDuration={0} style={{ width: 30, height: 30, color: 'red' }} /></View>
    } if (item.gluten === true) {
      gluten = <Image source={glutenIcon} fadeDuration={0} style={{ width: 30, height: 30 }} />
    }
    const allergens = <View style={{ flexDirection: 'row' }}>{milk}{gluten}{fish}{eggs}</View>
    return allergens
  }

  const renderProduct = ({ item }) => {
    const allergens = renderAllergerns({ item })

    let promotionText = <Text></Text>
    if (item.promotion) {
      promotionText = <Text style={{ color: brandPrimary, alignSelf: 'flex-end' }}>En Promocion 2x1</Text>
    }
    return (

      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : undefined}
        title={item.name}
        backgroundColor={brandSecondary}

      >
       {promotionText}
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>

        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        {allergens}
        <View style = {{ flexDirection: 'row', paddingTop: 6 }}>
          <View >
        <Pressable onPress={() => restarCantidad(item.id)} style={({ button }) => [
          {
            backgroundColor: button
              ? 'white'
              : 'white'
          },
          styles.buttonPlus
        ]}>
          <MaterialCommunityIcons name='minus-circle' color={brandPrimary} size={20} /> </Pressable>
          </View>
          <View style={{ paddingRight: 10, paddingLeft: 10 }}>
          <TextRegular style={styles.text}>{orderProducts.has(item.id) ? orderProducts.get(item.id) : 0}</TextRegular>
          </View>
          <View >
         <Pressable onPress={() => sumarCantidad(item.id)} style={({ button }) => [
           {
             backgroundColor: button
               ? 'white'
               : 'white'
           },
           styles.buttonPlus
         ]}>
         <MaterialCommunityIcons name='plus-circle' color={brandPrimary} size={20} /> </Pressable>
         </View>
        </View>

      </ImageCard>

    )
  }

  const renderEmptyProductsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        This restaurant has no products yet.
      </TextRegular>
    )
  }

  return (

    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyProductsList}
        ListFooterComponent={renderFooter}
        style={styles.container}
        data={restaurantProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: brandSecondary
  },
  botones: {

    flexDirection: 'row',

    alignSelf: 'center'
  },
  restaurantHeaderContainer: {
    height: 250,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    margin: 10
  },
  description: {
    color: 'white'
  },
  textTitle: {
    fontSize: 20,
    color: 'white'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center'

  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button3: {
    borderRadius: 20,
    padding: 10,

    height: 40,
    alignItems: 'center',
    alignSelf: 'center'

  },
  buttonOpen: {
    backgroundColor: brandPrimary
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  }

})
