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
  ImageBackground
} from "react-native";
import { Actions } from "react-native-router-flux";
import Icon from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import ImagePicker from "react-native-image-picker";
import ImageAdvancedPicker from "react-native-image-crop-picker";
import axios from "axios";
import { func, string, bool, object } from "prop-types";
import { connect } from "react-redux";
import { signup } from "./../../reducer/users";
import RNFetchBlob from 'rn-fetch-blob';
import * as RootNavigation from './../../navigation/RootNavigation.js';
import { createprofile } from "./../../reducer/users";

class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        progressVisible: false,
        headline: '',
        desc: '',
        youtube: '',
        avatarSource: null,
        isUploading: false,
        files: []
      }
    }

    selectImage = async() => {
        ImageAdvancedPicker.openPicker({
            multiple: true,
            mediaType: 'photo',
            includeBase64: true
        }).then(images => {
            this.setState((prevState) => ({
                files: [
                    ...prevState.files,
                    ...(images.map( (im, i) =>
                        ({
                            filename: im.path.split('/')?.pop() || 'image_filename',
                            type: im.mime,
                            data: im.data,
                            uri: im.path,
                            name: 'file[]'
                        })
                    ))
                ]
            }
            ));
        }).catch( (err) => {
            'lol'
        });
        // ImagePicker.showImagePicker({
        //     // noData: true,
        //     mediaType:'photo',
        //     allowsEditing: true,
        //     quality:0.7,
        // }, (response) => {
        //     // console.log('Response = ', response);
        //     if(response.didCancel){
        //         console.log('Error','User cancelled image picker');
        //     }else if(response.error) {
        //         console.log('ImagePicker Error:' , response.error);
        //     }else if(response.customButton){
        //         console.log('User tapped custom button: ', response.customButton);
        //     }else{
        //         this.setState((prevState) => ({
        //             files: [
        //                 ...prevState.files,
        //                 {
        //                     filename: response.fileName,
        //                     type: response.type,
        //                     data: response.data,
        //                     uri: response.uri,
        //                     name: 'file[]'
        //                 }
        //             ]
        //         }
        //         ));
        //     }
        // });
    }

    spliceFile = (index) => {
        let { files } = this.state;
        if(files[index]) {
            files.splice(index, 1);
            this.setState({files});
        }
    }

    save() {
        const { headline, desc, youtube, files } = this.state;
        this.props.createprofile(this.props.route.params.id, headline, desc, files, youtube);
    }

    render() {
        const { id } = this.props.route.params;
        const { progressVisible:loading } = this.props;
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
                    <ScrollView>
                        <View style={{height:50, alignItems:'center', justifyContent:'center'}}>
                            <Text style={{fontSize: 18, fontFamily: 'BuenosAires'}}>Create Your Profile</Text>
                        </View>
                        <View style={{height:'100%', backgroundColor:'#f6f6f6'}}>
                            <Text style={{paddingLeft:10, marginTop:20, fontFamily: 'BuenosAires'}}>Add a headline (optional)</Text>

                            <View
                                style={{
                                    margin:10, backgroundColor:'white',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'lightgray'
                                }}
                            >
                                <TextInput
                                    name="headline"
                                    placeholder="Your intro headline..."
                                    placeholderTextColor="#ABABAB"
                                    returnKeyType="next"
                                    multiline={true}
                                    numberOfLines = {2}
                                    onChangeText={value =>
                                        this.setState({headline: value})
                                    }
                                    style={{
                                        color:'black',
                                        fontSize:16,
                                        height:80,
                                        marginTop:5,
                                        marginLeft:10,
                                        textAlignVertical:'top',
                                        fontFamily: 'BuenosAires'
                                    }}
                                    placeholderStyle={{fontFamily: 'BuenosAires'}}
                                />
                            </View>
                            <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>Add a short description</Text>
                            <View
                                style={{
                                    margin:10, backgroundColor:'white',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'lightgray'
                                }}
                            >
                                <TextInput
                                    name="description"
                                    placeholder="Brief description of your business or job..."
                                    placeholderTextColor="#ABABAB"
                                    returnKeyType="next"
                                    multiline={true}
                                    numberOfLines = {5}
                                    onChangeText={value =>
                                        this.setState({desc: value})
                                    }
                                    style={{
                                        color:'black',
                                        fontSize:16,
                                        height:140,
                                        marginTop:5,
                                        marginLeft:10,
                                        textAlignVertical:'top',
                                        fontFamily: 'BuenosAires'
                                    }}
                                    placeholderStyle={{fontFamily: 'BuenosAires'}}
                                />
                            </View>
                            <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>Insert Youtube Video(optional)</Text>

                            <View
                                style={{
                                    height:50, margin:10, backgroundColor:'white',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'lightgray'
                                }}
                            >
                                <TouchableOpacity style={{flexDirection:'row', marginLeft:10}}>
                                    <Icon name="youtube" size={20} color="black" style={{marginVertical:14 }}/>
                                    <TextInput
                                        name="youtube"
                                        placeholder="Please enter your youtube url"
                                        placeholderTextColor="#ABABAB"
                                        returnKeyType="next"
                                        onChangeText={value =>
                                            this.setState({youtube: value})
                                        }
                                        style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                        placeholderStyle={{fontFamily: 'BuenosAires'}}
                                    />
                                </TouchableOpacity>

                            </View>
                            <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>Upload images to Gallery</Text>

                            <View style={{width: '100%', flexWrap: 'wrap', flexDirection: 'row', paddingTop: 10, paddingLeft: '1%'}}>
                                {Array.isArray(this.state.files) && this.state.files.length > 0 ?
                                    this.state.files.map( ({ uri }, i) =>
                                        <ImageBackground key={'~'+i} style={{flexBasis: '32%', height: 150, marginRight: '1%', marginBottom: '1%'}} source={{uri, cache: 'force-cache'}} imageStyle={{height: '100%', width: '100%'}}>
                                            <Ionicon onPress={() => {this.spliceFile(i)}} name="close-circle-outline" size={30} color="white" style={{position: 'absolute', bottom: 2, right: 2}} />
                                        </ImageBackground>
                                    )
                                :
                                    <></>
                                }
                            </View>
                            <View
                                style={{
                                    height:50, margin:10, backgroundColor:'white',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'lightgray'
                                }}
                            >
                                <TouchableOpacity onPress={() => this.selectImage()} style={styles.upload_btn}>
                                    <Icon name="upload-cloud" size={20} color="black" style={{}}/>
                                    <Text style={{marginLeft:10, color:'#616568', fontFamily: 'BuenosAires'}}>Upload to Gallery</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{height:180, backgroundColor:'#f6f6f6', alignItems:'center', paddingTop:30, paddingBottom: 50}}>
                                <TouchableOpacity onPress={() => {!loading && this.save()}} style={styles.save_btn}>
                                    {loading ?
                                        <ActivityIndicator color='white' />
                                    :
                                        <Text style={{color:'white', fontFamily: 'BuenosAires'}}>SAVE DETAILS</Text>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => RootNavigation.navigate('kind', {id: id})}>
                                    <Text style={{alignSelf:'center', marginTop:10, color:'#979797', fontFamily: 'BuenosAires'}}>Skip for Now</Text>
                            </TouchableOpacity>
                            </View>
                        </View>

                    </ScrollView>
                </SafeAreaView>
            );
    }
}

