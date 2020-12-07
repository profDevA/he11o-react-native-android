import {Image, Platform, Alert, SafeAreaView, ActivityIndicator, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView} from "react-native";
import React from "react";
import { connect } from "react-redux";
import { func } from "prop-types";
import { logout } from "../../../reducer/users";
import { Immersive } from 'react-native-immersive';
import * as RootNavigation from './../../../navigation/RootNavigation.js';
import axios from "axios";

class Reset extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            header: null,
            headerLeft: null,
            headerRight: null
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            progressVisible: false,
            email: '',
            email_valid: false,
           
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

    reset(){
        const { email } = this.state
        if(email == ""){
            this.setState({email_valid: true})
        }else{
            if(!this.validate(email)){
                Alert.alert("Error", "Email is not correct.");
                return;
            }

            const mail = new FormData();
            mail.append("email", email);
            mail.append("subject", "Forgot Password");
            mail.append("msg", "Your password is set admin.");

            // mail.append("email", 'kelvinmore955@gmail.com');
            this.setState({progressVisible:true})
            axios.post('https://he11o.com/id/api/forgot.php', mail)
            .then(response => {
                this.setState({progressVisible:false})
                console.log(response)
                if (response.data.status == 200) {
                    // RootNavigation.navigate('profile');
                    Alert.alert("Password Reset Sent", response.data.message);
                    this.props.logout();
                    RootNavigation.navigate('login');
                    return;
                } else {
                    Alert.alert("Error", response.data.message);
                    return;
                }
            }).catch(err => {
                console.log(err);
                this.setState({progressVisible:false});
                Alert.alert("Error", "Message is not send. Your email is not exist.");
            });           
        }
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
                        <View>
                            <Text style={{fontSize:20, alignSelf:'center', marginTop:'15%', fontFamily: 'BuenosAires'}}>Forgot your password?</Text>
                        </View>
                        <View style={{flexDirection:'row', marginTop:'45%', width:'80%', borderBottomColor: 'grey',borderBottomWidth: 0.5}}>
                            
                            <View style={{width:'75%'}}>
                                <TextInput
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    placeholderStyle={{fontFamily: 'BuenosAires'}}
                                    returnKeyLabel={"next"}
                                    placeholderTextColor="#a2a7a8"
                                    onChangeText={text => this.setState({email: text, email_valid:false})}
                                    style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                    autoCapitalize="none"
                                />
                            </View>
                            
                        </View>
                        {this.state.email_valid && (
                            <View style={{width:'80%'}}>
                                <Text style={{color:'red', fontFamily: 'BuenosAires'}}>Please input email</Text>
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
                                        this.reset()
                                    }}
                                >
                                    <Text style={[styles.buttontext, {fontFamily: 'BuenosAires'}]}>{"RESET PASSWORD"}</Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        
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
    containerLoader: {
        flex: 1,
        justifyContent: "center"
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

Reset.propTypes = {
    logout: func,
};

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(Reset);