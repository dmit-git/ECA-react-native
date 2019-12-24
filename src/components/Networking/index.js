import React, { Component } from 'react';
import { StyleProvider } from 'native-base';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { Mutation } from 'react-apollo';
import { CONNECTIONS } from '../../queries/connections';
import getTheme from '../../native-base-theme/components'
import { inject, observer } from 'mobx-react';
import Networking from './Networking';
import alert from '../../alert';
let Constants = require('../../../app.json');
const { CLIENT_ID } = Constants.expo.extra;

export const CONNECT_USERS = gql`
  mutation connectUsers($client_id: Uint!, $event_id: Uint!, $attendee_ids: [Uint]) {
    connectUsers(client_id: $client_id, event_id: $event_id, attendee_ids: $attendee_ids) {
      id
      attendees {
        nodes {
          id
          email
          first_name
          last_name
          avatar_url
        }
      }
      event_id
      created_at
    }
  }
`

@inject('eventStore', 'authStore')
@observer
class NetworkingContainer extends Component {
  state = {
    lastConnection: {},
  }

  onConnectUsers = (connectUsers) => (attendee2ID) => {
    const { authStore, eventStore } = this.props;
    const clientID = CLIENT_ID;
    const eventID = eventStore.event.id;
    const attendeeID = authStore.profile.id;
    console.log("clientID eventID attendeeID attendee2ID");
    console.log(clientID, eventID, attendeeID, attendee2ID);
    connectUsers({
      variables: {
        client_id: clientID,
        event_id: eventID,
        attendee_ids: [attendeeID, attendee2ID],
      }
    })
  }

  getOtherUserFromConnection = connection => {
    const { authStore } = this.props;
    const attendeeID = authStore.profile.id;
    const bothAttendees = get(connection, ['attendees', 'nodes']) || [];
    return bothAttendees.find(attendee => attendee.id !== attendeeID);
  }

  onUpdate = (cache, { data: { connectUsers } }) => {
    const connection = connectUsers;
    console.log("Networking onUpdate");
    console.log(connection);
    const otherUser = this.getOtherUserFromConnection(connection);
    this.setState({ lastConnection: otherUser });
  }

  onShowConnections = () => {
    const { onShowConnections } = this.props;
    if(onShowConnections){
      onShowConnections();
    }
  }

  render () {
    const { authStore, eventStore } = this.props;
    const { lastConnection } = this.state;
    const clientID = CLIENT_ID;
    const eventID = eventStore.event.id;
    const attendeeID = authStore.profile.id; 
    return (
      <Mutation mutation={CONNECT_USERS} update={this.onUpdate} refetchQueries={[
        { query: CONNECTIONS,
          variables: {
            client_id: clientID,
            event_id: eventID,
            attendee_id: attendeeID,
          }
        }
      ]}>
        {(connectUsers) => (
          <StyleProvider style={getTheme(eventStore.theme)}>
            <Networking
              {...this.props}
              onConnect={this.onConnectUsers(connectUsers)}
              onShowConnections={this.onShowConnections}
              lastConnection={lastConnection}
            />
          </StyleProvider>
        )}
      </Mutation>
    )
  }
}

export default NetworkingContainer
