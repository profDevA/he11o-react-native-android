import {Image, Platform, Alert, SafeAreaView, ActivityIndicator, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView} from "react-native";
import React from "react";
import {Actions} from "react-native-router-flux";
import {Immersive} from 'react-native-immersive';
import * as RootNavigation from './../../../navigation/RootNavigation.js';
import axios from "axios";
import {func, object} from "prop-types";
import {login, select_style, getUserData} from "../../../reducer/users";
import {connect} from "react-redux";
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


class VerifyConfirm extends React.Component {
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

    goProfile(){
        let { email, pass } = this.props.route.params;
        // this.props.getUserData(email, pass);
        this.props.navigation.navigate('card', {email, pass});
    }

    render() {
        if (this.state.progressVisible) {
            return (
                <View style={[styles.containerLoader, styles.horizontal]}>
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
                                Great!
                            </Text>
                            <Text
                                style={{color: '#A2A6A8', textAlign:'center', fontFamily: 'BuenosAires'}}
                                numberOfLines={1}
                            >
                                You confirmed your email
                            </Text>
                            <Text
                                style={{color: '#A2A6A8', textAlign:'center', fontFamily: 'BuenosAires'}}
                                numberOfLines={1}
                            >
                                and your account is ready.
                            </Text>
                        </View>

                        <View
                            style={styles.signUpView}
                        >
                            <View>
                                <TouchableOpacity
                                    rkType="rounded"
                                    style={styles.signButton}
                                    onPress={() => {
                                        this.goProfile()
                                    }}
                                >
                                    <Text style={[styles.buttontext, {fontFamily: 'BuenosAires'}]}>{"Set Up Your Profile"}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </SafeAreaView>
                </ScrollView>
            );
    }
}

VerifyConfirm.propTypes = {
    getUserData: func,
    users: object,
};

const mapDispatchToProps = dispatch => ({
    getUserData: (email, password) => dispatch(getUserData(email, password)),
});

const mapStateToProps = (state) => ({
    users: state.users.users,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(VerifyConfirm);
