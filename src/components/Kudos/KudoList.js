import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Kudo from './Kudo';
import Badge from './Badge';

const { width, height } = Dimensions.get('window');
export default (props) => {
	const { kudos, badges, isMe, attendee } = props;
  const kudosTitle = isMe ? 'Your Kudos' : 'Give ' + attendee.first_name + ' Kudos';
  const badgesTitle = isMe ? 'Your Badges' : 'Badges';

  // deleting needless props
  const kudoProps = { ...props };
  delete kudoProps.kudos;
  delete kudoProps.badges;
  
  const  badgeProps = {...kudoProps}
  delete badgeProps.attendee;
  delete badgeProps.isMe;
  delete badgeProps.authStore;
  delete badgeProps.eventStore;

  const kudoList = kudos.map(k=> <Kudo key={k.id} item={k} {...kudoProps}/>)
  const badgesList = badges.map(b=> <Badge key={b.id} item={b} {...badgeProps}/>)

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>{kudosTitle}</Text>
			<View style={styles.itemsContainer}>
				{ kudoList }
			</View>

			<Text style={styles.headerText}>{badgesTitle}</Text>
			<View style={styles.itemsContainer}>
				{ badgesList }
			</View>
		</View>
	);
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		width: width,
		flexDirection: 'column',
		alignItems: 'center',
	},
	itemsContainer: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-evenly',
		width: width,
	},
	headerText: {
		fontSize: width / 18,
		textAlign: 'center',
		fontWeight: '600',
		marginTop: width / 20,
		marginBottom: width / 60,
	},
})
