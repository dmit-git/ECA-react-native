import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import get from 'lodash/get';
import { Query } from 'react-apollo';
import { inject, observer } from 'mobx-react';

import { POSTS } from '../../queries/post';
import PostCard from '../PostCard';

@inject('eventStore', 'authStore')
@observer
export default class SocialPlugin extends Component {

	handlePress = () => {
		const { searchQuery } = this.props;
		Actions.push('feed', { searchData: searchQuery });
	}

	render () {
		console.log("SocialPlugin render");
		const { searchQuery, eventStore, authStore } = this.props;
		const profile = authStore.profile || {};
		const myID = profile.id;
		// const email = profile.email;
		return (
			<TouchableOpacity onPress={this.handlePress}>
				<Query
					query={POSTS}
					fetchPolicy='network-only'
					variables={{ event_id: eventStore.event.id, offset: 0, search_query: searchQuery }}
				>
					{({ loading, error, data, refetch }) => {
						const posts = get(data, ['posts', 'nodes']) || [];
						if(posts.length <= 0){
							return null;
						}
						const post = posts[0];
						// const isMine = email === post.attendee.email;
						return (
							<PostCard
								myID={myID}
								key='1'
								post={post}
								isMine={false}
								handleHashtagClick={null}
							/>
						)
					}}
				</Query>
			</TouchableOpacity>
		)
	}
}
