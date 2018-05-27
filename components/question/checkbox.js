import React from 'react'
import { CheckBox } from 'react-native-elements';

export default class Checkbox extends React.Component {
    constructor(props) {
        super(props)
        this.snackbarTrigger = this.props.snackbarTrigger;
        this.label = this.props.label;
        this.toggleCheck = this.props.toggleCheck;
        this.state = {
            checked: false
        }
        this.onPress = this.onPress.bind(this);
    }
    render() {
        return (
            <CheckBox title={this.label} checked={this.state.checked} onPress={this.onPress}></CheckBox>
        )
    }

    onPress() {
        this.props.snackbarTrigger();
        this.toggleCheck(!this.state.checked, this.label);
        this.setState((prevState, props) => {
            return {checked: !prevState.checked}
        })
    }

}