import AsyncStorage from '@react-native-community/async-storage';


// export const UnReadNotificationFromStore = 330;

export async function _setNotificationUnRead(number) {
  try {
    await AsyncStorage.setItem('storeUnreadNotification', number);
    // console.log("Set Notifications UnRead");
  }
  catch (error) {
    console.log('error while Setting Notification UnRead', error);
  }
}

export async function _getNotificationUnRead(callback) {
  try {
    const value = await AsyncStorage.getItem('storeUnreadNotification');
    if (value !== null) {
      //console.log("Value in Store..",value);
      Store.UnReadNotificationFromStore = value;
    }
    else {
      console.log("No Value in Sotre..");
    }
    callback();
  }
  catch (error) {
    console.log("catch error while getting Notification..");
  }
}

export class Store {
  static UnReadNotificationFromStore = 0;
}
