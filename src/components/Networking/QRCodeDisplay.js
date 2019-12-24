import React from 'react';
// import { StyleSheet, View, Dimensions } from 'react-native';
import base64 from 'react-native-base64';
import QRCode from 'react-native-qrcode';

export default ({ attendee, size }) => {
  const { id } = attendee;
  if( !id ) return null
  const qrCodeString = base64.encode('' + id);
  return (
    <QRCode value={qrCodeString} size={size} />
  )
}