const styles = StyleSheet.create({

    label: {
        color:'#616568',
        paddingLeft:10,
        marginTop:20
        // marginLeft:5
    },

    textInput: {
        color:'black',
        fontSize:16,
        height:40,
        marginTop:5,
        marginLeft:10
    },
    row: {
        borderBottomWidth:0.5,
        borderBottomColor:'#808080',
        paddingTop:10,
        paddingLeft:20
    },
    upload_btn: {
        flexDirection:'row',
        borderRadius:10,
        marginTop:10,
        marginLeft:10,
    },
    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },
    save_btn: {
        width:'70%',
        height:40,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#35197c'
    }
});

Profile.propTypes = {
    signup: func,
    users: object,
    progressVisible: bool,
    updateprofile: func
  };

  const mapDispatchToProps = dispatch => ({
    signup: (email, password, name, surname, campany, abn, job, tel, mobile, card_email, web, street, suburb, city, state, country, code, skype, twitter, facebook, instagram, linkedin, youtube) => dispatch(signup(email, password, name, surname, campany, abn, job, tel, mobile, card_email, web, street, suburb, city, state, country, code, skype, twitter, facebook, instagram, linkedin, youtube)),
    createprofile: ( id, headline, desc, files, youtube) => dispatch(createprofile(id, headline, desc, files, youtube)),
  });

  const mapStateToProps = ({ users }) => ({
    users: users,
    progressVisible: users.progressVisible
  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Profile);
