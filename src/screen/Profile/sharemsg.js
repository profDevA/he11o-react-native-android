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
} from "react-native";
import { Actions } from "react-native-router-flux";
import { func, string, bool, object } from "prop-types";
import { connect } from "react-redux";
import Mat from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-generator';
import axios from "axios";
import * as RootNavigation from './../../navigation/RootNavigation.js';
import Share from 'react-native-share';
import { saveUser } from '../../reducer/users';

class ShareMsg extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        progressVisible: false,
        imageUrl:
            "http://www.cybecys.com/wp-content/uploads/2017/07/no-profile.png",
        name: '',
        surname: '',
        mobile: '',
        email: '',
        msg: '',
        name_valid:false,
        mobile_valid:false,
        email_valid: false,
        text: 'http://facebook.github.io/react-native/',
    
      }
    }

    componentDidMount() {
        const { users } = this.props
        console.log('-----user-----', users);
        const url = 'Hello, view/save my digital business card... \nhttps://he11o.com/id/card/?id='+users.id
        this.setState({
            name: users.display_name,
            surname: users.nicename,
            mobile: users.mobile,
            email: users.card_email,
            msg: users.share_message || url
        });
    }
   
    share(){
        const { msg } = this.state;
        const { users } = this.props;
        this.setState({progressVisible: true});
        let fd = new FormData();
        fd.append('share_message', msg);
        fd.append('id', users.id);
        axios.post('https://he11o.com/id/api/save_share_msg.php', fd)
        .then( (res) => {
            this.props.saveUser({...users, share_message: msg});
        }).catch( (err) => {
            console.log('-----save error-----', err);
        }).finally( () => {
            this.setState({progressVisible: false});
        });

        // var shareImage = {
        //     title: "Share Message",
        //     // uri: this.state.share_img
        //     url: this.state.msg
        // }
        // Share.open(shareImage).catch(err => alert(err));
    }

    render() {
        const { users } = this.props
        if (this.state.progressVisible) {
            return (
                <View style={[styles.containerLoader, styles.horizontal]}>
                    {/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
                    <ActivityIndicator size="large" color="grey"/>
                </View>
            );
        } else {
            return (
                <SafeAreaView style={{backgroundColor:'white'}}>
                    <View>
                        <View style={{height:50, alignItems:'center', justifyContent:'center'}}>
                            <Text style={{fontFamily: 'BuenosAires'}}>Share Message</Text>
                            <TouchableOpacity onPress={() => RootNavigation.navigate('setting')} style={{position:'absolute', top:15, right:15}}>
                                <Mat name="close" color={"#A2A6A8"} size={20}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor:'#F2F2F2', height:'100%'}}>
                            
                            <Text style={{padding:10, color:'#9D9D9D', backgroundColor:'#F2F2F2', fontSize:12, fontFamily: 'BuenosAires'}}>Your message</Text>
                            <View style={{backgroundColor:'white', marginLeft:10, marginRight:10, padding:15, paddingTop:Platform.OS=='ios'? 25:0}}>
                                
                                <TextInput
                                    name="message"
                                    placeholder="Please enter your message"
                                    placeholderTextColor="#ABABAB"
                                    returnKeyType="next"
                                    value = { this.state.msg }
                                    onChangeText={value =>
                                        this.setState({msg: value})
                                    }
                                    multiline = {true}
                                    style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                    placeholderStyle={{fontFamily: 'BuenosAires'}}
                                />
                            </View>
                            <View style={{height:90}}>
                                <TouchableOpacity onPress={()=> this.share()} style={styles.save_btn}>
                                    <Text style={{color:'white', fontFamily: 'BuenosAires'}}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </View>
                </SafeAreaView>
            );
        }
    }
}

const styles = StyleSheet.create({
    
    label: {
        paddingTop:5,
        // paddingLeft:5,
        color:'#9D9D9D',
        fontSize:12
    },
    
    textInput: {
        color:'black',
        fontSize:16,
        height:140,
        textAlignVertical:'top'
    },
    row: {
        backgroundColor:'white',
        marginLeft:10,
        marginRight:10,
        paddingTop: Platform.OS=='ios'? 25:5,
        paddingBottom:5,
        paddingLeft:20
    },
    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },
    save_btn: {
        width:'70%', 
        height:40, 
        borderRadius:20, 
        marginTop:20,
        alignItems:'center', 
        alignSelf:'center',
        justifyContent:'center', 
        backgroundColor:'#35197c'
    },
  
});


ShareMsg.propTypes = {
    login: func,
    users: object,
    progressVisible: bool
};

const mapDispatchToProps = dispatch => ({
    login: (email, password) => dispatch(login(email, password)),
    saveUser: (user) => dispatch(saveUser(user)),
});

const mapStateToProps = ( state ) => ({
    users: state.users.users,
    progressVisible: state.users.progressVisible
});

export default connect(mapStateToProps, mapDispatchToProps)(ShareMsg);