import React from 'react'
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export default ({item}) => {
  return(
    <View style={styles.container}>
      <Image source={{ uri: item.src }} style={styles.image} /> 
    </View>
  )
}

const badgeContainerWidth = width / 4;
const kudoImageWidth = badgeContainerWidth * 0.6;
var styles = StyleSheet.create({
    container: {
        width: badgeContainerWidth,
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: badgeContainerWidth / 10,
    },
    image: {
        width: kudoImageWidth,
        height: kudoImageWidth,
    },
})
  