import React, { PureComponent } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from 'native-base';

export default class Hashtag extends PureComponent {

	handlePress = e => {
		const { onPress, text } = this.props;
		if(onPress){
			onPress(text);
		}
	}

	render() {
		const { onPress, text } = this.props;

		const body = <Text style={{ marginLeft: 4, color: 'blue' }}>{text}</Text>;

		if( !onPress ){
			return body;
		}

		return (
			<Text onPress={this.handlePress}>
				{ body }
			</Text>
		)
	}
}
