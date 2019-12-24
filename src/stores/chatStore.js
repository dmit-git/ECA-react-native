import AsyncStorage from '@react-native-community/async-storage';
import { observable, action } from 'mobx'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client/react-native'
import eventStore from './eventStore'
import { PUSHER_TOKEN_ENDPOINT } from '../config'
let Constants = require('../../app.json')

const { PUSHER_INSTANCE } = Constants.expo.extra

class ChatStore {
  chatManager = null
  pusherToken = null
  @observable currentUser = null

  constructor () {
    AsyncStorage.getItem('pusherToken', (err, pusherToken) => {
      if (err) console.log(err)
      if (!pusherToken) return
      this.pusherToken = pusherToken
    })
  }

  init = async (profile, authToken) => {
    if (eventStore.offline) {
      alert('Sorry, chat features are disabled until you reconnect to the internet and re-open the app.')
      return
    }
    const tokenProvider = new TokenProvider({
      url: PUSHER_TOKEN_ENDPOINT,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })

    this.chatManager = new ChatManager({
      instanceLocator: PUSHER_INSTANCE,
      userId: profile.email,
      tokenProvider: tokenProvider,
      timeout: 10000
    })

    try {
      const currentUser = await this.chatManager.connect()
      this.setCurrentUser(currentUser)
      this.updateChatKitUser(profile)
    } catch (e) {
      console.log('AuthStore.logout error', e)
      alert('Something went wrong! If this problem persists, contact your administrator.')
    }
  }

  @action
  setCurrentUser (currentUser) {
    this.currentUser = currentUser
  }

  updateChatKitUser = async (profile) => {
    try {
      await fetch(`https://us1.pusherplatform.io/services/chatkit/v1/${PUSHER_INSTANCE}/users/${encodeURIComponent(profile.email)}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`,
          avatar_url: profile.avatar_url
        })
      })
    } catch (e) {
      console.log('Could not update chatkit user', e)
    }
  }
}

export default new ChatStore()
