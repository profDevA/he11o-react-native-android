import {
    Image,
    Platform,
    Alert,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import React from "react";
import {Actions} from "react-native-router-flux";
import {Immersive} from 'react-native-immersive';
import AsyncStorage from '@react-native-community/async-storage';
import * as RootNavigation from './../../../navigation/RootNavigation.js';
import axios from "axios";
import RNFetchBlob from 'rn-fetch-blob';

export default class Verify extends React.Component {
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
            verifyCode: '',
            verify_valid: false,
        }
    }

    componentDidMount() {
        StatusBar.setHidden(true);
        this.androidGoInImmersive();
    }

    androidGoInImmersive() {
        if (Platform.OS == 'android') {
            Immersive.setImmersive(true);
        }
    }

    verifyNumber = async () =>{
        const { verifyCode } = this.state;
        const { email, password } = this.props.route.params;

        let savedCode = await AsyncStorage.getItem('verifyCode');

        if (savedCode === verifyCode) {
            this.props.navigation.navigate('verifyConfirm', {email: email, pass:password});
        } else {
            Alert.alert("Error!", "Verification code doesn't match!");
        }
    };

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
                        <View style={{marginTop:'15%', width: '80%'}}>
                            <Text
                                style={{fontSize:20, textAlign:'center', fontFamily: 'BuenosAires'}}
                                numberOfLines={1}
                            >
                                Verify your email.
                            </Text>
                            <Text
                                style={{color: '#A2A6A8', textAlign:'center', fontFamily: 'BuenosAires', marginTop: 15}}
                                numberOfLines={4}
                            >
                                We have sent a code to
                            </Text>
                            <Text
                                style={{color: '#A2A6A8', textAlign:'center', fontFamily: 'BuenosAires'}}
                                numberOfLines={4}
                            >
                                {this.props.route.params.email}.
                            </Text>
                            <Text
                                style={{color: '#A2A6A8', textAlign:'center', fontFamily: 'BuenosAires'}}
                                numberOfLines={4}
                            >
                                Please input below to proceed.
                            </Text>
                                
                        </View>
                        <View style={{flexDirection:'row', marginTop:'45%', width:'80%', borderBottomColor: 'grey',borderBottomWidth: 0.5}}>

                            <View style={{width:'100%'}}>
                                <TextInput
                                    name="verifyCode"
                                    type="number"
                                    keyboardType={'numeric'}
                                    placeholder="Verification Code"
                                    returnKeyLabel={"next"}
                                    placeholderTextColor="#a2a7a8"
                                    onChangeText={text => this.setState({verifyCode: text, verify_valid:false})}
                                    style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                    placeholderStyle={{fontFamily: 'BuenosAires'}}
                                />
                            </View>

                        </View>
                        {this.state.verify_valid && (
                            <View style={{width:'80%'}}>
                                <Text style={{color:'red', fontFamily: 'BuenosAires'}}>Please input verification Code</Text>
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
                                        this.verifyNumber()
                                    }}
                                >
                                    <Text style={[styles.buttontext, {fontFamily: 'BuenosAires'}]}>{"Verify"}</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <View>
                                <TouchableOpacity
                                    rkType="rounded"
                                    style={styles.googleButton}
                                    onPress={() => {
                                        RootNavigation.navigate('login');
                                    }}
                                >
                                    <Text style={{color:'#979797', fontWeight:'700', alignSelf:'center', fontFamily: 'BuenosAires'}}>{"SIGN IN"}</Text>
                                </TouchableOpacity>
                            </View> */}

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
        textAlign: 'center'
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
