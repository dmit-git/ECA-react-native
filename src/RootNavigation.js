import React from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import {Icon} from 'native-base'
// import throttle from 'lodash/throttle'
import { Scene, Router, Actions, Drawer, Stack } from 'react-native-router-flux'
import SplashScreen from 'react-native-splash-screen';

import Login from './routes/Login'
import AttendeeEvents from './routes/AttendeeEvents'
import Home from './routes/Home'
import Agenda from './routes/Agenda'
import AgendaItem from './routes/AgendaItem'
import NewPost from './routes/SocialFeed/NewPost'
import Messages from './routes/Messages'
import Feed from './routes/SocialFeed'
import Page from './routes/Page'
import Library from './routes/Library'
import Media from './routes/Media'
import Post from './routes/SocialFeed/Post'
import PostLikes from './routes/PostLikes'
import EditPost from './routes/SocialFeed/EditPost'
import WebView from './routes/WebView'
import ChatDirectory from './routes/ChatDirectory'
import Message from './routes/Message'
import Directory from './routes/Directory'
import Connections from './routes/Connections'
import NotificationsRoute from './routes/Notifications'
import AttendeeDetail from './routes/AttendeeDetail'
import OAuthWebView from './routes/OAuthWebView'

import Loading from './components/Loading'
import EventDrawer from './components/EventDrawer'
import MediaViewer from './components/MediaViewer'

import { PREFIX } from './config'
 import pushRegistration from './pushRegistration'    // Notification
import { sync } from './sync'
import eventStore from './stores/eventStore'
import  firebase from 'react-native-firebase';
const onEnter = () => {
  SplashScreen.hide();
  AsyncStorage.getItem('token', async (err, token) => {
    if (err) console.log(err)
    if (token) {
      console.log('Token: ', token)
      if (!eventStore.offline) {
        pushRegistration(token) // Notification
        await sync(token)
      }
      createNotificationListeners();
      
    if (eventStore.hasSetEvent) Actions.reset('event')
      else Actions.reset('attendeeEvents')
    } else {
      Actions.replace('login')
    }
  })
}

 onNotification = (link) => {
  AsyncStorage.getItem('token', function (err, token) {
  // AsyncStorage.getItem('fcmToken', function (err, token) {
    if (err) console.log(err)
    if (token) {
      if (!eventStore.offline) sync(token)
      if (link.indexOf('http') > -1) return Actions.push('webView', { uri: link })
      if (link.indexOf('/') < 0) return Actions.push(link)
      const [_, key, id] = link.split('/')
      Actions.push(key, { id })
    } else {
      Actions.reset('authStack')
    }
  })
};

export async function createNotificationListeners()  {
  /*
  * Triggered when a particular notification has been received in foreground
  * */
  this.notificationListener = firebase.notifications().onNotification((notification) => {
    if (notification._data.link) {
      this.onNotification(notification._data.link);
    }
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    if (notificationOpen.notification._data.link) {
      this.onNotification(notificationOpen.notification._data.link);
    } 
  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
    if (notificationOpen.notification._data.link) {
      this.onNotification(notificationOpen.notification._data.link);
    }
  }
  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    this.onNotification(message);
    console.log(JSON.stringify(message || ''));
  });
}

export default () => (
  <Router uriPrefix={PREFIX}>
    <Stack key='root' panHandlers={null} hideNavBar>
      <Stack key='authStack' hideNavBar>
        <Scene key='handleToken' initial component={Loading} onEnter={onEnter} />
        <Scene key='login' component={Login} />
        <Scene key='forgotPassword' component={Login} />
        <Scene key='oauthWebView' component={OAuthWebView} />
      </Stack>
      <Scene key='attendeeEvents' hideNavBar path='attendeeEvents' component={AttendeeEvents} type='replace' />
      <Drawer drawerWidth={280} hideNavBar key='event' path='/event/:id' contentComponent={EventDrawer} drawerIcon={<Icon name='md-menu' size={30} style={{ padding: 8 }} />}>
        <Stack panHandlers={null} hideNavBar>
          <Scene key='home' path='/event/:id/home' component={Home} type='replace' />
          <Scene key='agenda' path='/event/:id/agenda' component={Agenda} type='replace' />
          <Scene key='messages' path='/event/:id/messages' component={Messages} type='replace' />
          <Scene key='feed' path='/event/:id/feed' component={Feed} type='replace' />
          <Scene key='editPost' path='/post/:id/edit' component={EditPost} type='replace' />
          <Scene key='postLikes' path='/post/:id/likes' component={PostLikes} type='replace' />
          <Scene key='directory' path='/directory' component={Directory} type='replace' />
          <Scene key='connections' path='/connections' component={Connections} type='replace' />
          <Stack key='pageStack' hideNavBar type='replace'>
            <Scene key='page' path='/page/:id' component={Page} />
          </Stack>
          <Scene key='notifications' path='/notifications' component={NotificationsRoute} type='replace' />
          <Scene key='chatDirectory' path='/chatDirectory' component={ChatDirectory} />
          <Scene key='message' path='/message/:id' component={Message} />
          <Stack key='mediaStack' hideNavBar>
            <Scene key='media' path='/media/:id' component={Media} />
          </Stack>
          <Stack key='pageStack' hideNavBar>
            <Scene key='page' path='/page/:id' component={Page} />
          </Stack>
          <Stack key='libraryStack' hideNavBar>
            <Scene key='library' path='/library/:id' component={Library} />
          </Stack>
          <Stack key='agendaItemStack' hideNavBar>
            <Scene key='agendaItem' path='/agenda/:id' component={AgendaItem} />
          </Stack>
          <Stack key='newPostStack' hideNavBar>
            <Scene key='newPost' path='/post/new' component={NewPost} />
          </Stack>
          <Stack key='post' hideNavBar>
            <Scene key='post' path='/post/:id' component={Post} />
          </Stack>
          <Stack key='mediaViewer' hideNavBar>
            <Scene key='mediaViewer' component={MediaViewer} />
          </Stack>
          <Stack key='webViewStack' hideNavBar>
            <Scene key='webView' component={WebView} />
          </Stack>
          <Scene key='attendeeDetail' path='/attendeeDetail' component={AttendeeDetail} />        
        </Stack>
      </Drawer>
    </Stack>
  </Router>
)
