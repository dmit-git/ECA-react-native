import React, { Component } from 'react'
import last from 'lodash/last'
import { FlatList, Dimensions } from 'react-native'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { _getNotificationUnRead, Store } from '../../stores/NotificationStore';
import NotificationItem from './NotificationItem';


@inject('authStore', 'eventStore')
@observer

class NotificationsList extends Component {

    constructor(props) {
        super(props);
        TimeAgo.addLocale(en);
        this.timeAgo = new TimeAgo('en-US')

        this.state = {
            refreshing: this.props.loading,
            notifications: this.props.notifications,
            page: -1,
            refreshingPull: false,
            expandedIndex: -1,

        }
    }

    handleExpand = (index) => {        
        this.setState({
            expandedIndex: (this.state.expandedIndex !== index) ? index : -1,
        })
    }

    onLayoutParent = (event) => {
        this.state.parent = event.nativeEvent.layout.width
        if (this.state.child && this.state.parent) {
          this.state.child >= this.state.parent ?  this.showMoreButton() : null
        }
      }

    onLayoutChild = (event) => {
        this.state.child = event.nativeEvent.layout.width
        if (this.state.child && this.state.parent) {
          this.state.child >= this.state.parent ?  this.showMoreButton() : null
        }
    }

    componentDidMount() {
        const { eventID } = this.props
        this.props.authStore.notificationSync(eventID)
        this.setState({
            refreshingPull: false,
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.notifications.length > 0 && nextProps.page > prevState.page) {
            const lastNotification = last(prevState.notifications)
            if (lastNotification && lastNotification.id === last(nextProps.notifications).id) return { refreshing: nextProps.loading }
            return {
                page: nextProps.page,
                refreshing: nextProps.loading,
                notifications: prevState.notifications.concat(nextProps.notifications)
            }
        }
        if (prevState.page > nextProps.page && nextProps.page === 0) {
            return {
                page: nextProps.page,
                refreshing: nextProps.loading,
                notifications: nextProps.notifications
            }
        }
        return { refreshing: nextProps.loading }
    }

    keyExtractor = (item, index) => `${item.id}-${index}`

    handleClickNotification = (link) => () => {
        if (!link.length) return
        if (link.indexOf('http') > -1) return Actions.push('webView', { uri: link })
        if (link.indexOf('/') < 0) return Actions.push(link)
        const [_, key, id] = link.split('/')
        Actions.push(key, { id })
    }


    renderItem = ({ item: { name, body, link, time }, index }) => {
        const { unreadNotifications, eventStore: {event: {theme}} } = this.props
        const storeUnReadNotification = parseInt(Store.UnReadNotificationFromStore);

        return (
            <NotificationItem 
                theme={theme} name={name} 
                time={time}  body={body} 
                index={index} link={link} 
                handleClickNotification={this.handleClickNotification} 
                storeUnReadNotification={storeUnReadNotification}
                handleExpand={this.handleExpand} expandedIndex={this.state.expandedIndex}
                isExpanded={ this.state.expandedIndex === index }
            />
                
        )
    }

    handleNextPage = () => {
        if (this.state.notifications.length < this.props.pageInfo.total_count) this.props.handleNextPage()
    }
    render() {
        const { notifications, refreshing } = this.state

        _getNotificationUnRead(() => {
            console.log("UnRead Notifications in Notification List.. : ", Store.UnReadNotificationFromStore);
        });

        return (

            <FlatList
                keyExtractor={this.keyExtractor}
                data={notifications}
                initialNumToRender={10}
                refreshing={refreshing}
                onEndReached={this.handleNextPage}
                extraData={this.state}
                renderItem={this.renderItem}
                style={{height: Dimensions.get('window').height,}}

            />

        )
    }
}


export default NotificationsList
