import React from 'react';
import {StyleSheet, View, ImageBackground, Button, Alert} from 'react-native';
import Expo, {SQLite, IntentLauncherAndroid} from 'expo';
import Question from './components/question/question';
import Header from './components/header/header';
import SnackBar from 'react-native-snackbar-component'

const db = SQLite.openDatabase('db.db');

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.updateElement = this
      .updateElement
      .bind(this);
    this.updateData = this
      .updateData
      .bind(this);
    this.getData = this
      .getData
      .bind(this);

    this.state = {
      snackbarVisible: false,
      answers: []
    };
  }

  snackbarTrigger = () => {
    this.setState({snackbarVisible: true});
    setInterval(() => {
      this.setState({snackbarVisible: false});
    }, 600);
  }

  updateElement(checked, value) {
    if (checked) {
      this.setState((prevState, props) => {
        return {
          answers: prevState
            .answers
            .concat(value)
        }
      });
    } else {
      this.setState((prevState, props) => {
        return {
          answers: prevState
            .answers
            .filter(el => el != value)
        }
      });
    }
  }

  updateData() {
    this.drop(() => {
      this.create(() => {
        this
          .state
          .answers
          .forEach(answer => {
            this.add(answer);
          });
        Alert.alert('Success', 'Your answer has been saved');
      })
    });

  }

  add(text) {
    db.transaction(tx => {
      tx.executeSql('insert into answers (value) values (?)', [text]);
    });
  }

  getData() {
    db.transaction(tx => {
      tx.executeSql('select * from answers', [], (_, {rows: _array}) => {
        let prevAnswer = _array
          ._array
          .map(el => el.value);
        if (prevAnswer.length > 0) 
          Alert.alert('Previous answer', prevAnswer.reduce((acum, cur) => acum += '\n' + cur, ''));
        else 
          Alert.alert('Snap', 'Database seem to be empty, try answering question before looking again');
        }
      );
    }, (e) => console.log('e', e));
  }

  componentWillMount() {
    this.drop(() => {
      this.create(() => {});
    });
  }

  drop(cb) {
    db.transaction(tx => {
      tx.executeSql('drop table if exists answers', null, cb);
    });
  }

  create(cb) {
    db.transaction(tx => {
      tx.executeSql('create table if not exists answers (id integer primary key not null, value text)' +
          ';',
      null, cb);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('./wood_1.png')} style={styles.container}>
          <View style={styles.header}>
            <Header></Header>
          </View>
          <Question
            text={question}
            snackbarTrigger={this.snackbarTrigger}
            updateElement={this.updateElement}
            updateData={this.updateData}
            options={options}></Question>
          <Button title='Previous answer' onPress={this.getData}></Button>            
        </ImageBackground>
        <SnackBar
          visible={this.state.snackbarVisible}
          textMessage="Your choice updated!"/>
      </View>
    );
  }
}

const question = 'Videos with which animals do you prefer?'

const options = [
  {
    label: 'Cats'
  }, {
    label: 'Dogs'
  }, {
    label: 'Dumb parrots'
  }, {
    label: 'All above'
  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: '100%'
  },
  header: {
    marginBottom: 50,
    marginTop: 50
  },
  backgroundImage: {
    resizeMode: 'stretch'
  }
});
