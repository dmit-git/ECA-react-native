import { Alert } from 'react-native'

export default (e, title = 'Oops!') => {
  const defaultMessage = 'An unknown error occured.';
  let msg
  let toShowError = true
  if (typeof e === 'string') {
    msg = e
  }
  else if (Array.isArray(e)) {
    try {
      e = JSON.parse(e[0].message)
      toShowError = e.toShowError
      msg = e.message || defaultMessage
    }
    catch (err) {
      msg = e[0].message || defaultMessage
    }

  }
  else if (typeof e === 'object') {
    try {
      e = JSON.parse(e.message)
      toShowError = e.toShowError
    }
    catch (err) {
    }
    msg = e.message || defaultMessage
  }
  console.log("ALERT:");
  console.log(e);

  if (toShowError ) {
    Alert.alert(
      title,
      msg
    )
  }
}
