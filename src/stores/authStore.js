import AsyncStorage from '@react-native-community/async-storage';
import get from 'lodash/get'
import { observable, action, computed } from 'mobx'
import { Actions } from 'react-native-router-flux'
import chatStore from './chatStore'
import { sync, eventSync, eventNotificationSync } from '../sync'
import pushRegistration from '../pushRegistration'   // Notification
import authHistoryStore from './authHistoryStore'
import eventStore from './eventStore'

const Constants = require('../../app.json')
const { CHAT_ENABLED } = Constants.expo.extra

function normalizeAttendee (attendee) {
  const gqlSyncs = get(attendee, 'syncs.nodes')
  const plainSyncs = get(attendee, 'syncs') || []
  return {
    ...attendee,
    client_metadata: JSON.parse(attendee.client_metadata || '{}'),
    syncs: gqlSyncs || plainSyncs
  }
}

class AuthStore {
  @observable token
  @observable profile = {}

  constructor () {
    AsyncStorage.multiGet(['token', 'profile'], (errs, [token, profile]) => {
      if (errs && errs.length > 0) {
        console.log(errs)
        return
      }
      if (!token[1] || !profile[1]) return this.logout()
      this.profile = JSON.parse(profile[1])
      this.token = token[1]
      if (CHAT_ENABLED) chatStore.init(this.profile, this.token)
    })
  }

  getProfile () {
    return this.profile
  }

  @computed get groupIDs () {
    return this.profile.groups ? this.profile.groups.map(({ id }) => id) : []
  }

  @action
    setSession (login, authToken=null) {
    const attendee = normalizeAttendee(login)
    
    if(authToken!=null){
      attendee.token=authToken;
    }
    if (attendee.token) {
      const token = attendee.token
      this.token = token
      pushRegistration(token)   // Notification
      AsyncStorage.setItem('token', token)
      if (CHAT_ENABLED) chatStore.init(attendee, token)
    }
    AsyncStorage.setItem('profile', JSON.stringify(attendee || ''))
    this.profile = attendee
    return attendee
  }
  
  login(login, variables) {
    login({ variables }).then(resp =>{
      if(resp){
        authHistoryStore.createOrUpdateAuthHistory()
        return resp
      }
      return null
    })
  }
  
  async logout () {
    try {
      await AsyncStorage.removeItem('token')
      eventStore.clear()
      Actions.replace('authStack')
    } catch (e) {
      console.log('AuthStore.logout error', e)
      alert('Something went wrong! If this problem persists, contact your administrator.')
    }
  }

  sync (eventID) {
    if (this.token) {
      if (eventID) return eventSync(this.token, eventID)
      else return sync(this.token)
    }
  }

  notificationSync (eventID) {
    if (this.token) return eventNotificationSync(this.token, eventID)
  }
}

export default new AuthStore()
