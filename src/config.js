import { Platform } from 'react-native'

let Constants = require('../app.json');

const {
  CLIENT_ID,
  CLIENT_NAME,
  BPNYC_API_SERVER_URL,
  IS_DEVELOPMENT,
  EXTERNAL_AUTH_CLIENT_URL
} = Constants.expo.extra;

const DEV_IP = 'http://10.0.0.99'

export const SERVER_CLIENT_ID = CLIENT_ID;

export const SERVER_URL = !IS_DEVELOPMENT
  ? BPNYC_API_SERVER_URL
  : `${DEV_IP}:8080`;

export const OAUTH_LOGIN_URL = EXTERNAL_AUTH_CLIENT_URL; // !IS_DEVELOPMENT
// ? EXTERNAL_AUTH_CLIENT_URL
// : `${DEV_IP}:3000/login`

export const GRAPHQL_ENDPOINT = `${SERVER_URL}/graphql/client/${CLIENT_ID}`;

// https://github.com/pusher/chatkit-client-js/issues/95
export const PUSHER_TOKEN_ENDPOINT = `${SERVER_URL}/pusherToken/${CLIENT_ID}`; // re-enable our auth when pusher shit works correctly

export const PREFIX = Platform.OS === 'android' ? `${CLIENT_NAME}://events/` : `${CLIENT_NAME}://`;
