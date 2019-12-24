import React, { Component, Fragment } from 'react'
import { Text } from 'native-base'

export default class MeasuringStick extends Component {
    
    state = {
        textWidth: 0,
    }

    isTextLargerThanContainer = () => {        
        const textWidth = this.state.textWidth;
        const { measuringTableWidth, textProps, textIsOverflowing } = this.props
        const numberOfLines = textProps.numberOfLines;

        textWidth > measuringTableWidth * numberOfLines ? 
        textIsOverflowing() : null
    }

    getFullTextWidth = (event) => {
        this.state.textWidth = event.nativeEvent.layout.width;    
        this.props.measuringTableWidth ? 
        this.isTextLargerThanContainer() : null        
    }
        
    render() {
        const { textStyles, numberOfLines, content } = this.props.textProps;
        return (
            <Fragment>
                <Text numberOfLines={numberOfLines} 
                    style={{
                        ...textStyles, 
                        textAlign: "left", 
                        backgroundColor: 'rgba(255,0,0,.0)', 
                        position: 'absolute', 
                        height: 0, left: 0,
                    }} 
                    onLayout={(e) => this.getFullTextWidth(e)}
                >
                    {content}
                </Text>
            </Fragment>
        )
    }
}
