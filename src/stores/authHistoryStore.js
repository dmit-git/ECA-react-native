import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { GraphQLClient } from 'graphql-request'
import { action, observable, computed } from 'mobx'
import { GRAPHQL_ENDPOINT } from '../config'

const authHistory = `mutation createOrUpdateAuthHistory($auth_history: AuthHistoryInput!) {
  createOrUpdateAuthHistory(auth_history: $auth_history) {
    device_uniq_id
    app_version
    app_build_version
  }
}`

class AppVersionModel {
  @observable app_version
  @observable app_build_version
  
  constructor(){
		this.app_version       = DeviceInfo.getVersion(),
		this.app_build_version = DeviceInfo.getBuildNumber()
  }
}

function buildAuthHistory(){
  return {
    device_uniq_id:      DeviceInfo.getUniqueID(), 
    device_manufacturer: DeviceInfo.getManufacturer(),
    device_model:        DeviceInfo.getModel(),
    device_id:           DeviceInfo.getDeviceId(),
    device_os:           DeviceInfo.getSystemName(),
    device_os_version:   DeviceInfo.getSystemVersion(),
    
    app_bundle_id:       DeviceInfo.getBundleId(),
    app_version:         DeviceInfo.getVersion(),
    app_build_version:   DeviceInfo.getBuildNumber()
  }
}

class AuthHistoryStore {
  
  @computed get appVersion () {
    return DeviceInfo.getVersion()
  }
  
  // @action 
  // createAuthHistory being triggered on opening or starting the App!
  checkAppVersion = async (appState) => {
    // Actual states: active/inactive/background 
    // Also unknown comes on first load before active
    if(appState === "unknown"){
      const preV = JSON.parse( await AsyncStorage.getItem('appVersion') ) 
      const newV = new AppVersionModel()

      if( preV && ((preV.app_version !== newV.app_version) || (preV.app_build_version !== newV.app_build_version)) ){
        this.createOrUpdateAuthHistory()
      }
    }
  }

  // createAuthHistory being triggered on login/sign-in only!
  @action createOrUpdateAuthHistory = async () => {
    const token = await AsyncStorage.getItem('token');
    const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    try {
      await client.request(authHistory, { auth_history: buildAuthHistory() })
      const model = new AppVersionModel()
      AsyncStorage.setItem('appVersion', JSON.stringify(model))
    } catch (e) {
      console.log('gql -> Error :', e);
    }
  }
}

export default new AuthHistoryStore()
