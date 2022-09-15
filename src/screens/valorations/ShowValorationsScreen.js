/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, Pressable, Text, View } from 'react-native'

import { getAll, indexRestaurant } from '../../api/ValorationsEndpoints'
import { getUser } from '../../api/AuthEndpoints'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import ImageCard from '../../components/ImageCard'
import getStarValoration from '../../components/StarValoration'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { showMessage } from 'react-native-flash-message'
import { Button } from 'react-native-web'

export default function ShowValorationsScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [valorations, setValorations] = useState([])

  useEffect(() => {
    async function fetchValorations () {
      try {
        const ShowValorations = []
        const fetchedValorations = await indexRestaurant(route.params.id)

        for (let i = 0; i < fetchedValorations.length; i++) {
          const valoration = {}
          valoration.info = fetchedValorations[i]
          valoration.user = await getUser(fetchedValorations[i].userId)

          ShowValorations.push(valoration)
        }
        console.log(ShowValorations)
        setValorations(ShowValorations)
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
      fetchValorations()
    } else {
      setValorations(null)
    }
  }, [loggedInUser, route])

  const renderValorations = ({ item }) => {
    const stars = getStarValoration(item.info.valoration)
    return (
      <ImageCard

      imageUri={item.user.avatar ? { uri: process.env.API_BASE_URL + '/' + item.user.avatar } : undefined}
      title={item.user.firstName}

    >
      <View style = {{ paddingTop: 12 }}>
      {stars}
      <View style = {{ paddingTop: 5 }}>
      <TextRegular >{item.info.description}</TextRegular>
      </View>
      </View>
    </ImageCard>
    )
  }

  const renderEmptyValorationsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No valorations were retreived. Are you logged in?
      </TextRegular>
    )
  }

  const renderHeader = () => {
    return (
      <>

<Pressable
onPress={() => navigation.navigate('CreateValorations', { id: route.params.id })
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
  Rate Restaurant
</TextRegular>
</Pressable>

    </>
    )
  }

  return (
    <FlatList
      style={styles.container}
      data={valorations}
      renderItem={renderValorations}
      keyExtractor={item => item.info.id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyValorationsList}
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
