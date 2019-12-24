import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import now from 'lodash/now'
import { SERVER_URL } from './config'
import authStore from './stores/authStore'
import eventStore from './stores/eventStore'
let Constants = require('../app.json')

const { CLIENT_ID } = Constants.expo.extra

export const uploadAttendeeImage = async (uri) => {
  const uploadUrl = `${SERVER_URL}/clients/${CLIENT_ID}/attendees/${authStore.profile.id}/upload`

  let uriParts = uri.split('.')
  let fileType = uriParts[uriParts.length - 1]

  let formData = new FormData()
  formData.append('file', {
    uri,
    name: `${encodeURI(authStore.profile.email)}-${now()}.${fileType}`,
    type: `${(Platform.OS === 'android') ?`image/jpeg` : `image/${fileType}`}`
  })

  const token = await AsyncStorage.getItem('token')

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  }

  return fetch(uploadUrl, options)
}

export const uploadPostImage = async (uri) => {
  const uploadUrl = `${SERVER_URL}/clients/${CLIENT_ID}/events/${eventStore.event.id}/posts`

  let uriParts = uri.split('.')
  let fileType = uriParts[uriParts.length - 1]

  let formData = new FormData()
  formData.append('file', {
    uri,
    name: `${encodeURI(authStore.profile.email)}-${now()}.${fileType}`,
    // type: `image/${fileType}`
    type: `${(Platform.OS === 'android') ?`image/jpeg` : `image/${fileType}`}`
  })

  const token = await AsyncStorage.getItem('token')

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  }

  return fetch(uploadUrl, options)
}

export const uploadPostVideo = async (file, onSuccess) => {
  const uriParts = file.uri.split('.')
  const slashParts = file.uri.split('/')
  const fileType = uriParts[uriParts.length - 1]
  const name = slashParts[slashParts.length - 1]
  if(!file.type){
    file.type="video";
  }
  const mimeType = `${file.type}/${fileType}`
  const getSignedUrl = `${SERVER_URL}/clients/${CLIENT_ID}/events/${eventStore.event.id}/posts/signed_url`
  const token = await AsyncStorage.getItem('token')
  try {
    const resp = await fetch(getSignedUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: encodeURI(name), content_type: mimeType })
    })
    const media = await resp.json()
    if (!media.signed_url) alert('Oops! Something went wrong. If this keeps happening, contact your event administrator.')

    const xhr = new XMLHttpRequest()
    xhr.open('PUT', media.signed_url, true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onSuccess({
            name,
            mime_type: mimeType,
            src: media.signed_url.split('?')[0],
            id: String(Math.random())
          })
        } else {
          alert('An error occured! If this problem continues, contact your administrator.')
        }
      }
    }
    xhr.setRequestHeader('Content-Type', mimeType)
    xhr.send(file)
  } catch (e) {
    console.log('uploadPostVideo error', e)
    alert('An error occured! If this problem continues, contact your administrator.')
  }
}
