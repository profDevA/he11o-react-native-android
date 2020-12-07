import {Image, Platform, Alert, SafeAreaView, ActivityIndicator, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView} from "react-native";
import React from "react";
import { Actions } from "react-native-router-flux";
import { func, string, bool, object } from "prop-types";
import { connect } from "react-redux";
import {Immersive} from 'react-native-immersive';
import { login } from "./../../../reducer/users";
import Ent from 'react-native-vector-icons/Entypo';
import * as RootNavigation from './../../../navigation/RootNavigation.js';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            progressVisible: false,
            email: '',
            password: '',
            email_valid: false,
            pass_valid: false,
            eye: true
        }
    }

    componentDidMount() {
        StatusBar.setHidden(true);
        this.androidGoInImmersive();
        const { users } = this.props;
        console.log('-----rehydrate-----', users);
        if(users != null){
            console.log("IN CONDITION");
            this.props.navigation.navigate('bottomtab', { screen: 'home' });
        }
    }

    androidGoInImmersive() {
        if (Platform.OS == 'android') {
            Immersive.setImmersive(true);
        }
    }

    validate = (text) => {

        let reg = /^[a-z0-9].*[a-z0-9]@[a-z0-9]+\.[a-z]{2,3}(?:\.[a-z]{2,3})?$/;
        if (reg.test(text) === false) {
          console.log("Email is Not Correct");
          return false;
        }
        else {
          console.log("Email is Correct");
          return true;
        }
    }

    _onSubmit() {
        const {email, password} = this.state;
        const {
            login
        } = this.props;

        if(email == ""){
            this.setState({email_valid: true})
        }else if(password == ""){
            this.setState({pass_valid:true})
        }else{
            if(!this.validate(email)){
                Alert.alert("Error", "Email is not correct.");
                return;
            }
            login(email, password)

            this.setState({email:'', password:''})
        }

    }

    render() {
        const { progressVisible, users } = this.props;
        const { email, password } = this.state;

        if(!users) {
            if (progressVisible) {
                return (
                    <View style={[styles.containerLoader, styles.horizontal]}>
                        {/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
                        <ActivityIndicator size="large" color="grey"/>
                    </View>
                );
            } else {
                return (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : null}
                        style={{ flex: 1 }}
                    >
                        <SafeAreaView style={{flex:1, backgroundColor:'#F2F2F2'}}>
                            <ScrollView>
                                <View>
                                    <Image source={{uri: 'asset:/logo.png', cache: 'force-cache'}}
                                        style={{
                                            resizeMode:'contain',
                                            width:200,
                                            height:70,
                                            alignSelf:'center',
                                            marginTop:'30%'
                                        }}
                                    />
                                </View>
                                <View style={styles.email}>

                                    <View style={{width:'75%'}}>
                                        <TextInput
                                            keyboardType = "email-address"
                                            placeholder="Email"
                                            placeholderTextColor="#a2a7a8"
                                            onChangeText={text => this.setState({email: text, email_valid: false})}
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                            autoCapitalize="none"
                                        />

                                    </View>

                                </View>
                                {this.state.email_valid && (
                                    <View style={{width:'80%', alignSelf:'center'}}>
                                        <Text style={{color:'red', fontFamily: 'BuenosAires'}}>Please input email</Text>
                                    </View>

                                ) }
                                <View style={styles.pass}>

                                    <View style={{width:'75%', paddingTop:20}}>
                                        <TextInput
                                            secureTextEntry={this.state.eye}
                                            placeholder="Password"
                                            placeholderTextColor="#a2a7a8"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({password: value, pass_valid: false})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />

                                    </View>
                                    {!this.state.eye && (
                                        <TouchableOpacity onPress={() => this.setState({eye:true})} style={{position:'absolute', right:10, top:40}}>
                                            <Ent name="eye" color={"#A2A6A8"} size={20}/>
                                        </TouchableOpacity>
                                    )}
                                    {this.state.eye && (
                                        <TouchableOpacity onPress={() => this.setState({eye:false})} style={{position:'absolute', right:10, top:40}}>
                                            <Ent name="eye-with-line" color={"#A2A6A8"} size={20}/>

                                        </TouchableOpacity>
                                    )}
                                </View>
                                {this.state.pass_valid && (
                                    <View style={{width:'80%', alignSelf:'center'}}>
                                        <Text style={{color:'red', fontFamily: 'BuenosAires'}}>Please input password</Text>
                                    </View>
                                ) }
                                <View
                                    style={styles.signUpView}
                                >
                                    <View>
                                        <TouchableOpacity
                                            rkType="rounded"
                                            style={styles.signButton}
                                            onPress={() =>
                                                this._onSubmit()

                                            }
                                        >
                                            <Text style={[styles.buttontext, {fontFamily: 'BuenosAires'}]}>{"SIGN IN"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            rkType="rounded"
                                            style={styles.signup}
                                            onPress={() => {
                                                this.props.navigation.navigate('signup');

                                            }}
                                        >
                                            <Text style={{fontFamily:'LineAwesome', color:'#979797', fontWeight:'700', alignSelf:'center', fontFamily: 'BuenosAires'}}>{"CREATE ACCOUNT"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{alignItems:'center'}}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('forgot')} style={{flexDirection:"row", height:50, justifyContent:'center'}}>
                                            <Text style={[styles.forgot, {fontFamily: 'BuenosAires'}]}>Forgot your </Text>
                                            <Text style={{fontSize:12, color:'#35197c', fontFamily: 'BuenosAires'}}>Password?</Text>

                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </ScrollView>
                        </SafeAreaView>
                    </KeyboardAvoidingView>
                );
            }
        } else {
            return (
                <></>
            );
        }
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        alignItems:'center'
    },
    signUpView: {
        marginTop:20,
        width: '100%',
        justifyContent: "center",
    },
    container: {
        width: "100%",
        height: "100%",
        padding: "10%",
        flexDirection: "column",
        justifyContent: "center",

        backgroundColor: "#FFFFFF"
    },
    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },
    textInput: {
        height:Platform.OS === "ios" ? 45 : null,
        width: "100%",
        color: "#282728",

    },
    email: {
        flexDirection:'row',
        marginTop:'55%',
        width:'80%',
        alignSelf:'center',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5
    },
    pass: {
        width:'80%',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        alignSelf:'center'
    },
    signButton: {
        backgroundColor: "#5bccd8",
        borderRadius: 20,
        flexDirection: "row",

        justifyContent: "center",
        width: '60%',
        height: 40,
        marginBottom: 15,
        alignSelf: "center",
        textAlign: "center"
    },
    forgot: {
        fontSize:12,
        color:'#808080',
        // fontFamily:'lineawesome'
    },
    signup: {
        backgroundColor: "#F2F2F2",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: '80%',
        height: 40,
        marginBottom: 30,
        alignSelf: "center"
    },
    migoLogoImage: {
        resizeMode: "contain",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        width: "40%",
        height: "20%",
        marginTop: "35%",
        alignSelf: "center"
    },
    buttontext:{
        color:'white',
        alignSelf:'center',
        fontFamily:'LineAwesome',
    }
});

Login.propTypes = {
    login: func,
    users: object,
    progressVisible: bool
  };

  const mapDispatchToProps = dispatch => ({
    login: (email, password) => dispatch(login(email, password)),
  });

  const mapStateToProps = ({ users }) => ({
    users: users.users,
    progressVisible: users.progressVisible
  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Login);
