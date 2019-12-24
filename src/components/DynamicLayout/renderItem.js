import React, { Fragment } from 'react'
import debounce from 'lodash/debounce'
import isObject from 'lodash/isObject'
import { Actions } from 'react-native-router-flux'
import * as nativeBaseComponents from 'native-base'
import { StyleSheet, View,Dimensions, Linking } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import intersection from 'lodash/intersection'
import get from 'lodash/get'
import FlexImage from 'react-native-flex-image'
import analyticsStore from '../../stores/analyticsStore'
import eventStore from '../../stores/eventStore'
import buildUrl from 'build-url'
import TemplateHTML from '../TemplateHTML'
import SocialPlugin from '../Plugins'
import { uriManifest, uriSources } from '../../assetCache'

var { width } = Dimensions.get('window')

const parseStyles = styles => styles
  .split(';')
  .filter(style => style.split(':')[0] && style.split(':')[1])
  .map(style => [
    style.split(':')[0].trim().replace(/-./g, c => c.substr(1).toUpperCase()),
    style.split(':')[1].trim()
  ])
  .reduce((styleObj, style) => ({
    ...styleObj,
    [style[0]]: style[1]
  }), {})

const renderButtonBody = ({ icon, iconLeft, iconRight, children }) => {
  if (iconLeft) {
    return (
      <Fragment>
        <nativeBaseComponents.Icon name={iconLeft} />
        <nativeBaseComponents.Text>{children}</nativeBaseComponents.Text>
      </Fragment>
    )
  } else if (iconRight) {
    return (
      <Fragment>
        <nativeBaseComponents.Text>{children}</nativeBaseComponents.Text>
        <nativeBaseComponents.Icon name={iconRight} />
      </Fragment>
    )
  } else if (icon) {
    return (
      <nativeBaseComponents.Icon name={icon} />
    )
  } else {
    return (
      <nativeBaseComponents.Text>{children}</nativeBaseComponents.Text>
    )
  }
}

const handlePress = (_link) => debounce(async () => {
  let openInBrowser = false
  let link = _link
  if (isObject(link)) {
    // Assume is object
    link = link.link
    openInBrowser = _link.openInBrowser
  }
  if (!link || link.length === 0) return
  if (link.indexOf('http') > -1) {
    let uri = link
    try {
      const token = await AsyncStorage.getItem('token');
      let queryParams = {
        token
      };
      if( eventStore && eventStore.event && eventStore.event.id ){
        queryParams.event = eventStore.event.id;
      }
      uri = buildUrl(link, { queryParams: queryParams });
      console.log(uri);
    } catch (e) {
      console.log('handlePress error', e)
      alert('Something went wrong! If this problem persists, contact your administrator.')
    }
    if (openInBrowser) {
      Linking.canOpenURL(uri)
      .then(supported => {
        if(supported) {
           Linking.openURL(uri)
          // Actions.reset('event')
        }
        else {
          alert ("Please Try again after Sometime")
        }
      })
      .catch(err => {
        console.log("Url Open IN Browser Error..",err);
        alert("Error! Try Again.")
      })
    }
    else {
      return Actions.push('webViewStack', { uri })
    }
  }
  if (link.indexOf('/') < 0) return Actions.push(link) // Likely a top level route like 'agenda'
  const [_, key, id] = link.split('/')
  analyticsStore.sendEvent({ category: 'Event', action: 'press', label: link })
  Actions.push(key, { id })
}, 300)

export default (item, i) => {
  const uri = get(item, ['props', 'source', 'uri']);
  const query = get(item, ['props', 'query']);
  switch (item.component) {
    case 'Text':
      let stylesheet = StyleSheet.create({})
      try {
        stylesheet = StyleSheet.create({
          p: item.props.style
        })
      } catch (e) {
        console.log('stylesheet.create error', e)
      }
      return <View style={{ flex: 1 }}><TemplateHTML value={item.props.children} htmlProps={{ stylesheet }} /></View>
    case 'Image':
      if (uri && uriManifest[uri]) {
        return (
          <View style={item.props.style}>
            <FlexImage source={uriSources[uri]} />
          </View>
        )
      }
      return (
        <View style={item.props.style}>
          <FlexImage source={{...item.props.source, cache: 'force-cache'}} />
        </View>
      )
    case 'Plugin':
      return (
        <View>
          <SocialPlugin searchQuery={query} />
        </View>
      )
    case 'TouchableOpacity':
      if (uri && uriManifest[uri]) {
        return (
          <View style={item.props.style}>
            <FlexImage source={uriSources[uri]} onPress={handlePress(item.props.onPress)} />
          </View>
        )
      }
      return (
        <View style={item.props.style}>
          <FlexImage source={{...item.props.source, cache: 'force-cache'}} onPress={handlePress(item.props.onPress)} />
        </View>
      )
    case 'Button':
      return (
        <nativeBaseComponents.Button
          {...item.props}
          onPress={handlePress(item.props.onPress)}
          transparent={item.props.transparent}
          light={item.props.type === 'light'}
          primary={item.props.type === 'primary'}
          success={item.props.type === 'success'}
          info={item.props.type === 'info'}
          warning={item.props.type === 'warning'}
          danger={item.props.type === 'danger'}
          dark={item.props.type === 'dark'}
          rounded={item.props.type === 'rounded'}
          style={{...item.props.style, flex: 0}}
          bordered={item.props.bordered}
          iconLeft={!!item.props.iconLeft}
          iconRight={!!item.props.iconRight}
          key={`item:${i}`}
        >
          { renderButtonBody(item.props) }
        </nativeBaseComponents.Button>
      )
    default:
      let ItemComponent = get(nativeBaseComponents, item.component)
      if (!ItemComponent) return <Fragment />
      else return <ItemComponent {...item.props} key={`item:${i}`} />
  }
}
