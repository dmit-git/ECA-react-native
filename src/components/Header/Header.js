import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Header, Left, Body, Title, Right } from 'native-base'

export default ({ eventStore, headerTitle, renderLeft, renderRight }) => {
  return (
    <View>
      <Header style={{backgroundColor: eventStore.theme.toolbarDefaultBg}}>
        <Left style={styles.flex}>
          {renderLeft}
        </Left>
        <Body style={styles.body}>
          <Title>{headerTitle}</Title>
        </Body>
        <Right style={styles.flex}>
          {renderRight}
        </Right>
      </Header>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  body: {
    flex: 1,
    alignItems: 'center'
  }
})
