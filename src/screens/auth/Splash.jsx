import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ImagePath from '../../utils/ImagePath'

const Splash = () => {
  return (
    <View style={styles.main}>
     <Image
      source={ImagePath.splashImage}
      resizeMode='stretch'
      style={{width:'100%',height:'100%'}}
     />
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  main:{
    flex:1,
  }
})