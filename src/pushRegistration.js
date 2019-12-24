import {SERVER_URL} from './config'
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
// import {createNotificationListeners} from "./RootNavigation";
// import {SERVER_CLIENT_ID  } from './config';

const PUSH_ENDPOINT = `${SERVER_URL}/pushToken`;

export default async function registerForPushNotificationsAsync(authToken) {

    checkPermission(authToken);
}

async function checkPermission(authToken) {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        let token = await AsyncStorage.getItem('fcmToken');
        if (token == null) {
            getToken(authToken);
        } else {
            registerTokenWithBackend(authToken);
        }
    } else {
        requestPermission(authToken);
    }
}

async function requestPermission(authToken) {
    try {
        // await firebase.messaging().requestPermission();
        firebase.messaging().requestPermission()
            .then(() => {
                getToken(authToken);
            })
            .catch(error => {
                console.log("Error While Request Permission Push Regrestration...  : " + error);
            });
        // User has authorised
        console.log("Permission Granted... Push Regrestration...");
    } catch (error) {
        console.log('permission rejected   Push Regrestration...');
    }
}

async function getToken(authToken) {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("FCM Token is : " + fcmToken);
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken).then(() => {
               registerTokenWithBackend(authToken);
            });
            console.log("FCM Token is : " + fcmToken);
        }
    }
}

async function registerTokenWithBackend(authToken) {
    await AsyncStorage.getItem('fcmToken').then((token) => {
        // createNotificationListeners();
        return fetch(PUSH_ENDPOINT, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                token
            })
            // body: JSON.stringify({
            //     token:token,
            //     // clientID:parseInt(SERVER_CLIENT_ID),
            // })
        })
    });
}
