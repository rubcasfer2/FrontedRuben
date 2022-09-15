import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

export default function Start () {
  return (
    <FontAwesome name = {this.props.filled === true ? 'star' : 'star-o' }color="yellow" size={32} style={{ marginHorizontal: 6 }}/>
  )
}
