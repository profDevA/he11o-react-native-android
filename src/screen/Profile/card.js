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
  ImageBackground,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { func, string, bool, object } from "prop-types";
import { connect } from "react-redux";

import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from "react-native-image-crop-picker";
import ImagePicker from "react-native-image-picker";

import AsyncStorage from '@react-native-community/async-storage';

import LinearGradient from "react-native-linear-gradient";
import { signup } from "./../../reducer/users";
import axios from "axios";
import * as RootNavigation from './../../navigation/RootNavigation.js';
import RNFetchBlob from 'rn-fetch-blob';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_KEY } from '../../globals';

class Card extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        imageUrl:"",
        progressVisible: false,
        email: '',
        password: '',
        name: '',
        surname: '',
        campany: '',
        abn: '',
        job: '',
        tel: '',
        mobile: '',
        card_email: '',
        web: '',
        street: '',
        suburb: '',
        city: '',
        state: '',
        country: '',
        code: '',
        skype: '',
        twitter: '',
        instagram: '',
        facebook: '',
        linkedin: '',
        snapchat: '',
        youtube: '',
        avatarSource: null,
        isUploading: false,
        email_valid: false,
        name_valid: false,
        header: true,
        type:'',
        filename:'',
        data1: null,
        header_type:'',
        header_filename:'',
        header_data:null,
        header_uri:'',
        id:''
      };
      this.imageAlerted = false;
    }

    componentDidMount(){

    }
    selectImage = async() => {
        ImagePicker.showImagePicker({
            mediaType:'photo',
            allowsEditing: true,
            quality:0.7,
        }, (response) => {
            // console.log('Response = ', response);
            if(response.didCancel){
                console.log('Error','User cancelled image picker');
            }else if(response.error) {
                console.log('ImagePicker Error:' , response.error);
            }else if(response.customButton){
                console.log('User tapped custom button: ', response.customButton);
            }else{
                // console.log(response)
                if(Platform.OS == 'ios'){
                    this.setState({
                        data1: response.data,
                        type: response.type,
                        filename: 'image',
                        imageUrl: response.uri
                    })
                }else{
                    this.setState({
                        data1: response.data,
                        type: response.type,
                        filename: response.fileName,
                        imageUrl: response.uri
                    })
                }

            }
        })
    }

    selectImage1 = async() => {
        ImagePicker.showImagePicker({
            mediaType:'photo',
            allowsEditing: true,
            quality:0.7,
        }, (response) => {
            // console.log('Response = ', response);
            if(response.didCancel){
                console.log('Error','User cancelled image picker');
            }else if(response.error) {
                console.log('ImagePicker Error:' , response.error);
            }else if(response.customButton){
                console.log('User tapped custom button: ', response.customButton);
            }else{
                console.log(response)
                if(Platform.OS == 'ios'){
                    this.setState({
                        header_data: response.data,
                        header_type: response.type,
                        header_filename: 'image',
                        header_uri: response.uri
                    })
                }else{
                    this.setState({
                        header_data: response.data,
                        header_type: response.type,
                        header_filename: response.fileName,
                        header_uri: response.uri
                    })
                }

            }
        })
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

    validateYouTubeUrl(youtube)
    {
        var url = youtube;
        if (url != undefined || url != '') {
            var regExp = /^.*(youtube\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return true;
            }
            else {
                return false
                // Do anything for not being valid
            }
        }
        return false
    }

    register() {
        try {
            this.setState({progressVisible:true});
            const { email, pass } = this.props.route.params;
            const {
                header_type, header_filename, header_data, type,
                filename, data1, name, surname, campany, abn, job, tel, mobile,
                card_email, web, street, suburb, city, state, country, code,
                skype, twitter, facebook, instagram, linkedin, snapchat, youtube, id
            } = this.state;

            const Address = `${street} ${city} ${state} ${code}`;

            const params = {
                ...this.state,
                email: email,
                pass: pass
            };

            // if((type == '' || header_type == '') && !this.imageAlerted) {
            //     this.imageAlerted = true;
            //     alert('You have not uploaded a Profile Picture or Header Graphic Image');
            //     return;
            // }

            let base_url = 'https://he11o.com/id/api/signup.php';

            RNFetchBlob.fetch('POST', base_url,{
                    Authorization : "Bearer access-token",
                    otherHeader : "foo",
                    'Content-Type' : 'multipart/form-data',
                },
                [
                    {name:"email", data: email},
                    {name:"password", data: pass},
                    {name:"username", data: name},
                    {name:"surname", data: surname},
                    {name:"campany", data: campany},
                    {name:"abn", data: abn},
                    {name:"job_title", data: job},
                    {name:"telephone", data: tel},
                    {name:"mobile_num", data: mobile},
                    {name:"card_email", data: card_email},
                    {name:"web_url", data: web},
                    {name:"address", data: Address},
                    {name:"street", data: street},
                    {name:"suburb", data: suburb},
                    {name:"city", data: city},
                    {name:"state", data: state},
                    {name:"country", data: country},
                    {name:"code", data: code},
                    {name:"skype", data: skype},
                    {name:"twitter", data: twitter},
                    {name:"facebook", data: facebook},
                    {name:"instagram", data: instagram},
                    {name:"linkedin", data: linkedin},
                    {name:"snapchat", data: snapchat},
                    {name:"youtube_url", data: youtube},
                    {
                        name: "file",
                        type: type,
                        data: data1,
                        filename: filename

                    },
                    {
                        name: "file1",
                        type: header_type,
                        data: header_data,
                        filename: header_filename

                    },
                ])
                .then(response => {
                    console.log('---response---', response.data);

                    this.setState({progressVisible:false});

                    var obj = JSON.parse(response.data)

                    if(obj.status == 200){
                        let profileID = obj.result.ID;
                        const mail = new FormData();
                        mail.append("email", email);
                        mail.append("subject", "Welcome");
                        mail.append("msg", "Welcome to sign up he11o.com.");

                        console.log('---mail---', mail);
                        axios.post('https://he11o.com/id/api/mailer.php', mail)
                            .then(response => {

                                console.log('------created email result-------', response.data);
                                if (response.data == "Message sent.") {
                                    AsyncStorage.removeItem('verifyCode');

                                    this.setState({});

                                    this.setState({progressVisible:false});

                                    RootNavigation.navigate('profile', {id: profileID});

                                    return;
                                } else {
                                    Alert.alert("Error", response)
                                    return;
                                }

                            }).catch(err => {
                            console.log('err: ', err);
                            Alert.alert("Error", "Message is not send. Your email is not exist.")

                            this.setState({progressVisible:false});

                            RootNavigation.navigate('verifyConfirm', {id: profileID});
                        });
                        // RootNavigation.navigate('profile');
                        // RootNavigation.navigate('login');

                        return;
                    } else{
                        // this.setState({ isUploading: false});
                        Alert.alert('Error', obj.result);
                        RootNavigation.navigate('signup');
                    }

                }).catch(err => {
                    Alert.alert('Error', 'Error on network');
                    console.log('---err---', err)
                })
        } catch (error) {
            console.log("error")
        }
    }

    deleteProfPic = () => {
        this.setState({imageUrl: '', type: '', filename: '', data1: ''});
    }

    deleteBanner = () => {
        this.setState({header_data: '', header_type: '', header_filename: '', header_uri: ''})
    }

    handleAddressComponents = (addressComps) => {
        let meComps = {};
        for(let i = 0; i <= addressComps.length; ++i) {
            if(i === addressComps.length) {
                this.setState({
                    street: (meComps.street_address || meComps.street_number+' '+meComps.route || '')?.replace(/undefined/g, '')?.trim(),
                    suburb: meComps.sublocality || meComps.neighborhood || '',
                    city: meComps.city,
                    state: meComps.state,
                    country: meComps.country,
                    code: meComps.code
                });
            } else {
                const comp = addressComps[i];
                if(comp.types.indexOf('street_address') > -1) {
                    meComps['street_address'] = comp.short_name;
                } else if(comp.types.indexOf('street_number') > -1) {
                    meComps['street_number'] = comp.short_name;
                } else if(comp.types.indexOf('route') > -1) {
                    meComps['route'] = comp.short_name;
                } else if(comp.types.indexOf('sublocality') > -1) {
                    meComps['sublocality'] = comp.long_name;
                } else if(comp.types.indexOf('neighborhood') > -1) {
                    meComps['neighborhood'] = comp.long_name;
                } else if(comp.types.indexOf('locality') > -1) {
                    meComps['city'] = comp.long_name;
                } else if(comp.types.indexOf('administrative_area_level_1') > -1) {
                    meComps['state'] = comp.long_name;
                } else if(comp.types.indexOf('country') > -1) {
                    meComps['country'] = comp.long_name;
                } else if(comp.types.indexOf('postal_code') > -1) {
                    meComps['code'] = comp.short_name;
                }
            }
        }
    }

    render() {
        const { signup, progressVisible } = this.props;
        console.log(this.props);
        if (this.state.progressVisible) {
            return (
                <View style={[styles.containerLoader, styles.horizontal]}>
                    {/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
                    <ActivityIndicator size="large" color="grey"/>
                </View>
            );
        } else
            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={{ flex: 1 }}
                >
                    <ScrollView style={{backgroundColor:'white'}} keyboardShouldPersistTaps="always">
                        <View>
                            <View style={{height:50, alignItems:'center', justifyContent:'center', marginTop:Platform.OS =='ios'? 30: 0}}>
                                <Text style={{fontSize: 18, fontFamily: 'BuenosAires'}}>Create Your Card</Text>
                            </View>
                            <View style={{height:200}}>
                                {this.state.header_type =='' && (
                                    <LinearGradient
                                        start={{
                                        x: 0.79,
                                        y: 0.41
                                        }}
                                        end={{
                                        x: -0.04,
                                        y: 0.62
                                        }}
                                        locations={[0, 1]}
                                        colors={["#81C5FB", "#A8EAE1"]}
                                        style={styles.linear}
                                    >
                                        <TouchableOpacity onPress={() => this.selectImage1()}>
                                            {/* <Icon name="add-circle-outline" size={25} color="white" /> */}
                                            <Image source={{uri: "asset:/headerButton.png", cache: 'force-cache'}} style={{height: 30, width: 30}} />
                                        </TouchableOpacity>
                                    </LinearGradient>
                                 )}

                                {this.state.header_type !='' && (
                                    <ImageBackground source={{uri: this.state.header_uri}}
                                    style={styles.linear}>
                                        <TouchableOpacity style={{position: 'absolute', top: 15, right: 15, zIndex: 250}} onPress={() => this.selectImage1()}>
                                            <Image source={{uri: "asset:/headerButton.png", cache: 'force-cache'}} style={{height: 30, width: 30}} />
                                            {/* <Icon name="add-circle-outline" size={25} color="white" /> */}
                                        </TouchableOpacity>
                                    </ImageBackground>

                                 )}

                            </View>

                            <TouchableOpacity onPress={() => this.selectImage()} style={styles.photo}>
                                {this.state.imageUrl ?
                                    <Image source={{uri: this.state.imageUrl}} style={{width:100, height:100, borderRadius:30}} />
                                :
                                    <></>
                                }
                                <Icon name="add-circle-outline" size={25} color="grey" style={{alignSelf:'center', marginTop: 40, position: 'absolute', zIndex: 200 }} />
                            </TouchableOpacity>
                            <View style={{backgroundColor:'#F2F2F2', paddingHorizontal: 10}}>
                                <View style={{backgroundColor:'white', marginTop:-10, paddingTop: 20}}>
                                    <View style={{flexDirection: 'row', marginTop: 45, alignSelf: 'center'}}>
                                        {this.state.imageUrl ?
                                            <TouchableOpacity onPress={() => {this.deleteProfPic()}} activeOpacity={0.6}>
                                                <Text style={{color: 'red', fontFamily: 'BuenosAires', fontSize: 12}}>Delete Picture</Text>
                                            </TouchableOpacity>
                                        :
                                            <></>
                                        }

                                        {this.state.imageUrl && this.state.header_uri ?
                                            <Text style={{color: 'red', fontFamily: 'BuenosAires', fontSize: 12}}> | </Text>
                                        :
                                            <></>
                                        }

                                        {this.state.header_uri ?
                                            <TouchableOpacity onPress={() => {this.deleteBanner()}} activeOpacity={0.6}>
                                                <Text style={{color: 'red', fontFamily: 'BuenosAires', fontSize: 12}}>Delete Banner</Text>
                                            </TouchableOpacity>
                                        :
                                            <></>
                                        }
                                    </View>

                                    <View style={styles.firstrow}>
                                        <TextInput
                                            name="name"
                                            placeholder="Name"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({name: value, name_valid:false})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />

                                    </View>
                                    {this.state.name_valid && (
                                        <View style={{width:'90%', alignSelf:'center'}}>
                                            <Text style={{color:'red', fontFamily: 'BuenosAires'}}>Please must input name</Text>
                                        </View>

                                    ) }
                                    <View style={styles.row}>
                                        <TextInput
                                            name="surname"
                                            placeholder="Surname"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({surname: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />

                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="job"
                                            placeholder="Job Title"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({job: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="company"
                                            placeholder="Company Name"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({campany: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="abn"
                                            placeholder="ABN"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({abn: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="tel"
                                            placeholder="Tel"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({tel: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="mobile"
                                            placeholder="Mobile"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({mobile: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="email"
                                            placeholder="Email"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({card_email: value, email_valid:false})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                            autoCapitalize="none"
                                        />

                                    </View>
                                    {this.state.email_valid && (
                                        <View style={{width:'90%', alignSelf:'center'}}>
                                            <Text style={{color:'red', fontFamily: 'BuenosAires'}}>Please must input email</Text>
                                        </View>

                                    ) }
                                    <View style={{marginLeft:10, paddingTop: Platform.OS=='ios'? 25:5, paddingBottom:5, paddingLeft:20}}>
                                        <TextInput
                                            name="website"
                                            placeholder="Website"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({web: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={{backgroundColor:'#F2F2F2', height:20}}/>
                                    <GooglePlacesAutocomplete
                                        placeholder='Your Address'
                                        fetchDetails={true}
                                        suppressDefaultStyles={true}
                                        onPress={(data, details = null) => {
                                            // 'details' is provided when fetchDetails = true
                                            this.handleAddressComponents(details?.address_components);
                                        }}
                                        query={{
                                            key: GOOGLE_KEY,
                                            language: 'en',
                                        }}
                                        styles={{
                                            container: styles.row,
                                            textInput: styles.textInput,
                                            predefinedPlacesDescription: {
                                                color: '#1faadb',
                                            },
                                            row: styles.innerRow
                                        }}
                                    />
                                    <View style={styles.row}>
                                        <TextInput
                                            name="street"
                                            placeholder="Street Address"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({street: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                            value={this.state.street}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="suburb"
                                            placeholder="Suburb"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({suburb: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                            value={this.state.suburb}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="city"
                                            placeholder="City"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({city: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                            value={this.state.city}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="state"
                                            placeholder="State"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({state: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                            value={this.state.state}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="country"
                                            placeholder="Country"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({country: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                            value={this.state.country}
                                        />
                                    </View>
                                    <View style={{marginLeft:10, paddingTop: Platform.OS=='ios'? 25:5, paddingBottom:5, paddingLeft:20}}>
                                        <TextInput
                                            name="code"
                                            placeholder="Post Code"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({code: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                            value={this.state.code}
                                        />
                                    </View>
                                    <View style={{backgroundColor:'#F2F2F2', height:20}}/>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="skype"
                                            placeholder="skype username"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({skype: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="twitter"
                                            placeholder="twitter.com/profile_url"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({twitter: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="facebook"
                                            placeholder="facebook.com/profile_url"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({facebook: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="instagram"
                                            placeholder="instagram/profile_url"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({instagram: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>

                                    <View style={styles.row}>
                                        <TextInput
                                            name="linkedin"
                                            placeholder="linkedin.com/profile_url"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({linkedin: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            name="snapchat"
                                            placeholder="snapchat.com/url"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({snapchat: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={{marginLeft:10, paddingTop: Platform.OS=='ios'? 25:5, paddingBottom:5, paddingLeft:20}}>
                                        <TextInput
                                            name="youtube"
                                            placeholder="youtube.com/url"
                                            placeholderTextColor="#ABABAB"
                                            returnKeyType="next"
                                            onChangeText={value =>
                                                this.setState({youtube: value})
                                            }
                                            style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                            placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        />
                                    </View>
                                    <View style={styles.lastrow}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const {name, card_email} = this.state
                                                if(name == ''){ this.setState({name_valid:true})}
                                                else if(card_email == '') { this.setState({email_valid:true})}
                                                else{
                                                    // Actions.profile()
                                                    if(!this.validate(card_email)){
                                                        Alert.alert("Error", "Email is not correct.");
                                                        return;
                                                    }
                                                    // if(youtube !=''){
                                                    //     if(!this.validateYouTubeUrl(youtube)){
                                                    //         Alert.alert("Error", "Youtube Url is not correct.");
                                                    //         return;
                                                    //     }
                                                    // }

                                                    this.register()
                                                }
                                            }}
                                            style={styles.save_btn}
                                        >

                                            <Text style={{color:'white', fontFamily: 'BuenosAires'}}>SAVE DETAILS</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                            
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
    linear: {
        height:200,
        paddingTop:15,
        paddingRight:15,
        alignItems:'flex-end'
    },
    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },
    photo: {
        height:100,
        width:100,
        borderRadius:30,
        top: 190,
        alignSelf:'center',
        backgroundColor:'#EFEEEF',
        position: 'absolute',
        zIndex: 10
    },
    firstrow: {
        borderBottomWidth:0.5,
        paddingBottom:5,
        paddingTop:25,
        borderBottomColor:'lightgray',
        paddingLeft:20,
        marginLeft:10,
        marginRight:10
    },
    textInput: {
        color:'black',
        fontSize:14,
        marginLeft: -15,
        fontFamily: 'BuenosAires'
        // marginTop:-10
    },
    row: {
        borderBottomWidth:0.5,
        borderBottomColor:'lightgray',
        paddingTop:Platform.OS == 'ios'? 25: 5,
        paddingBottom:5,
        paddingLeft:20,
        marginLeft:10,
        marginRight:10
    },
    innerRow: {
        borderBottomWidth:0.5,
        borderBottomColor:'lightgray',
        paddingTop:Platform.OS == 'ios'? 25: 5,
        paddingBottom:5
    },
    lastrow: {
        alignItems:'center',
        // justifyContent:'center',
        backgroundColor:'#F2F2F2',
        height:150
    },
    save_btn: {
        width:'70%',
        height:40,
        marginTop:30,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#35197c'
    }

});

Card.propTypes = {
    signup: func,
    users: object,
    progressVisible: bool
  };

  const mapDispatchToProps = dispatch => ({
    signup: () => dispatch(signup()),
  });

  const mapStateToProps = ({ users }) => ({
    users: users,
    progressVisible: users.progressVisible
  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Card);
