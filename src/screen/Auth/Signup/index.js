import {Image, ImageBackground, Linking, Modal, Platform, TouchableHighlight, Alert, SafeAreaView, ActivityIndicator, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView} from "react-native";
import React from "react";
import {createStackNavigator, StackNavigator, SwitchNavigator} from "react-navigation";
import {Actions} from "react-native-router-flux";
// import {RkButton} from "react-native-ui-kitten";
import {Immersive} from 'react-native-immersive';
import axios from "axios";
import Ent from 'react-native-vector-icons/Entypo';
import Mat from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import * as RootNavigation from '../../../navigation/RootNavigation.js';

export default class SignUp extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = {
            progressVisible: false,
            email: '',
            password: '',
            email_valid: false,
            pass_valid: false,
            eye: true,
            modalVisible: false
        }
    }

    componentDidMount() {
        StatusBar.setHidden(true);
        this.androidGoInImmersive();
    }

    onFacebookPressed = () => {
        this.props.navigation.navigate("UniversalTabView");
    };

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

    signup(){
        const {email, password} = this.state
        if(email == ""){
            this.setState({email_valid: true})
        }else if(password == ""){
            this.setState({pass_valid:true})
        }else{
            if(!this.validate(email)){
                Alert.alert("Error", "Email is not correct.");
                return;
            }
            const params = {email, password};
            let verifyMail = new FormData();
            verifyMail.append("email", email);
            axios.post('https://he11o.com/id/api/verifyMailer.php', verifyMail).then(res => {
                console.log('-----verification result-----', res.data);
                AsyncStorage.setItem('verifyCode', res.data.results.verification_code);
                this.setState({email: '', password: ''});
                RootNavigation.navigate('verify', params);
            });
        } 
    }

    toggleModal(visible) {
        this.setState({ modalVisible: visible });
    }

    privacy(){
        Linking.canOpenURL('https://he11o.com/index.php/terms-and-privacy/').then(supported => {
            if (supported) {
              Linking.openURL('https://he11o.com/index.php/terms-and-privacy/');
            } else {
              console.log("Don't know how to open URI: " + 'https://he11o.com/help');
            }
          });
    }
    render() {
        if (this.state.progressVisible) {
            return (
                <View style={[styles.containerLoader, styles.horizontal]}>
                    {/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
                    <ActivityIndicator size="large" color="grey"/>
                </View>
            );
        } else
            return (
                <ScrollView style={{flex:1, backgroundColor:'#F2F2F2'}}>
                    <SafeAreaView style={styles.MainContainer}>
                        <View>
                            <Image source={{uri: 'asset:/logo.png', cache: 'force-cache'}} 
                                style={{
                                    resizeMode:'contain',
                                    width:200,
                                    height:70,
                                    marginTop:'30%'
                                }}
                            />
                        </View>
                        <View style={{flexDirection:'row', marginTop:'55%', width:'80%', borderBottomColor: 'grey',borderBottomWidth: 0.5}}>
                            
                            <View style={{width:'75%'}}>
                                <TextInput
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value = {this.state.email}
                                    returnKeyLabel={"next"}
                                    placeholderTextColor="#a2a7a8"
                                    onChangeText={text => this.setState({email: text, email_valid:false})}
                                    style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                    placeholderStyle={{fontFamily: 'BuenosAires'}}
                                    autoCapitalize="none"
                                />
                            </View>
                            
                        </View>
                        {this.state.email_valid && (
                            <View style={{width:'80%'}}>
                                <Text style={{color:'red', fontFamily: 'BuenosAires'}}>Please input email</Text>
                            </View>

                        ) }
                        <View style={{flexDirection:'row', width:'80%',  borderBottomColor: 'grey',borderBottomWidth: 0.5}}>
                            
                            <View style={{width:'75%', paddingTop:20}}>
                                <TextInput
                                    secureTextEntry={this.state.eye}
                                    placeholder="Password"
                                    placeholderTextColor="#a2a7a8"
                                    returnKeyType="next"
                                    value = {this.state.password}
                                    onChangeText={value =>
                                        this.setState({password: value, pass_valid:false})
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
                            <View style={{width:'80%'}}>
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
                                    onPress={() => {
                                        this.signup()
                                    }}
                                >
                                    <Text style={[styles.buttontext, {fontFamily: 'BuenosAires'}]}>{"CREATE ACCOUNT"}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    rkType="rounded"
                                    style={styles.googleButton}
                                    onPress={() => {
                                        // Actions.login()
                                        this.props.navigation.navigate('login')
                                    }}
                                >
                                    <Text style={{color:'#979797', fontWeight:'700', alignSelf:'center', fontFamily: 'BuenosAires'}}>{"SIGN IN"}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{fontSize:12, color:'#808080', alignSelf:'center', fontFamily: 'BuenosAires'}}>By signing up you agree to our</Text>
                                <TouchableOpacity onPress = {() => this.privacy()}>
                                    <Text style={[styles.privacy, {fontFamily: 'BuenosAires'}]}>Terms & Privacy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Modal animationType = {"slide"} transparent = {false}
                            visible = {this.state.modalVisible}
                            onRequestClose = {() => { console.log("Modal has been closed.") } }>
                            
                            <View style = {styles.modal}>
                                <View>
                                    <TouchableOpacity onPress={() => this.setState({modalVisible:false})} style={{position:'absolute', top:10, right:10}}>
                                        <Mat name="close" color={"#A2A6A8"} size={20}/>
                                    </TouchableOpacity>
                                    
                                </View>
                                <View style={{marginTop:40, alignItems:'center'}}>
                                    <Text style={{fontSize:20, fontFamily: 'BuenosAires'}}>Privacy Policy</Text>
                                </View>
                                <View style={{marginTop:50,}}>
                                    <TouchableOpacity onPress = {() => {
                                        this.toggleModal(!this.state.modalVisible)}}
                                        style = {{position:'absolute', top:10, right:30}}
                                    >
                                        
                                        <Text style = {[styles.text, {fontFamily: 'BuenosAires'}]}>Close Modal</Text>
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                        </Modal>
                    </SafeAreaView>
                </ScrollView>
            );
                                
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
    privacy: {
        marginTop:5, 
        fontSize:12, 
        color:'#35197c', 
        alignSelf:'center', 
        borderBottomColor:'#808080', 
        borderBottomWidth:0.5
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
    modal: {
        flex: 1,
        // alignItems: 'center',
        backgroundColor: 'white',
        // padding: 100
    },
    googleButton: {
        backgroundColor: "#F2F2F2",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: '80%',
        height: 40,
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
        alignSelf:'center'
    }
});
