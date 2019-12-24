import React from 'react'
import {
  ActivityIndicator,
  View,
  StyleSheet
} from 'react-native'

export default () => (
  <View style={styles.container}>
    <ActivityIndicator size='large' color='#000000' />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
