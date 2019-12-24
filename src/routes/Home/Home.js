import React from 'react'
import { Actions } from 'react-native-router-flux'
import { Content, Container, Button, Icon } from 'native-base'
import Header from '../../components/Header'
import DynamicLayout from '../../components/DynamicLayout'

const Home = ({ event, groupIDs, handleRefresh }) => {
  const { homescreen_layout } = event
  return (
    <Container>
      <Header
        headerTitle={'Home'}
        renderLeft={(
          <Button transparent onPress={Actions.drawerOpen}>
            <Icon name='md-menu' />
          </Button>
        )}
        renderRight={(
          <Button transparent onPress={handleRefresh}>
            <Icon name='md-sync' />
          </Button>
        )}
      />
      <Content>
        <DynamicLayout layout={homescreen_layout} groupIDs={groupIDs} />
      </Content>
    </Container>
  )
}

export default Home
