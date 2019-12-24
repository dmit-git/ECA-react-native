import AsyncStorage from '@react-native-community/async-storage';
import { observable, action } from 'mobx'
import {
  Analytics,
  Hits as GAHits
} from 'react-native-google-analytics'
import DeviceInfo from 'react-native-device-info';
const deviceName = DeviceInfo.getDeviceName();
const installationId = DeviceInfo.getUniqueID();
class AnalyticsStore {
  @observable analyticsID

  analytics = null

  constructor () {
    AsyncStorage.getItem('analyticsID', (err, analyticsID) => {
      if (err) return console.log('Failed to get local analytics ID', err)
      if (!analyticsID) return
      this.initGoogleAnalytics(analyticsID)
    })
  }

  @action initGoogleAnalytics (analyticsID) {
    if(!analyticsID) return
    this.analyticsID = analyticsID
    AsyncStorage.setItem('analyticsID', analyticsID)
    this.ga = new Analytics(analyticsID, installationId, 1, deviceName)
  }

  sendScreenView (screenName) {
    let screenView = new GAHits.Event('Screen View', screenName, installationId)
    // let screenView = new GAHits.ScreenView(
    //   this.eventName,
    //   screenName,
    //   installationId 
    // )
    if (this.ga) this.ga.send(screenView)
  }

  sendEvent ({ category, action, label, value }) {
    let gaEvent = new GAHits.Event(category, action, label, value)
    if (this.ga) this.ga.send(gaEvent)
  }
}

export default new AnalyticsStore()
