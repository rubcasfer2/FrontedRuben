import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import TextRegular from '../../components/TextRegular'
import { getOrdersUser } from '../../api/OrderEndpoint'
import { getAll } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import { brandPrimary, brandPrimaryTap, brandSecondary } from '../../styles/GlobalStyles'
export default function ControlPanelScreen ({ navigation, route }) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function fetchOrders () {
      try {
        const fetchedOrders = await getOrdersUser()
        setOrders(fetchedOrders)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOrders()
  }, [route])

  const renderOrder = (item) => {
    const dateArray = item.item.createdAt.toString().split('T')
    return (

      <ImageCard

      imageUri={item.item.restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + item.item.restaurant.logo } : undefined}
      title={item.item.restaurant.name}

      onPress={() => {
        navigation.navigate('RestaurantDetailScreen', { id: item.item.restaurant.id })
      }}

    >

     <Text>{dateArray[0]}</Text>
     <TextSemiBold>price: <TextRegular>{item.item.price} €</TextRegular></TextSemiBold>
     <TextSemiBold>ShippingCosts :<TextRegular>{item.item.shippingCosts}</TextRegular> </TextSemiBold>
     <TextSemiBold>address : <TextRegular>{item.item.address}</TextRegular></TextSemiBold>

    </ImageCard>

    )
  }

  return (

      <FlatList
      data={orders}
      renderItem={renderOrder}
      />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
