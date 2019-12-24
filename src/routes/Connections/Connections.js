import React, { Component } from 'react';
import { Text } from 'native-base';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { Query } from 'react-apollo';
import { CONNECTIONS } from '../../queries/connections';
import ConnectionsList from './ConnectionsList';

class Connections extends Component {
  render () {
    const { clientID, eventID, attendeeID, onShowConnect } = this.props;
    console.log("Connections props");
    console.log(eventID);
    return (
      <Query
        query={CONNECTIONS}
        fetchPolicy='cache-and-network'
        variables={{ client_id: clientID, event_id: eventID, attendee_id: attendeeID }}
      >
        {({ loading, error, data, refetch }) => {
          console.log("DATA RETURNED from Connections:")
          // console.log(data);
          const connections = get(data, ['connections', 'nodes']) || [];
          // console.log(connections);
          // console.log(connections.map(c => c.event_id));
          const attendees = connections.map(connection => {
            const bothAttendees = get(connection, ['attendees', 'nodes']) || [];
            return bothAttendees.find(attendee => attendee.id !== attendeeID);
          }).filter(connection => connection);
          console.log(attendees);
          return (
            <ConnectionsList
              loading={loading}
              error={error}
              attendees={attendees}
              onShowConnect={onShowConnect}
            />
          ) 
          return <Text>Howdy, folks!</Text>;
        }}
      </Query>
    )
  }
}

export default Connections
