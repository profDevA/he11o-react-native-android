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

class ShareCard extends React.Component {
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
        msg: 'Hello, view/save my digital business card... \nhttps//he11o.com/sam_sample',
        name_valid:false,
        mobile_valid:false,
        email_valid: false,
        text: '',

      }
    }

    componentDidMount() {
        const { users } = this.props
        console.log(users)
        const url = 'https://he11o.com/id/card?id=' + users.id;
        const message = 'Hello, view/save my digital business card... \nhttps://he11o.com/id/card/?id='+ users.id;
        this.setState({
            name: users.user_nicename,
            surname: users.display_name,
            mobile: users.mobile,
            email: users.card_email,
            text: url,
            msg: users.share_message || message
        })
    }

    share(){

        var shareImage = {
            title: "Share Card",
            url: this.state.msg
        }
        Share.open(shareImage).catch(err => console.log(err));
        // const {email, name, mobile, msg} = this.state
        // if(name == ''){
        //     this.setState({name_valid:true})
        // }else if(mobile == ''){
        //     this.setState({mobile_valid:true})
        // }else if(email == ''){
        //     this.setState({email_valid:true})
        // }else{
        //     const fd = new FormData();
        //     fd.append("email", email);
        //     fd.append("subject", "Share Card")
        //     fd.append("msg", msg);
        //     this.setState({progressVisible:true})
        //     axios.post('https://he11o.com/id/api/mailer.php', fd,
        //     {
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //     })
        //     .then(response => {
        //         console.log(mobile)

        //         const sms = new FormData();
        //         sms.append("mobile", mobile);
        //         sms.append("msg", msg);
        //         // this.setState({progressVisible:true})
        //         axios.post('https://he11o.com/id/api/sms.php', sms,
        //         {
        //             headers: {
        //                 "Content-Type": "application/json"
        //             },
        //         })
        //         .then(response => {
        //             console.log(response)
        //             this.setState({progressVisible: false})
        //             alert("Sent")
        //             // Actions.sharetab()
        //         }).catch(err => {
        //             alert('err')
        //         })

        //         // this.setState({progressVisible: false})

        //         // Actions.sharetab()
        //     }).catch(err => {
        //         alert('err')
        //     })

        // }
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
        } else
            return (
                <ScrollView>
                    <SafeAreaView style={{backgroundColor:'white'}}>
                        <View>
                            <View style={{height:50, alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Share Your Card</Text>
                                <TouchableOpacity onPress={() => RootNavigation.navigate('home')} style={{position:'absolute', top:15, right:15}}>
                                    <Mat name="close" color={"#A2A6A8"} size={20}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{backgroundColor:'#F2F2F2', height:'100%'}}>
                                <View style={{height:220}}>
                                    <View style={{flexDirection:'row', paddingLeft:20, paddingTop:30}}>
                                        <View style={{backgroundColor:'#DFDEDE', width:140, height:140, borderRadius:10}}>
                                            {/* <Image
                                                source={{uri: users.images_url ==''?this.state.imageUrl:users.images_url}}
                                                style={{width:70, height:70, borderRadius:10}}/> */}

                                            <QRCode
                                                value={this.state.text}
                                                size={140}
                                                bgColor='#35197c'
                                                fgColor='white'/>
                                            {/* <TextInput
                                                style={styles.input}
                                                onChangeText={(text) => this.setState({text: text})}
                                                value={this.state.text}
                                            /> */}
                                        </View>
                                        <View style={{marginLeft:30, justifyContent:'center'}}>
                                            <Text style={{color:'grey', fontSize:18, fontFamily: 'BuenosAires'}}>{users.user_nicename+' '+users.display_name}</Text>
                                            <Text style={{color:'#CBCBCB', fontSize:16, fontFamily: 'BuenosAires'}}>{users.campany}</Text>
                                            <Text style={{color:'#CBCBCB', fontSize:16, fontFamily: 'BuenosAires'}}>{users.user_email}</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* <View style={{backgroundColor:'white', marginLeft:10, marginRight:10}}>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="name"
                                            placeholder="Name"
                                            placeholderTextColor="#ABABAB"
                                            value = { this.state.name }
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({name: value, name_valid:false})
                                            }
                                            style={styles.textInput}
                                        />

                                    </View>
                                    {this.state.name_valid && (
                                        <View style={{marginLeft:10, marginRight:10, backgroundColor:'white'}}>
                                            <Text style={{color:'red', marginLeft:15}}>Please must input name</Text>
                                        </View>

                                    ) }
                                    <View style={styles.row}>
                                        <TextInput
                                            name="surname"
                                            placeholder="Surname"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            value = { this.state.surname }
                                            onChangeText={value =>
                                                this.setState({surname: value})
                                            }
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="mobile"
                                            placeholder="Mobile"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            value = { this.state.mobile }
                                            onChangeText={value =>
                                                this.setState({mobile: value, mobile_valid:false})
                                            }
                                            style={styles.textInput}
                                        />
                                    </View>
                                    {this.state.mobile_valid && (
                                        <View style={{marginLeft:10, marginRight:10, backgroundColor:'white'}}>
                                            <Text style={{color:'red', marginLeft:15}}>Please must input mobile</Text>
                                        </View>

                                    ) }
                                    <View style={styles.row}>
                                        <TextInput
                                            name="email"
                                            placeholder="Email"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            value = { this.state.email }
                                            onChangeText={value =>
                                                this.setState({email: value, email_valid:false})
                                            }
                                            style={styles.textInput}
                                        />
                                    </View>
                                    {this.state.email_valid && (
                                        <View style={{marginLeft:10, marginRight:10, backgroundColor:'white'}}>
                                            <Text style={{color:'red', marginLeft:15}}>Please must input email</Text>
                                        </View>

                                    ) }
                                </View> */}

                                <Text style={{padding:10, color:'#9D9D9D', backgroundColor:'#F2F2F2', fontSize:12, fontFamily: 'BuenosAires'}}>Your message</Text>
                                <View style={{backgroundColor:'white', marginLeft:10, marginRight:10, padding:15, paddingTop:Platform.OS=='ios'? 25:0}}>

                                    <TextInput
                                        name="message"
                                        placeholder="Please enter your message"
                                        placeholderTextColor="#ABABAB"
                                        returnKeyType="next"
                                        value = {this.state.msg}
                                        multiline ={true}
                                        onChangeText={value =>
                                            this.setState({msg: value})
                                        }
                                        style={{
                                            height:100,
                                            color:'black',
                                            fontSize:16,
                                            textAlignVertical:'top',
                                            fontFamily: 'BuenosAires'
                                        }}
                                        placeholderStyle={{fontFamily: 'BuenosAires'}}
                                    />
                                </View>
                                <View style={{height:90}}>
                                    <TouchableOpacity onPress={()=> this.share()} style={styles.save_btn}>
                                        <Text style={{color:'white', fontFamily: 'BuenosAires'}}>SHARE CARD</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </SafeAreaView>
                </ScrollView>

            );
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
        // marginTop:-10
    },
    row: {
        borderBottomWidth:0.5,
        borderBottomColor:'#808080',
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5,
        padding: 5,
    }
});


ShareCard.propTypes = {
    login: func,
    users: object,
    progressVisible: bool
  };

  const mapDispatchToProps = dispatch => ({
    login: (email, password) => dispatch(login(email, password)),
  });

  const mapStateToProps = ( state ) => ({
    users: state.users.users,
    progressVisible: state.users.progressVisible
  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ShareCard);
