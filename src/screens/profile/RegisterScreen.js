import * as ExpoImagePicker from 'expo-image-picker'
import React, { useContext, useState } from 'react'
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView, Text } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { Formik } from 'formik'
import * as yup from 'yup'
import { showMessage } from 'react-native-flash-message'
import { brandPrimary, brandPrimaryDisabled, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import maleAvatar from '../../../assets/maleAvatar.png'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import TextError from '../../components/TextError'

export default function RegisterScreen () {
  const { signUp } = useContext(AuthorizationContext)
  const [backendErrors, setBackendErrors] = useState()
  const initialUserValues = { firstName: '', lastName: '', email: '', password: '', phone: '', address: '', postalCode: '' }
  const [milkOpacity, setMilkOpacity] = useState(false)
  const [eggsOpacity, setEggsOpacity] = useState(false)
  const [glutenOpacity, setGlutenOpacity] = useState(false)
  const [fishOpacity, setFishOpacity] = useState(false)

  const eggsIcon = process.env.API_BASE_URL + '/public/restaurants/products/huevos.ico'
  const milkIcon = process.env.API_BASE_URL + '/public/restaurants/products/lacteos.ico'
  const fishIcon = process.env.API_BASE_URL + '/public/restaurants/products/pescado.ico'
  const glutenIcon = process.env.API_BASE_URL + '/public/restaurants/products/gluten.ico'
  const controlStateAllergerns = (value) => {
    let res
    if (value) {
      res = false
    } else {
      res = true
    }

    return res
  }

  const renderOpacityAllergens = (value) => {
    let res
    if (value) {
      res = 1
    } else {
      res = 0.4
    }

    return res
  }

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .max(30, 'First name too long')
      .required('First name is required'),
    lastName: yup
      .string()
      .max(50, 'Last name too long')
      .required('Last name is required'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(3, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    phone: yup
      .string()
      .min(9, ({ min }) => `Phone must be at least ${min} characters`)
      .required('Phone is required'),
    address: yup
      .string()
      .max(75, 'Address too long')
      .required('Address is required'),
    postalCode: yup
      .string()
      .max(15, 'Postal code too long')
      .required('Postal code is required')
  })

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.cancelled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }

  const register = (data) => {
    setBackendErrors([])
    signUp(data, () => showMessage({
      message: `Success. ${data.firstName}, welcome to DeliverUS! 😀`,
      type: 'success',
      style: flashStyle,
      titleStyle: flashTextStyle
    }),
    (error) => {
      setBackendErrors(error.errors)
    })
  }

  return (
        <Formik
          validationSchema={validationSchema}
          initialValues={initialUserValues}
          onSubmit={register}>
          {({ handleSubmit, setFieldValue, values, isValid }) => (
            <ScrollView>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={75}>
                <TouchableWithoutFeedback onPress={Platform.OS === 'ios' ? Keyboard.dismiss : undefined}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={styles.container}>
                      <View style={{ flexDirection: 'row', marginTop: 30 }}>
                      <TouchableOpacity onPress={() =>
                        pickImage(
                          async result => {
                            await setFieldValue('file', result)
                          }
                        )
                      }>
                        <Image style={styles.image} source={values.file ? { uri: values.file.uri } : maleAvatar} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={values.file
                        ? async () => await setFieldValue('file', null)
                        : () =>
                            pickImage(
                              async result => {
                                await setFieldValue('file', result)
                              }
                            )
                      }>
                        <View style={{ paddingRight: 0, height: 30 }}>
                          {values.file
                            ? <MaterialCommunityIcons name='close' style={{ marginLeft: 0 }} size={30} />
                            : <MaterialCommunityIcons name='pencil' style={{ marginLeft: 0 }} size={30} />
                          }
                        </View>
                      </TouchableOpacity>
                      </View>
                      <InputItem
                        name='firstName'
                        label='First name'
                        textContentType='name'
                      />
                      <InputItem
                        name='lastName'
                        label='Last name'
                        textContentType='familyName'
                      />
                      <InputItem
                        name='email'
                        label='Email'
                        textContentType='emailAddress'
                        placeholder="owner1@owner.com"
                      />
                      <InputItem
                        name='password'
                        label='Pass'
                        textContentType='password'
                        secureTextEntry={true}
                      />
                      <InputItem
                        name='phone'
                        label='Phone'
                        textContentType='telephoneNumber'
                      />
                      <InputItem
                        name='address'
                        label='Address'
                        textContentType='fullStreetAddress'
                      />
                      <InputItem
                        name='postalCode'
                        label='Postal Code'
                        textContentType='postalCode'
                      />
                          <Text style={{ paddingBottom: 5, alignSelf: 'flex-start' }}>Select the allergens of product</Text>
              <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
               <View style={styles.icons} >
        <TouchableOpacity onPress={() => { setFieldValue('gluten', !(glutenOpacity)) && setGlutenOpacity(controlStateAllergerns(glutenOpacity)) }}>
          <Image source={glutenIcon} style={{ width: 50, height: 50, opacity: renderOpacityAllergens(glutenOpacity) }}/>
        </TouchableOpacity>

      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => { setFieldValue('milk', !(milkOpacity)) && setMilkOpacity(controlStateAllergerns(milkOpacity)) }}>
          <Image source={milkIcon} style={{ width: 50, height: 50, opacity: renderOpacityAllergens(milkOpacity) }}/>
        </TouchableOpacity>

      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => { setFieldValue('fish', !(fishOpacity)) && setFishOpacity(controlStateAllergerns(fishOpacity)) }}>
          <Image source={fishIcon} style={{ width: 50, height: 50, opacity: renderOpacityAllergens(fishOpacity) }}/>
        </TouchableOpacity>

      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => { setFieldValue('eggs', !(eggsOpacity)) && setEggsOpacity(controlStateAllergerns(eggsOpacity)) }}>
          <Image source={eggsIcon} style={{ width: 50, height: 50, opacity: renderOpacityAllergens(eggsOpacity) }}/>
        </TouchableOpacity>

      </View>
      </View>
                      {backendErrors &&
                        backendErrors.map((error, index) => <TextError key={index}>{error.message}</TextError>)
                      }

                      <Pressable disabled={!isValid} onPress={handleSubmit}
                        style={({ pressed }) => [
                          {
                            backgroundColor: pressed
                              ? brandPrimaryTap
                              : brandPrimary
                          },
                          {
                            backgroundColor: !isValid
                              ? brandPrimaryDisabled
                              : brandPrimary
                          },
                          styles.button]}
                      >
                        <TextRegular textStyle={styles.text}>Sign up</TextRegular>
                      </Pressable>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </ScrollView>
          )}
        </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',

    width: '60%'
  },
  icons: {
    alignItems: 'center',
    paddingRight: 20,
    width: '30%'
  },
  image: {
    width: 100,
    height: 100,
    borderColor: brandPrimary,
    borderWidth: 1,
    borderRadius: 50,
    marginTop: -20,
    alignSelf: 'center'
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center'
  }
})
