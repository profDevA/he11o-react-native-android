import React from "react";
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Platform,
  Linking
} from "react-native";
import { Actions } from "react-native-router-flux";
import MI from 'react-native-vector-icons/MaterialIcons';
import { func, string, bool, object } from "prop-types";
import { connect } from "react-redux";
import { logout } from "./../../reducer/users";
import * as RootNavigation from './../../navigation/RootNavigation.js';

class Setting extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        progressVisible: false,
        imageUrl:
            "http://www.cybecys.com/wp-content/uploads/2017/07/no-profile.png",
        headline: '',
        desc: '',
        youtube: '',

      }
    }

    save(){
        RootNavigation.navigate('kind');

    }

    open(){
        Linking.canOpenURL('https://he11o.com/help').then(supported => {
            if (supported) {
              Linking.openURL('https://he11o.com/help');
            } else {
              console.log("Don't know how to open URI: " + 'https://he11o.com/help');
            }
          });
    }
    render() {
        let { logout, users } = this.props
        if(!users) {users = {}}
        if (this.state.progressVisible) {
            return (
                <View style={[styles.containerLoader, styles.horizontal]}>
                    {/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
                    <ActivityIndicator size="large" color="grey"/>
                </View>
            );
        } else
            return (
                <SafeAreaView style={{backgroundColor:'white'}}>
                    <View style={{height:'100%', backgroundColor:'#F7F8F9'}}>
                        <View style={{height:50, alignItems:'center', justifyContent:'center', backgroundColor:'white'}}>
                            <Text style={{fontFamily: 'BuenosAires'}}>Settings</Text>
                        </View>
                        <View style={{height:100, borderTopColor:'#BCBCBC', justifyContent:'center'}}>
                            <View style={{flexDirection:'row', paddingLeft:10}}>
                                <View style={{width:50, height:50, borderRadius:5}}>
                                    <Image source={{uri: users.user_url==''?this.state.imageUrl:'https://he11o.com/id/api/'+users.user_url}}
                                        style={{width:50, height:50, borderRadius:5}}
                                    />
                                </View>
                                <Text style={{paddingLeft:10, paddingVertical:15, justifyContent:'center', fontFamily: 'BuenosAires'}}>{users.user_email}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => RootNavigation.navigate('subscription')} style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Subscription</Text>
                                <MI name="keyboard-arrow-right" size={25} color="grey" />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.row, {marginTop: 20}]}>
                            <TouchableOpacity onPress={() =>  RootNavigation.navigate('sharemsg')} style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Edit Sharing Message Description</Text>
                                <MI name="keyboard-arrow-right" size={25} color="grey" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => RootNavigation.navigate('updatecard', {email: users.user_email, password:users.user_pass})} style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Edit Your Card</Text>
                                <MI name="keyboard-arrow-right" size={25} color="grey" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => RootNavigation.navigate('updateprofile')} style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Edit Your Profile</Text>
                                <MI name="keyboard-arrow-right" size={25} color="grey" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => RootNavigation.navigate('updatekind')} style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Card Style</Text>
                                <MI name="keyboard-arrow-right" size={25} color="grey" />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.row, {marginTop: 20}]}>
                            <TouchableOpacity onPress={() => RootNavigation.navigate('reset')} style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Reset Password</Text>
                                <MI name="keyboard-arrow-right" size={25} color="grey" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => this.open()} style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Help & Support</Text>
                                <MI name="keyboard-arrow-right" size={25} color="grey" />
                            </TouchableOpacity>
                        </View>

                        <View style={{height:50, width:'90%', alignSelf:'center', position: 'absolute', bottom:0}}>


                            <TouchableOpacity
                                onPress={()=> {
                                    logout();
                                    RootNavigation.navigate('login')
                                }}

                                style={styles.sign_out}
                            >
                                <Text style={{color:'#D72233', fontWeight:'700', fontFamily: 'BuenosAires'}}>SIGN OUT</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </SafeAreaView>
            );
    }
}

const styles = StyleSheet.create({

    label: {
        paddingLeft:5,
        color:'#878787'
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
    row: {
        padding:10,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'white',
        borderBottomColor:'#BCBCBC',
        borderBottomWidth:0.5
    },
    sign_out: {
        marginTop:20,
        alignItems:'center',
        justifyContent:'center',
    }
});

Setting.propTypes = {
    logout: func,
    users: object,
    progressVisible: bool
  };

  const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
  });

  const mapStateToProps = ({ users }) => ({
    users: users.users,
    progressVisible: users.progressVisible
  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Setting);
