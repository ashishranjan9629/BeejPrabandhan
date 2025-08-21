import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WrapperContainer from '../../utils/WrapperContainer'
import InnerHeader from '../../components/InnerHeader'

const Notification = () => {
  return (
    <WrapperContainer>
     <InnerHeader title={"Notification"}/>
    </WrapperContainer>
  )
}

export default Notification

const styles = StyleSheet.create({})