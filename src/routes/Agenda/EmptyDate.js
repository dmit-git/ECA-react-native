import React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import { Text } from 'native-base'

export default () => (
  <View style={styles.item}>
    <Text>No events this day</Text>
  </View>
)

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: 80
  }
})
