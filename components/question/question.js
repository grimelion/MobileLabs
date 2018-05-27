import React from 'react'
import {Text, View, Button, Alert} from 'react-native';
import Checkbox from './checkbox';

export default class Question extends React.Component {
    constructor(props) {
        super(props);
        this.text = this.props.text;
        this.options = this.props.options;

        this.toggleCheckbox = this
            .toggleCheckbox
            .bind(this);
        this.onSubmit = this
            .onSubmit
            .bind(this);

        this.onSubmit = this.props.updateData;

        this.updateElement = this.props.updateElement;

        this.state = {
            checked: []
        }

        this.options = this
            .options
            .map((option, index) => {
                const obj = option;
                obj.toggleCheck = this.updateElement;
                obj.snackbarTrigger = this.props.snackbarTrigger;
                obj.key = index;
                return React.createElement(Checkbox, obj);
            });
    }

    onSubmit() {
        let data = this
            .state
            .checked
            .reduce((prev, cur) => prev + '\n' + cur, '');
        Alert.alert('Your answer is', data);
    }

    toggleCheckbox(checked, value) {
        if (checked) {
            this.setState((prevState, props) => {
                return {
                    checked: prevState
                        .checked
                        .concat(value)
                }
            });
        } else {
            this.setState((prevState, props) => {
                return {
                    checked: prevState
                        .checked
                        .filter(el => el != value)
                }
            });
        }
    }

    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <Text
                    style={{
                    color: 'white',
                    textAlign: 'center'
                }}>{this.text}</Text>
                {[this.options]}
                <Button width='50px' color="#3fffff" title='OK' onPress={this.onSubmit}></Button>
            </View>
        );
    }
}
