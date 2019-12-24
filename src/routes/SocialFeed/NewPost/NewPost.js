import React, { Component, Fragment } from 'react'
import chunk from 'lodash/chunk'
import { StyleSheet, View, Dimensions } from 'react-native'
import FlexImage from 'react-native-flex-image'
import { Actions } from 'react-native-router-flux'
import { Content, Button, Form, Textarea, Icon, Text, Container, Row, Col, Grid } from 'native-base'
import Header from '../../../components/Header'
import Loading from '../../../components/Loading'
import analyticsStore from '../../../stores/analyticsStore'

import { uploadPostImage, uploadPostVideo } from '../../../uploadImage'
import Video from 'react-native-video';

import ImagePicker from 'react-native-image-picker';

const optionsImageGallery = {
  allowsEditing: true,
  mediaType: 'photo',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const optionsVideoGallery = {
  mediaType: 'video',
};


export default class NewPost extends Component {
  state = {
    body: '',
    uploading: false,
    media: [],
    hashWord: false,
    tagWords: [],
  }

  componentDidMount() {
    analyticsStore.sendScreenView('New Post')
  }

  submit = () => {
    const { body, media } = this.state

    console.log(body);
    if (!body.length) {
      alert('Please add some text to your post before submitting.')
      return
    }
    let newBody = encodeURIComponent(body);
    this.props.onCreate({ body:newBody, media:media })
  }

  handleSetState = (name) => (val) => {
    this.setState({
      [name]: val,
    })


    if (this.state.body != "") {
      const { tagWords } = this.state
      let mString = this.state.body;
      this.state.tagWords.length = 0
      for (let i = 0; i <= mString.length; i++) {
        
        let word = mString.indexOf("#", i)

        if (word != -1) {

          let mySpace = mString.indexOf(" ", word)

          if (mySpace != -1) {

            let mSlice = mString.slice(word, mySpace);
            if (!tagWords.includes(mSlice)) {
              tagWords.push(mSlice)
            }
          }
        }
      }
    }
  }

  pickImage = async () => {
    ImagePicker.launchImageLibrary(optionsImageGallery, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        alert('Please try again.')
      } else {
        const source = { uri: response.uri };
        if (!response.cancelled) {
          this.handleImagePicked(response)
        }
      }
    });
  }
  pickVideo = async () => {
    ImagePicker.launchImageLibrary(optionsVideoGallery, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        alert('Plese try again.')
      } else {
        const source = { uri: response.uri };
        if (!response.cancelled) {
          this.handleVideoPicked(response)
        }
      }
    });
  }

  takePhoto = async () => {
    ImagePicker.launchCamera(optionsImageGallery, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        alert('Plese try again.')
      } else {
        const source = { uri: response.uri };
        if (!response.cancelled) {
          this.handleImagePicked(response)
        }
      }
    });
  }

  handleImagePicked = async pickerResult => {
    const { media } = this.state
    let uploadResponse, uploadResult

    try {
      this.setState({ uploading: true })

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadPostImage(pickerResult.uri)
        const mediaJSON = await uploadResponse.json()
        const { id, name, src, mime_type } = mediaJSON
        media.push({ id, name, src, mime_type })
        this.setState({ media, uploading: false })
        analyticsStore.sendEvent({ category: 'New Post', action: 'upload', label: src })
      }
    } catch (e) {
      console.log('NewPost.handleImagePicked error', e)
      this.setState({ uploading: false })
      setTimeout(() => {
        alert('Something went wrong! If this problem persists, contact your administrator.')

      }, 100);
    }
  }

  handleVideoPicked = async pickerResult => {
    try {
      this.setState({ uploading: true })
      if (!pickerResult.cancelled) {
        await uploadPostVideo(pickerResult, (mediaJSON) => {
          this.setState({ media: [mediaJSON], uploading: false })
          analyticsStore.sendEvent({ category: 'New Post', action: 'upload', label: mediaJSON.src })
        })
      }
    } catch (e) {
      console.log('NewPost.handleVideoPicked error', e)
      alert('Something went wrong! If this problem persists, contact your administrator.')
    }
  }

  render() {
    const { media, uploading, tagWords } = this.state
    const mediaList = chunk(media, 3)
    const width = Dimensions.get('window').width

//             <View style={{
//               flex: 1,
//               flexDirection: 'row',
//               flexWrap: 'wrap'
//             }}>
//               {
//                 this.state.tagWords.map((item, key) => (
//                   <Text style={{ marginLeft: 4 }} key={key}>{item},</Text>
//                 ))
//               }
//             </View>

    return (
      <Container>
        <Header
          headerTitle={'New Post'}
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        <Content >
          <View style={styles.container}>
            <Form>
              <Textarea
                rowSpan={7}
                value={this.state.body}
                onChangeText={this.handleSetState('body')}
                placeholder={`What's on your mind?`}
              />
            </Form>
          </View>
          <Button full primary onPress={this.submit} disabled={uploading}>
            <Text>{uploading ? 'Uploading...' : 'Submit'}</Text>
          </Button>
          <Button icon full bordered onPress={this.pickImage} disabled={uploading}>
            <Icon name='md-images' />
            <Text>Add Photo</Text>
          </Button>
          <Button icon full bordered onPress={this.takePhoto} disabled={uploading}>
            <Icon name='md-camera' />
            <Text>Take Photo</Text>
          </Button>
          <Button icon full bordered onPress={this.pickVideo} disabled={uploading}>
            <Icon name='md-videocam' />
            <Text>Add Video</Text>
          </Button>
          {
            uploading ? (
              <View style={styles.loadingContainer}>
                <Loading />
              </View>
            ) : <Fragment />
          }
          {
            media.length > 0 ? (
              <Grid>
                {mediaList.map((list, i) => (
                  <Row key={`row:${i}`}>
                    {list.map((media, i) => {
                      const type = media.mime_type.split('/')[0]
                      if (type === 'image') {
                        return (
                          <Col key={media.id}>
                            <FlexImage source={{ uri: media.src }} />
                          </Col>
                        )
                      } else if (type === 'video') {
                        return (
                          <Col key={media.id}>
                            <Video
                              source={{ uri: media.src }}
                              rate={1.0}
                              volume={1.0}
                              isMuted
                              resizeMode='cover'
                              shouldPlay
                              isLooping={false}
                              style={{ width, height: (9 * width) / 16 }}
                            />
                          </Col>
                        )
                      } else return <Fragment key={media.id} />
                    })}
                  </Row>
                ))}
              </Grid>
            ) : <Fragment />
          }
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  loadingContainer: {
    flex: 1,
    paddingTop: 20
  }
})
