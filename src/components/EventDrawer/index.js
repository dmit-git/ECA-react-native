import React, {Component} from 'react'
import find from 'lodash/find'
import {inject, observer} from 'mobx-react'
import {StyleProvider} from 'native-base'
import EventDrawer from './EventDrawer'

import getTheme from '../../native-base-theme/components';
import {_setNotificationUnRead} from '../../stores/NotificationStore';
import analyticsStore from '../../stores/analyticsStore'
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../Loading';

const LOGOUT = gql`
  mutation logout($pushToken: String!) {
    logout(pushToken: $pushToken ) {
     id
    }
  }
`;

@inject('eventStore', 'authStore')
@observer
class EventDrawerContainer extends Component {
    state = {
        pushToken:"dZAuisO9ohI:APA91bF26tvqzKu94G7zmNptVZGTNrudyHRDxVhnu5T6jnD8h5PzkYuQhVKYw9ZovoDdOJ_UzteCYXX2tlPJZcMJjXmHk84l93tZkkCUEguiOrizaDCAoEzXNd8UZs6ZZR0gvCoNr3Lp",
        loading: false // loading is used for logout to prevent `event.theme` issue.
    }

    getToken = async () => {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        return fcmToken;
    }

    handleLogout = async (logout)  => {
       this.setState({ loading: true }) 
       analyticsStore.sendScreenView('Logout');
       let Token = await this.getToken();
       if(!Token) { Token="" }
       var variables={pushToken:Token};
        logout({variables}).then(()=>{
            this.props.authStore.logout();
        });
    };

    render() {
        const { eventStore, authStore } = this.props
        const event_id = eventStore.event.id
        const side_navigation = eventStore.event.side_navigation
        const eventSync = find(authStore.profile.syncs, {event_id}) || {}
        let unreadNotifications = eventSync.unread_notifications || 0
        _setNotificationUnRead(unreadNotifications.toString());

        return (
            <Mutation mutation={LOGOUT} >
                {(logout) => {
                    if(!this.state.loading){
                        return (
                            <StyleProvider style={getTheme(eventStore.theme)}>
                                <EventDrawer
                                    iconColor={eventStore.theme.brandPrimary}
                                    offline={eventStore.offline}
                                    sideNavigation={side_navigation}
                                    handleLogout={() => this.handleLogout(logout)}
                                    myID={authStore.profile.id}
                                    // unreadNotifications={unreadNotifications}
                                />
                            </StyleProvider>
                        )
                    }else{ return <Loading /> }
                }}
            </Mutation>
        )
    }
}

export default EventDrawerContainer;
