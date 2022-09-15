import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import CreateProductScreen from './CreateProductScreen'
import CreateRestaurantScreen from './CreateRestaurantScreen'
import RestaurantDetailScreen from './RestaurantDetailScreen'
import RestaurantsScreen from './RestaurantsScreen'
import ShowValorations from '../valorations/ShowValorationsScreen'
import CreateValorationsScreen from '../valorations/CreateValorationScreen'

const Stack = createNativeStackNavigator()

export default function RestaurantsStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='RestaurantsScreen'
        component={RestaurantsScreen}
        options={{
          title: 'My Restaurants'
        }} />
      <Stack.Screen
        name='RestaurantDetailScreen'
        component={RestaurantDetailScreen}
        options={{
          title: 'Restaurant Detail'
        }} />
        <Stack.Screen
        name='ShowValorations'
        component={ShowValorations}
        options={{
          title: 'Show Valorations'
        }} />
        <Stack.Screen
        name='CreateValorations'
        component={CreateValorationsScreen}
        options={{
          title: 'Create Valorations'
        }} />
      <Stack.Screen
        name='CreateRestaurantScreen'
        component={CreateRestaurantScreen}
        options={{
          title: 'Create Restaurant'
        }} />
        <Stack.Screen
        name='CreateProductScreen'
        component={CreateProductScreen}
        options={{
          title: 'Create Product'
        }} />
    </Stack.Navigator>
  )
}
