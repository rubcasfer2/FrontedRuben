import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FaStar } from 'react-icons/fa'
import TextSemiBold from '../components/TextSemibold'
export default function getStarValoration (value) {
  let numberStar
  let numberEmotes = <TextSemiBold>Not valued yet</TextSemiBold>
  if (!(value === null)) {
    numberStar = Math.round(value)
  }

  switch (numberStar) {
    case 1:
      numberEmotes = <View style = {styles.stars}><FaStar/> </View>
      break
    case 2:
      numberEmotes = <View style = {styles.stars}><FaStar/> <FaStar/></View>
      break
    case 3:
      numberEmotes = <View style = {styles.stars}><FaStar/> <FaStar/> <FaStar/> </View>
      break
    case 4:
      numberEmotes = <View style = {styles.stars}><FaStar/> <FaStar/> <FaStar/> <FaStar/> </View>
      break
    case 5:
      numberEmotes = <View style = {styles.stars}><FaStar/> <FaStar/> <FaStar/> <FaStar/> </View>
      break
      /*
    default:
      numberEmotes = <View style = {styles.stars}></View> */
  }
  return numberEmotes
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold'
  },
  stars: {
    flexDirection: 'row'

  }
})
