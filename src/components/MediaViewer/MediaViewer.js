import React, { Fragment } from 'react'
import { Actions } from 'react-native-router-flux'
import { View, StyleSheet } from 'react-native'
import { Container, Button, Icon, Header,Body ,Left,Right} from 'native-base'
import Swiper from 'react-native-swiper'
import FlexImage from 'react-native-flex-image'

export default ({ media, hideTop }) => (
  <Container>
      <Header transparent style = {{backgroundColor: "white",}}>
        <Left> 
           <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' style = {{color: "black"}}  />
            </Button>
            </Left>
          <Body>
          </Body>
          <Right></Right>
     </Header>
    
    <Swiper style={styles.wrapper} nextButton={styles.buttonText} prevButton={styles.buttonText}>
      { media
        .filter(({ mime_type }) => mime_type.split('/')[0] === 'image')
        .map((media, i) => (
          <View style={styles.imageSlide} key={i}>
            <FlexImage source={{ uri: media.src }} />
          </View>
        )
        )}
    </Swiper>
  </Container>
)

var styles = StyleSheet.create({
  wrapper: {},
  buttonText: {
    fontSize: 50,
    color: '#000000'
  },
  flex: {
    flex: 1
  },
  imageSlide: {
    flex: 1,
    justifyContent: 'center'
  }
})
