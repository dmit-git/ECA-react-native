import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'

export default class ArrowButton extends Component {
    
    render() {
        const { onPress, isExpanded, brandPrimary} = this.props;
        return (

            <TouchableOpacity style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 40, height: 40}} 
                onPress={onPress}
            >
                {                                
                    (isExpanded) ?
                        <Icon name='arrow-dropup' style={{ color: brandPrimary }} />
                        :
                        <Icon name='arrow-dropdown' style={{ color: brandPrimary }} />
                }
            </TouchableOpacity>

        )
    }
}
