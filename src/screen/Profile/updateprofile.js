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
import ImageAdvancedPicker from "react-native-image-crop-picker";
import ImagePicker from "react-native-image-picker";
import { func, string, bool, object } from "prop-types";
import { connect } from "react-redux";
import { updateprofile, deleteFile, updateImages } from "./../../reducer/users";
import { IMAGE_BASE_URL, IMAGE_BASE_RE } from '../../globals';
import axios from 'axios';

class UpdateProfile extends React.Component {
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

    componentDidMount(){
        const { users } = this.props;
        console.log(users)
        this.setState({
            headline: users.users.headline,
            desc: users.users.descriptions,
            youtube: users.users.youtube_video,
            // image_urls: users.users.images_url ? (users.users.images_url.indexOf(',') > -1 ? users.users.images_url.split(',').filter((image) => image).map((image) => image ? image : '') : [users.users.images_url]) : []
            image_urls: users.users.images_url ? (users.users.images_url.indexOf(',') > -1 ? users.users.images_url.split(',').filter((image) => image).map((image) => IMAGE_BASE_URL+image) : [IMAGE_BASE_URL+users.users.images_url]) : []
        }, () => {
            console.log(this.state.image_urls);
        })
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
        //     // quality:0.7,
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

    deleteFile = (uri, index) => {
        const name = uri.replace(IMAGE_BASE_URL, '');
        let { image_urls } = this.state;
        image_urls.splice(index, 1);
        let newImageUrls = '';
        if(image_urls.length > 0) {
            newImageUrls = image_urls.join(',').replace(IMAGE_BASE_RE, '');
        }
        let fd = new FormData();
        fd.append('id', this.props.users.users.id);
        fd.append('name', name);
        fd.append('newImageUrls', newImageUrls);
        axios.post("https://he11o.com/id/api/deleteFile.php", fd)
        .then( ({ data }) => {
            if(data.status === 200) {
                this.props.updateImages(newImageUrls);
                this.setState({image_urls: newImageUrls.split(',').filter((image) => image).map((image) => IMAGE_BASE_URL+image)});
            } else {
                Alert.alert('Error', data.message);
            }
        }).catch( (err) => {
            Alert.alert('Error', 'Error on network');
        });
    }

    render() {
        const { updateprofile, users, progressVisible } = this.props;
        const { headline, desc, youtube, files, image_urls } = this.state;
        if (progressVisible) {
            return (
                <View style={[styles.containerLoader, styles.horizontal]}>
                    {/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
                    <ActivityIndicator size="large" color="grey"/>
                </View>
            );
        } else {
            return (
                <>
                <View style={{height:50, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize: 18, fontFamily: 'BuenosAires'}}>Edit Your Profile</Text>
                </View>
                <ScrollView>
                    <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>Add a headline (optional)</Text>
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
                            value = { this.state.headline }
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
                    <Text style={styles.label}>Add a short description</Text>

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
                            value = { this.state.desc }
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
                    <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>Insert Youtube Video (optional)</Text>
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
                                value = { this.state.youtube }
                                onChangeText={value =>
                                    this.setState({youtube: value})
                                }
                                style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                placeholderStyle={{fontFamily: 'BuenosAires'}}
                            />
                        </TouchableOpacity>

                    </View>
                    <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>Add Images (optional)</Text>

                    <View style={{width: '100%', flexWrap: 'wrap', flexDirection: 'row', paddingTop: 10, paddingLeft: '1%'}}>
                        {Array.isArray(image_urls) && image_urls.length > 0 ?
                            image_urls.map( (uri, i) =>
                                uri ?
                                    <ImageBackground key={i} style={{flexBasis: '32%', height: 150, marginRight: '1%', marginBottom: '1%'}} source={{uri, cache: 'force-cache'}} imageStyle={{height: '100%', width: '100%'}}>
                                        <Ionicon onPress={() => {this.deleteFile(uri, i)}} name="close-circle-outline" size={30} color="white" style={{position: 'absolute', bottom: 2, right: 2}} />
                                    </ImageBackground>
                                :
                                    <React.Fragment key={i}></React.Fragment>
                            )
                        :
                            <></>
                        }
                        {Array.isArray(files) && files.length > 0 ?
                            files.map( ({ uri }, i) =>
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
                </ScrollView>
                <View style={{backgroundColor:'#f6f6f6', alignItems:'center', paddingTop:30, paddingBottom: 50}}>
                    <TouchableOpacity onPress={() => updateprofile(users.users.id, headline, desc, files, youtube)} style={styles.save_btn}>
                        <Text style={{color:'white', fontFamily: 'BuenosAires'}}>SAVE DETAILS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('updatekind')}>
                        <Text style={{alignSelf:'center', marginTop:10, color:'#979797', fontFamily: 'BuenosAires'}}>Skip for Now</Text>
                    </TouchableOpacity>
                </View>
                </>
            );
        }
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
        marginLeft:10,

    },
    row: {
        borderBottomWidth:0.5,
        borderBottomColor:'#808080',
        paddingTop:10,
        paddingLeft:20
    },
    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },
    upload_btn: {
        flexDirection:'row',
        borderRadius:10,
        marginTop:10,
        marginLeft:10,
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

UpdateProfile.propTypes = {
    updateprofile: func,
    users: object,
    progressVisible: bool
  };

  const mapDispatchToProps = dispatch => ({
    updateprofile: ( id, headline, desc, files, youtube) => dispatch(updateprofile(id, headline, desc, files, youtube)),
    deleteFile: ( name ) => {dispatch(deleteFile(name));},
    updateImages: ( images_url ) => {dispatch(updateImages(images_url));}
  });

  const mapStateToProps = ({ users }) => ({
    users: users,
    progressVisible: users.progressVisible
  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(UpdateProfile);
