import { SERVER_URL } from './config'
import authStore from './stores/authStore'

const SYNC_ENDPOINT = `${SERVER_URL}/sync`

export const sync = function sync (authToken) {
  return fetch(SYNC_ENDPOINT, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  })
    .then(res => res.json())
    //.then(authStore.setSession)
    .then(res=> (authStore.setSession(res,authToken)))
    .catch(e => console.log(e))
}

export const eventNotificationSync = function eventSync (authToken, eventID) {
  return fetch(`${SYNC_ENDPOINT}/${eventID}/notifications`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  })
    .then(res => res.text())
    .catch(e => console.log(e))
}

export const eventSync = function eventSync (authToken, eventID) {
  return fetch(`${SYNC_ENDPOINT}/${eventID}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  })
    .catch(e => console.log(e))
}
