'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TabBarIOS,
  ActivityIndicator
} from 'react-native';
import styles from '../styles/baseStyles.js';
import Login from './Login';
import Account from './Account';
import React, {Component} from 'react';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // used to display a progress indicator if waiting for a network response.
      loading: false,
      // entered credentials
      email: '',
      username: '',
      password: ''
    }
  }

  // A method to passs the username and password to firebase and make a new user account
  signup() {
    this.setState({
      // When waiting for the firebase server show the loading indicator.
      loading: true
    });

    this.state.email = this.state.username + '@thefloorislava.co.nz';

    // Make a call to firebase to create a new user.
    this.props.firebaseApp.auth().createUserWithEmailAndPassword(
      this.state.email,
      this.state.password).then(() => {
        // then and catch are methods that we call on the Promise returned from
        // createUserWithEmailAndPassword

        // now add additional user properties
        const uid = this.props.firebaseApp.auth().currentUser.uid;

        this.props.firebaseApp.database().ref('users/' + uid).set({
          is_lava: false,
          username: this.state.username,
          device_id: 'UNIQUE_DEVICE_TOKEN'
        }).then(() => {
          // at this point navigation should have transitioned
        }).catch((error) => {

          alert("Account creation failed: " + error.message );

        });

        this.setState({
          // Clear out the fields when the user logs in and hide the progress indicator.
          username: '',
          password: '',
          loading: false
        });

        this.props.navigator.push({
          component: Account
        });

        //alert('Your account was created!');


    }).catch((error) => {
      // Leave the fields filled when an error occurs and hide the progress indicator.
      this.setState({
        loading: false
      });
      alert("Account creation failed: " + error.message );
    });
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <View>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
          placeholder={"Username"} />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
          placeholder={"Password"} />
        <TouchableHighlight onPress={this.signup.bind(this)} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Signup</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.goToLogin.bind(this)} style={styles.transparentButton}>
          <Text style={styles.transparentButtonText}>Go to Login</Text>
        </TouchableHighlight>
      </View>;

    // A simple UI with a toolbar, and content below it.
  	return (
  		<View style={styles.container}>
  			<TabBarIOS
          style={styles.toolbar}
          title="Signup" />
        <View style={styles.body}>
          {content}
        </View>
      </View>
		)
  }
  // Go to the login page
  goToLogin(){
    this.props.navigator.push({
      component: Login
    });
  }
}

AppRegistry.registerComponent('Signup', () => Signup);
