import React, { Fragment } from 'react'
import get from 'lodash/get'
import { View, ImageBackground, Dimensions } from 'react-native'
import intersection from 'lodash/intersection'
import { uriManifest, uriSources } from '../../assetCache'
import LinearGradient from 'react-native-linear-gradient';

import renderItem from './renderItem'

function groupCanSee (layoutGroups, userGroups) {
  if (!layoutGroups || !userGroups) return true
  else if (layoutGroups.length === 0) return true
  else if (intersection(layoutGroups, userGroups).length > 0) return true
  else return false
}

const renderRows = (rows, groupIDs) => (
  <View style={{
    minHeight: Dimensions.get('window').height > Dimensions.get('window').width ? Dimensions.get('window').height : Dimensions.get('window').width,
    display: 'flex',
    flexDirection: 'column',
  }}>
    {
      rows ? rows.map((row, i) => {
        if (!groupCanSee(row.groups, groupIDs)) return <Fragment key={`row:${i}`} />
        return (
          <View style={{ minHeight: 48, ...row.props.style, display: 'flex', flexDirection: 'row' }} key={`row:${i}`}>
            { row.children.length > 0 ? row.children.map((item, i) => {
              if (!groupCanSee(item.groups, groupIDs)) return <Fragment key={`item:${i}`} />
              const style = {}
              if (item.props.style.width) style.width = item.props.style.width
              return (
                <View style={{...style, flex: 1}} key={`item:${i}`}>
                  {renderItem(item, i)}
                </View>
              )
            }) : <Fragment />}
          </View>
        )
      }) : <Fragment />
    }
  </View>
)

export default ({ layout, groupIDs }) => {
  const uri = get(layout, 'background.source.uri')
  const color = get(layout, 'background.color')
  if (uri) {
    const source = uriManifest[uri] ? uriSources[uri] : {...layout.background.source, cache: 'force-cache'}
    return (
      <Fragment>
        <LinearGradient colors={[color]} locations={[0]} style={{flex: 1}}>
          <ImageBackground resizeMode='cover' source={source} style={{width: '100%', height: '100%'}}>
            { renderRows(layout.rows, groupIDs) }
          </ImageBackground>
        </LinearGradient>
      </Fragment>
    )
  } else{
    return (
      <Fragment>
        <LinearGradient colors={[color]} locations={[0]} style={{flex: 1}}>
          {renderRows(layout.rows, groupIDs)}
        </LinearGradient>
      </Fragment>
    )
  }
  // return renderRows(layout.rows, groupIDs)
}
