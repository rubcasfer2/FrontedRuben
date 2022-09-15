
import React, { useEffect, useState, useContext } from 'react'
import { View, StyleSheet, Pressable, Text, TextInput } from 'react-native'
import { FaStar } from 'react-icons/fa'
import InputItemArea from '../../components/InputItemArea'
import { ErrorMessage, Formik } from 'formik'
import { showMessage } from 'react-native-flash-message'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { create } from '../../api/ValorationsEndpoints'
import { getDetail } from '../../api/RestaurantEndpoints'
import TextRegular from '../../components/TextRegular'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as yup from 'yup'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'

export default function StarRating ({ navigation, route }) {
  const colors = {
    orange: '#FFBA5A',
    grey: '#a9a9a9'
  }
  const { loggedInUser } = useContext(AuthorizationContext)
  const { id } = route.params
  const stars = Array(5).fill(0)
  const [currentValue, setCurrentValue] = React.useState(0)
  const [hooverValue, setHooverValue] = React.useState(undefined)
  const [backendErrors, setBackendErrors] = useState()
  const [restaurant, setRestaurant] = useState({})

  useEffect(() => {
    async function getRestaurant () {
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
    }getRestaurant()
  }, [route])

  const handleClick = value => {
    setCurrentValue(value)
  }
  const printForm = value => {
    console.log(value)
    // navigation.navigate('RestaurantsScreen', { id: restaurant.id })
  }

  const handleMouseOver = value => {
    setHooverValue(value)
  }

  const handleMouseLeave = () => {
    setHooverValue(undefined)
  }

  const createValoration = async (values) => {
    setBackendErrors([])
    try {
      const createdValoration = await create(values)
      showMessage({
        message: 'Your valoration has been recieved',
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
    navigation.navigate('RestaurantsScreen', { id: restaurant.id })
  }
  const validationSchema = yup.object().shape({
    valoration: yup
      .number()
      .required('You should give a valoration'),
    address: yup
      .string()
      .max(400, 'Feedback should be shorter')

  })
  return (
    <View style = {styles.container}>
      <Text style={styles.title}>Give us your opinion about {restaurant.name}</Text>
        <Formik
        validationSchema={validationSchema}
        initialValues={{ valoration: '', description: '', restaurantId: '' }}
        onSubmit={ createValoration }>
           {({ handleSubmit, setFieldValue, values }) => (

          <View>

          <View style = {styles.stars}>
            {stars.map((_, index) => {
              return (
                    <FaStar
                    key={index}
                    size={40}
                    style = {{
                      marginRight: 10,
                      cursor: 'pointer'
                    }}
                        color={(hooverValue || currentValue) > index ? colors.orange : colors.grey}
                        onClick={() => setFieldValue('valoration', index + 1) && setFieldValue('restaurantId', route.params.id) && handleClick(index + 1) }
                        onMouseOver={() => handleMouseOver(index + 1)}
                        onMouseLeave={handleMouseLeave}

                        />
              )
            })}

        </View>

          <InputItemArea multiline name ='description' label= 'Feedback'/>

               <Pressable
          onPress={handleSubmit
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
            Submit
          </TextRegular>
        </Pressable>
          </View>
           )}
        </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stars: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: 30

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

    textAlign: 'center',
    marginLeft: 5,
    color: 'white'
  },
  title: {
    size: 30,
    paddingTop: 10
  }

})
