/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, Pressable, View } from 'react-native'
import { getAll, getAllCategories, restaurantFilter, getAllCustomer, getSortedValorationRestaurants } from '../../api/RestaurantEndpoints'
import { getMeanValoration } from '../../api/ValorationsEndpoints'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import getStarValoration from '../../components/StarValoration'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { showMessage } from 'react-native-flash-message'
import SelectList from 'react-native-dropdown-select-list'

export default function RestaurantsScreen ({ navigation, route }) {
  const [restaurants, setRestaurants] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)
  const [categories, setRestaurantCategories] = useState([])
  const [selected, setSelected] = React.useState()

  useEffect(() => {
    async function fetchRestaurants () {
      try {
        const showRestaurants = []
        const fetchedRestaurants = await getAllCustomer()
        const fetchedCategories = await getAllCategories()

        for (let i = 0; i < fetchedRestaurants.length; i++) {
          const restaurantInfo = {}
          restaurantInfo.restaurant = fetchedRestaurants[i]
          restaurantInfo.valoration = await getMeanValoration(fetchedRestaurants[i].id)
          showRestaurants.push(restaurantInfo)
        }
        setRestaurantCategories(fetchedCategories)
        setRestaurants(showRestaurants)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: flashStyle,
          titleStyle: flashTextStyle
        })
      }
    }
    if (loggedInUser) {
      fetchRestaurants()
    } else {
      setRestaurants(null)
    }
  }, [loggedInUser, route])

  const formatCategories = (data) => {
    const dataFormat = []
    dataFormat.push({ key: 0, value: 'All Categories' })

    for (let i = 0; i < data.length; i++) {
      const label = {}

      label.key = data[i].id
      label.value = data[i].name
      dataFormat.push(label)
    }
    dataFormat.push({ key: 3, value: 'Best Rated' })
    return dataFormat
  }
  formatCategories(categories)
  const renderRestaurant = ({ item }) => {
    const stars = getStarValoration(item.valoration)

    return (

      <ImageCard

        imageUri={item.restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + item.restaurant.logo } : undefined}
        title={item.restaurant.name}

        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: item.restaurant.id })
        }}

      >

        <TextRegular numberOfLines={2}>{item.restaurant.description}</TextRegular>
        {item.restaurant.averageServiceMinutes !== null &&
          <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.restaurant.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
        }
        <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: brandPrimary }}>{item.restaurant.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
        <TextSemiBold>{item.restaurant.restaurantCategory.name}</TextSemiBold>

        {stars}

      </ImageCard>

    )
  }

  const renderEmptyRestaurantsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No restaurants were retreived. Are you logged in?
      </TextRegular>
    )
  }
  const getRestaurantsFiltered = async (value) => {
    try {
      let filteredRestaurants
      switch (value) {
        case 0:
          filteredRestaurants = await getAll()
          break
        case 1:
          filteredRestaurants = await restaurantFilter(1)
          break
        case 2:
          filteredRestaurants = await restaurantFilter(2)
          break
        case 3:

          filteredRestaurants = await getSortedValorationRestaurants()
          break
        default:
          break
      }

      const showRestaurants = []
      for (let i = 0; i < filteredRestaurants.length; i++) {
        const restaurantInfo = {}
        if (value === 3) {
          restaurantInfo.restaurant = filteredRestaurants[i].restaurant
          restaurantInfo.valoration = filteredRestaurants[i].valoration
        } else {
          restaurantInfo.restaurant = filteredRestaurants[i]
          restaurantInfo.valoration = await getMeanValoration(filteredRestaurants[i].id)
        }

        showRestaurants.push(restaurantInfo)
      }
      setRestaurants(showRestaurants)
    } catch (error) {
      console.log(error)
    }
  }

  const renderHeader = () => {
    return (
      <>
      {loggedInUser &&
      <Pressable
        onPress={() => navigation.navigate('CreateRestaurantScreen')
        }
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? brandPrimaryTap
              : brandPrimary
          },
          styles.button
        ]}>
        <MaterialCommunityIcons name='plus-circle' color={brandSecondary} size={20}/>
        <TextRegular textStyle={styles.text}>
          Create restaurant
        </TextRegular>
      </Pressable>
    }
    <View style={{ paddingTop: 10 }}>
    <SelectList
     setSelected={setSelected} data={formatCategories(categories)}
      onSelect={() => getRestaurantsFiltered(selected)}
      placeholder='Select a restaurant category'
      />
</View>
    </>
    )
  }

  return (
    <FlatList
      style={styles.container}
      data={restaurants}
      renderItem={renderRestaurant}
      keyExtractor={item => item.restaurant.id.toString()}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyRestaurantsList}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  showRestaurant: {
    // backgroundColor: 'red',
    paddingTop: 20

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
  text: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
