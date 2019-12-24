import React, { PureComponent, Fragment } from 'react'
import throttle from 'lodash/throttle'
import { Dimensions, TouchableHighlight, View, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import FlexImage from 'react-native-flex-image'
import gql from 'graphql-tag'
import moment from 'moment'
import { Card, CardItem, Left, Body, Text, Icon, Button, Grid, Right, Row, Col, ActionSheet, Thumbnail } from 'native-base'
import { withApollo } from 'react-apollo'
import LikeButton from '../LikeButton'
import Hashtag from './Hashtag'

var BUTTONS = ['Edit Post', 'Delete Post', 'Cancel']
var DESTRUCTIVE_INDEX = 1
var CANCEL_INDEX = 2

export const DELETE_POST = gql`
  mutation deletePost($id: Uint!) {
    deletePost(id: $id) {
      id
    }
  }
`

class PostCard extends PureComponent {

  handlePlayVideo = (media) => throttle(() => {
    Actions.push('mediaStack', { id: media.id })
  }, 300, { leading: true })

  handlePlaybackStatus = async (status) => {
    if (status.didJustFinish) {
      await this.videoRef.current.stopAsync()
      this.setState({ videoPlaying: false })
    }
  }

  handleDeletePost = (id) => {
    return this.props.client.mutate({
      mutation: DELETE_POST,
      variables: { id }
    })
  }

  showActionSheet = (id) => () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) return Actions.push('editPost', { id })
        if (buttonIndex === DESTRUCTIVE_INDEX) {
          await this.handleDeletePost(id)
          await this.props.client.resetStore()
          Actions.reset('feed', { forceRefetch: true })
        }
        if (buttonIndex === CANCEL_INDEX) return ActionSheet.hide()
        else ActionSheet.hide()
      }
    )
  }

  renderMedia = (media) => {
    const width = Dimensions.get('window').width
    const type = media.mime_type.split('/')[0]
    const extension = media.mime_type.split('/')[1]
    if (type === 'image') {
      return (
        <FlexImage source={{ uri: media.src }} />
      )
    } else if (type === 'video' || extension === 'gif') {
      const height = (9 * width) / 16
      return (
        <TouchableHighlight onPress={this.handlePlayVideo(media)} style={{ height: height, width: width, backgroundColor: 'black' }}>
          <Icon name='md-play' style={{ position: 'absolute', left: (width / 2) - 12, top: (height / 2) - 24, color: 'white', fontSize: 48 }} />
        </TouchableHighlight>
      )
    } else return <Fragment />
  }

  render() {
    const { myID, post, handleMediaClick, isMine, handleCommentClick, showButtons } = this.props;
    const attendees_who_liked = post.attendees_who_liked || { nodes: [] };
    const likes = attendees_who_liked.nodes.map(({ id }) => id)

    const media = post.media || { nodes: [] };
    const comments = post.comments || { nodes: [] };

    let postBody = decodeURIComponent(post.body) || '';
    const attendee = post.attendee || {};
    
    const regex = {
      // regex matches #hashtag #words
      hashtag: /(^|\s)(#[\w\-_]+)/g,      
      // regex matches a wide variation of urls 
      // including any time a period is sandwiched with alpha-numeric characters: asdfae3.cjakse2
      url: /([\w\-\/\:]+\.[\w\-\.]+[\w\-\/\=\?\%\&\#]+)/g,
    }

    return (
      <Card>
        <CardItem>
          <Left>
            {attendee.avatar_url
              ? (<Thumbnail source={{ uri: attendee.avatar_url }} />) : null
            }
            <Body>
              <Text>{`${attendee.first_name} ${attendee.last_name}`}</Text>
              <Text note>{moment(post.created_at, moment.ISO_8601).fromNow()}</Text>
            </Body>
          </Left>
          {isMine ? (
            <Right>
              <Button transparent primary onPress={this.showActionSheet(post.id)}>
                <Icon name='md-build' />
              </Button>
            </Right>
          ) : null}
        </CardItem>
        {media.nodes.length > 0 ? (
          <CardItem cardBody>
            <Grid>
              <Row>
                <Col>
                  {this.renderMedia(media.nodes[0])}
                </Col>
              </Row>
            </Grid>
          </CardItem>
        ) : <Fragment />
        }
        {
          media.nodes.length > 1 ? (
            <Button transparent primary full onPress={handleMediaClick}>
              <Icon name='md-photos' />
              <Text>+{media.nodes.length - 1} More</Text>
            </Button>
          ) : <Fragment />
        }
        <CardItem>
          <Body>
            {
              postBody.length > 0 ? (
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}>
                    <Text style={{ marginLeft: 4 }} >
                    {

                      postBody.split(regex['hashtag']).map((chunk,i) => {
                        if(regex['hashtag'].test(chunk)) {
                          return <Hashtag text={chunk} key={i} onPress={this.props.handleHashtagClick}/>
                        }
                        else {

                          return (chunk.split(regex['url']).map((word, j) => {

                              if(regex['url'].test(word)) {
                                const uri = word.match(/^(?:https?)/g) ? word : `http://${word}`
                                return <Text style={{color: 'blue'}} onPress={()=> {this.props.handleLinkClick(uri)}} key={j}>{word}</Text>
                              }
                              else if (word !== '/' && word !== undefined) {                                
                                return <Text key={j}>{word}</Text>
                              }

                            })
                          )                                                                              
                        }
                        
                      })
                    }
                    </Text>       
                </View>
              ) : <Fragment />
            }
          </Body>
        </CardItem>
        {showButtons ? (
          <CardItem>
            <Grid>
              <Row>
                <Col>
                  <LikeButton myID={myID} liked={likes.includes(myID)} isMine={isMine} id={post.id} likes={likes.length} />
                </Col>
                <Col style={{ width: 10 }} />
                <Col>
                  <Button bordered block onPress={handleCommentClick}>
                    <Icon name='md-quote' />
                    <Text>{comments.nodes.length > 0 ? `${comments.nodes.length} Comments` : 'Comment'}</Text>
                  </Button>
                </Col>
              </Row>
            </Grid>
          </CardItem>
        ) : <Fragment />}
      </Card>
    )
  }
}

export default withApollo(PostCard)
