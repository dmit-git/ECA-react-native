import React, { Component, Fragment } from 'react'
import {
  View,
} from 'react-native'
import MeasuringStick from './MeasuringStick.js';

export default class MeasuringTable extends Component {
    constructor(props){
        super(props)
        this.state = {    
          measuringTableWidth: 0,    
          tableWasMeasured: false,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.measuringTableWidth !== this.state.measuringTableWidth) {
          this.setState({tableWasMeasured: true})
        }
      }
    
    measureTable = (event) => {    
        const measuringTableWidth = event.nativeEvent.layout.width;    
        this.setState({measuringTableWidth});
    }
    

    measureTextLength = () => {
        const { children, textIsOverflowing} = this.props;        
        return (
          <Fragment>
            {
              children.map( (textChild, index) => {
                let { textStyles, numberOfLines, children: content} = textChild.props;
                return (                  
                  <MeasuringStick 
                    key={index}
                    textIsOverflowing={textIsOverflowing} 
                    measuringTableWidth={this.state.measuringTableWidth} 
                    textProps={{ textStyles, numberOfLines, content }} 
                  />
                )
              })
            }
          </Fragment>
        )    
    }

    render() {
        renderChildTextElements = this.props.children;
        return (
            <Fragment>
                <View style={{...this.props.style}} onLayout={this.measureTable} >
                    { renderChildTextElements }
                </View>
                { this.state.tableWasMeasured ? this.measureTextLength() : null }
            </Fragment>            
        )
    }
    
}
