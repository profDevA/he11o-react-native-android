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
  Linking,
  FlatList,
  Platform,
  Dimensions,
  ImageBackground
//   TextInput,
//   KeyboardAvoidingView
} from "react-native";
import { Actions } from "react-native-router-flux";
import Icon from 'react-native-vector-icons/Feather';
import Ev from 'react-native-vector-icons/EvilIcons';
import En from 'react-native-vector-icons/Entypo';
import Ant from 'react-native-vector-icons/AntDesign';
import Ion from 'react-native-vector-icons/Ionicons';
import Fa from 'react-native-vector-icons/FontAwesome5';
import Sli from 'react-native-vector-icons/SimpleLineIcons';
import * as Animatable from 'react-native-animatable';
const AnimatedIcon = Animatable.createAnimatableComponent(Ant);
import Video from 'react-native-video';
import { func, string, bool, object, number } from "prop-types";
import { connect } from "react-redux";
import { login, select_style, updateShareImages } from "./../../reducer/users";
import LinearGradient from "react-native-linear-gradient";
import MI from 'react-native-vector-icons/MaterialIcons';
// import WebView from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as RootNavigation from './../../navigation/RootNavigation.js';
import { IMAGE_BASE_URL } from '../../globals';
import Facebook from '../../svg/facebook';
import LinkedIn from '../../svg/linkedin';

import Share, {ShareSheet, Button} from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
  } from "react-native-responsive-screen";
// import share from "../../reducer/share";

const Screen = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
};

const playerRef = null;
const playing = false;

const getYoutubeId = (url) => {
    if(!url) {return '';}
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return '';
    }
}

class Home extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        imageUrl:
            "http://www.cybecys.com/wp-content/uploads/2017/07/no-profile.png",
        // videoUrl: 'https://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_10mb.mp4',
        header: true,
        videoUrl: require('./../../../assets/v1.mp4'),
        gridUrl: [
            { id: 0, source: { uri: "http://i.imgur.com/XP2BE7q.jpg" } },
            { id: 1, source: { uri: "http://i.imgur.com/XP2BE7q.jpg" } },
            { id: 2, source: { uri: "http://i.imgur.com/5nltiUd.jpg" } },

        ],
        progressVisible: false,
        name: '',
        surname: '',
        org: '',
        job: '',
        tel: '',
        country: 'view',
        visible: false,
        height: 30,
        visibleShare: false,
        style: '2',
        youtube_id: 'hI7kbY40tcM',
        share_img: [],
        imgs: [],
        shareImages: []
      }
    }

    save(){
        RootNavigation.navigate('profile');
    }

    toggleModal( view1 ) {
        this.setState({ visible: view1 });
        if(view1){
            this.setState({height:400})
        }else{
            this.setState({height:30})
        }
    }

    componentDidMount() {
        this.refreshImageList();
    }

    componentDidUpdate(prevProps) {
        if(this.props.users?.images_share_url !== prevProps.users?.images_share_url || this.props.users?.images_url !== prevProps.users?.images_url) {
            this.refreshImageList();
        }
    }

    refreshImageList = () => {
        const { images_share_url=[], images_url=[] } = this.props.users || {};
        const urls = [];
        if(images_url !=''){
            const words = images_url.split(',');
            for(var i=0; i<words.length; ++i){
                urls[i] = words[i];
            }
        }

        let shareUrls = [];
        if(images_share_url !=''){
            const words = images_share_url.split(',');
            for(var i=0; i<words.length; ++i){
                shareUrls[i] = words[i];
            }
        }

        let draft = [];
        urls.forEach(imgUrl => {
            draft.push({img: imgUrl, checked: false});
        });

        shareUrls.forEach(shaUrl => {
            draft.forEach(d => {
                if (d.img === shaUrl) { d.checked = true }
            })
        });
        this.setState({imgs: draft}, () => console.log('------imgs---------', this.state.imgs));
    }

    getShareFiles = async () => {
        const { shareImages } = this.state;
        let shareFiles = [];
        for(let i = 0; i <= shareImages.length; ++i) {
            if(i === shareImages.length) {
                return shareFiles;
            } else {
                const img = shareImages[i];
                const type = (img.split('.')[2]).replace('jpg', 'jpeg');
                let filePath = null;
                let file_url_length = img.length;
                const configOptions = { fileCache: true, appendExt: type };
                const resp = await RNFetchBlob.config(configOptions).fetch('GET', img);
                filePath = resp.path();
                const base64Data = await resp.readFile('base64');
                shareFiles.push(`data:image/${type};base64,` + base64Data);
                await RNFS.unlink(filePath);
            }
        }
    }

    onPressMediaItem(item, index) {
        let { imgs, shareImages } = this.state;
        const newVal = !imgs[index]['checked'];
        imgs[index]['checked'] = newVal;
        if(newVal) {
            shareImages = [...shareImages, IMAGE_BASE_URL+item.img];
        } else {
            shareImages.splice(shareImages.indexOf(IMAGE_BASE_URL+item.img), 1);
        }
        this.setState({imgs, shareImages});
    }

    share = () => {
        if(this.state.shareImages.length) {
            this.getShareFiles()
            .then( (urls) => {
                Share.open({
                    urls
                }).then( (res) => {
                    this.doneSharing();
                }).catch( (err) => {
                    console.log('-----share error-----', err);
                });
            });
        }
    }

    doneSharing = () => {
        let { imgs } = this.state;
        imgs = imgs.map( (img) => ({...img, checked: false}) );
        const shareImages = [];
        this.setState({imgs, shareImages});
    }

    renderStyleHeader = (users) => {
        console.log('-----user info----', users);
            if (users.style === '0') {
                return (
                    <View style={{height:180}}>
                        {users.header_img ?
                            <ImageBackground source={{uri: IMAGE_BASE_URL+users.header_img}}
                                            style={styles.linear}>
                                {/* <TouchableOpacity onPress={() => RootNavigation.navigate('updatecard', {email:users.user_email, pass:users.user_pass})} style={{position:'absolute', top:20, right:20}}>
                                    <Ion name="ellipsis-horizontal-circle" size={30} color="white"/>
                                </TouchableOpacity> */}
                            </ImageBackground>
                        :
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
                                {/* <TouchableOpacity onPress={() => RootNavigation.navigate('updatecard', {email:users.user_email, pass:users.user_pass})} style={{position:'absolute', top:20, right:20}}>
                                    <Ion name="ellipsis-horizontal-circle" size={30} color="white"/>
                                </TouchableOpacity> */}
                            </LinearGradient>
                        }
                    </View>
                )
            } else if (users.style === '1') {
                return (
                    <View style={{height:180}}>
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
                            colors={["#FFFFFF", "#FFFFFF"]}
                            style={styles.linear}
                        >
                            {/* <TouchableOpacity onPress={() => RootNavigation.navigate('updatecard', {email:users.user_email, pass:users.user_pass})} style={{position:'absolute', top:20, right:20}}>
                                <Ion name="ellipsis-horizontal-circle" size={30} color="black"/>
                            </TouchableOpacity> */}
                        </LinearGradient>

                    </View>
                )
            } else if (users.style === '2') {
                return (
                    <View style={{height:180}}>
                        {/* <View>
                            <TouchableOpacity onPress={() => RootNavigation.navigate('updatecard', {email:users.user_email, pass:users.user_pass})} style={{position:'absolute', top:20, right:20}}>
                                <Ion name="ellipsis-horizontal-circle" size={30} color="white"/>
                            </TouchableOpacity>
                        </View> */}
                        <ImageBackground source={{uri: IMAGE_BASE_URL+users.header_img}}
                                         style={styles.linear}>
                            {/* <TouchableOpacity onPress={() => RootNavigation.navigate('updatecard', {email:users.user_email, pass:users.user_pass})} style={{position:'absolute', top:20, right:20}}>
                                <Ion name="ellipsis-horizontal-circle" size={30} color="white"/>
                            </TouchableOpacity> */}
                        </ImageBackground>

                    </View>
                )
            } else {
                return (
                    <View style={{height:180}}>
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
                            {/* <TouchableOpacity onPress={() => RootNavigation.navigate('updatecard', {email:users.user_email, pass:users.user_pass})} style={{position:'absolute', top:20, right:20}}>
                                <Ion name="ellipsis-horizontal-circle" size={30} color="white"/>
                            </TouchableOpacity> */}
                        </LinearGradient>

                    </View>
                )
            }
    };

    render() {
        let { users } = this.props;
        if(!users) {users = {}}
        const { shareImages, imgs } = this.state;
        const { share } = this;
        console.log("USERS", users);
        if (this.state.progressVisible) {
            return (
                <View style={[styles.containerLoader, styles.horizontal]}>
                    {/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
                    <ActivityIndicator size="large" color="grey"/>
                </View>
            );
        } else
            return (
                    <ScrollView style={{backgroundColor:'white'}}>
                        <View>
                            {this.renderStyleHeader(users)}

                            <View style={{height: 240, alignItems:'center', backgroundColor:'#F7F8F9'}}>

                                <View style={{
                                    marginVertical:25,
                                    width:'90%',
                                    shadowColor: 'grey',
                                    shadowOpacity: 0.3,
                                    shadowOffset: { width: 0, height: 5 },
                                    shadowRadius: 2,
                                    elevation: 2,
                                    marginTop:-30,
                                    height: users.style != '0' && (users.user_url || users.style == '2') ? 210 : 170,
                                    borderRadius:10,
                                    borderColor:'#E0E1E0',
                                    borderWidth:0.5,
                                    paddingTop: 10,
                                    backgroundColor:'white'}}>
                                    {users.style != '0' && (
                                        users.user_url || users.style == '2' ?
                                            <View style={{height:100, width:100, marginTop:-60, borderRadius:30, alignSelf:'center', backgroundColor:'#EFEEEF'}}>
                                                <Image source={{uri: users.user_url==''?this.state.imageUrl:IMAGE_BASE_URL+users.user_url}} style={{borderRadius:30, width:100, height:100}} />
                                            </View>
                                        :
                                            <></>
                                    )}

                                <View style={{paddingHorizontal: 10}}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
                                        <Text style={{fontSize:18, textTransform: 'capitalize', fontFamily: 'BuenosAires'}}>{users.user_nicename+ ' ' +users.display_name}</Text>
                                        <TouchableOpacity
                                            onPress={()=>
                                                // Actions.sharecard()
                                                RootNavigation.navigate('sharecard')
                                            }
                                        >
                                            <Ion name="share-outline" size={25} color="#4C80C0" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{/* color: "#878787", */ fontFamily: 'BuenosAires'}}>{users.job_title}</Text>

                                    <Text style={{/* color: "#878787", */ fontFamily: 'BuenosAires'}}>{users.campany}</Text>
                                    {/* <Text style={{color:'#BCBCBC'}}>{users.user_email}</Text> */}
                                </View>
                                    <View style={{flexDirection:'row', borderTopColor:'#E0E1E0', borderTopWidth:0.5, marginTop: 40, flex: 1}}>
                                        <View style={{borderRightColor:'#BCBCBC', borderRightWidth:0.5, flex: 1, justifyContent: 'center'}}>
                                            {/* <TouchableOpacity onPress={() => Linking.openURL('tel:123456')} style={{flexDirection:'row', justifyContent:'center'}}>
                                                <Icon name="mic" size={18} color="#A2A6A8" />
                                                <Text style={styles.label}>CALL</Text>
                                            </TouchableOpacity> */}
                                            <View style={{flexDirection:'row', justifyContent:'center'}}>
                                                <Icon name="mic" size={16} color="#A2A6A8" />
                                                <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>CALL</Text>
                                            </View>
                                        </View>
                                        <View style={{borderRightColor:'#BCBCBC', borderRightWidth:0.5, flex: 1, justifyContent: 'center'}}>
                                            {/* <TouchableOpacity style={{flexDirection:'row', justifyContent:'center'}}>
                                                <AnimatedIcon
                                                    name={"mail"}
                                                    color={"#A2A6A8"}
                                                    size={20}
                                                    // style={}
                                                />
                                                <Text style={styles.label}>EMAIL</Text>
                                            </TouchableOpacity> */}
                                            <View style={{flexDirection:'row', justifyContent:'center'}}>
                                                <AnimatedIcon
                                                    name={"mail"}
                                                    color={"#A2A6A8"}
                                                    size={18}
                                                    // style={}
                                                />
                                                <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>EMAIL</Text>
                                            </View>
                                        </View>
                                        <View style={{justifyContent:'center', flex: 1}}>
                                            {/* <TouchableOpacity style={{flexDirection:'row', justifyContent:'center'}}>
                                                <Ev
                                                    name="location"
                                                    color={"#A2A6A8"}
                                                    size={20}
                                                    // style={}
                                                />
                                                <Text style={styles.label}>VISIT</Text>
                                            </TouchableOpacity> */}
                                            <View style={{flexDirection:'row', justifyContent:'center'}}>
                                                <Ion
                                                    name="location-outline"
                                                    color={"#A2A6A8"}
                                                    size={18}
                                                    style={{marginTop:2}}
                                                />
                                                <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>VISIT</Text>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                                <View style={{height:30, flexDirection:'row', justifyContent:'space-between', paddingLeft: '5%'}}>
                                    {users.web_url != '' && (
                                        <Sli style={{marginRight: '5%'}} name="screen-desktop" color="#454545" size={20} />
                                    )}
                                    {users.skype != '' && (
                                        <Sli style={{marginRight: '5%'}} name="social-skype" color="#454545" size={20} />
                                    )}
                                    {users.facebook != '' && (
                                        <Fa style={{marginRight: '5%'}} name="facebook-f" color="#454545" size={20} />
                                    )}
                                    {users.instagram != '' && (
                                        <Fa style={{marginRight: '5%'}} name="instagram" color="#454545" size={20} />
                                    )}
                                    {users.twitter != '' && (
                                        <Fa style={{marginRight: '5%'}} name="twitter" color="#454545" size={20} />
                                    )}
                                    {users.linkedin != '' && (
                                        <Fa style={{marginRight: '5%'}} name="linkedin-in" color="#454545" size={20} />
                                    )}
                                    {users.snapchat != '' && (
                                        <Fa style={{marginRight: '5%'}} name="snapchat-ghost" color="#454545" size={20} />
                                    )}
                                    {users.youtube_url != '' && (
                                        <Ion style={{marginRight: '5%'}} name="logo-youtube" color="#454545" size={20} />
                                    )}
                                </View>
                            </View>
                            <View>

                                <View style={{flexDirection:'row', padding:10, /* justifyContent:'space-between', */ backgroundColor:'#F7F8F9', alignItems: 'center'}}>
                                    {
                                        this.state.visible ? (
                                            <Text style={{color: "#4C80C0", fontFamily: 'BuenosAires'}}>Hide Card Details</Text>
                                        ) : (
                                            <Text style={{color: "#4C80C0", fontFamily: 'BuenosAires'}}>View Card Details</Text>
                                        )
                                    }
                                    <TouchableOpacity onPress={() => this.toggleModal(!this.state.visible)}>
                                        {this.state.visible ?
                                            <MI name="keyboard-arrow-up" size={25} color="#4C80C0" />
                                        :                                        
                                            <MI name="keyboard-arrow-down" size={25} color="#4C80C0" />
                                        }
                                    </TouchableOpacity>
                                </View>
                                {this.state.visible && (
                                    <View style={{backgroundColor:'#F7F8F9', paddingHorizontal: 10}}>
                                        <View style={{backgroundColor:'white', paddingHorizontal: 15}}>
                                        <View style={{borderRadius: 10}}>
                                            <View style={styles.item}>
                                                <View style={{flexDirection:'row', width:'40%'}}>
                                                    <AnimatedIcon name={"mail"} color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                    <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Email</Text>
                                                </View>
                                                <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.card_email}</Text>
                                            </View>
                                            <View style={styles.item}>
                                                <View style={{flexDirection:'row', width:'40%'}}>
                                                    <Sli name="screen-smartphone" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                    <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Mobile</Text>
                                                </View>
                                                <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.mobile}</Text>
                                            </View>
                                            <View style={[styles.item, {borderBottomWidth: 0}]}>
                                                <View style={{flexDirection:'row', width:'40%'}}>
                                                    <Ion name="location-outline" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                    <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Address</Text>
                                                </View>
                                                <Text numberOfLines={1} style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.address}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:30, backgroundColor:'#F7F8F9'}}></View>

                                        <View style={{borderRadius: 10, paddingBottom: 10}}>
                                            {users.web_url ?
                                                <View style={styles.item}>
                                                    <View style={{flexDirection:'row', width:'40%'}}>
                                                        <Sli name="screen-desktop" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                        <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Website</Text>
                                                    </View>
                                                    <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.web_url}</Text>
                                                </View>
                                            :
                                                <></>
                                            }
                                            {users.skype ?
                                                <View style={styles.item}>
                                                    <View style={{flexDirection:'row', width:'40%'}}>
                                                        <Sli name="social-skype" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                        <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Skype</Text>
                                                    </View>
                                                    <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.skype}</Text>
                                                </View>
                                            :
                                                <></>
                                            }
                                            {users.facebook ?
                                                <View style={styles.item}>
                                                    <View style={{flexDirection:'row', width:'40%'}}>
                                                        {/* <Facebook /> */}
                                                        <Fa name="facebook-f" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                        <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Facebook</Text>
                                                    </View>
                                                    <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.facebook}</Text>
                                                </View>
                                            :
                                                <></>
                                            }
                                            {users.instagram ?
                                                <View style={styles.item}>
                                                    <View style={{flexDirection:'row', width:'40%'}}>
                                                        <Fa name="instagram" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                        <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Instagram</Text>
                                                    </View>
                                                    <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.instagram}</Text>
                                                </View>
                                            :
                                                <></>
                                            }
                                            {users.twitter ?
                                                <View style={styles.item}>
                                                    <View style={{flexDirection:'row', width:'40%'}}>
                                                        <Fa name="twitter" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                        <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Twitter</Text>
                                                    </View>
                                                    <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.twitter}</Text>
                                                </View>
                                            :
                                                <></>
                                            }
                                            {users.linkedin ?
                                                <View style={styles.item}>
                                                    <View style={{flexDirection:'row', width:'40%'}}>
                                                        {/* <LinkedIn /> */}
                                                        <Fa name="linkedin-in" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                        <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>LinkedIn</Text>
                                                    </View>
                                                    <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.linkedin}</Text>
                                                </View>
                                            :
                                                <></>
                                            }
                                            {users.snapchat ?
                                                <View style={styles.item}>
                                                    <View style={{flexDirection:'row', width:'40%'}}>
                                                        <Fa name="snapchat-ghost" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                        <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Snapchat</Text>
                                                    </View>
                                                    <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.snapchat}</Text>
                                                </View>
                                            :
                                                <></>
                                            }
                                            {users.youtube_url ?
                                                <View style={[styles.item, {borderBottomWidth: 0}]}>
                                                    <View style={{flexDirection:'row', width:'40%'}}>
                                                        <Ion name="logo-youtube" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                        <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Youtube</Text>
                                                    </View>
                                                    <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.youtube_url}</Text>
                                                </View>
                                            :
                                                <></>
                                            }
                                        </View>
                                        <View style={{height:30, backgroundColor:'#F7F8F9'}}></View>
                                        </View>
                                    </View>
                                )}
                                <View style={{paddingHorizontal: 10}}>
                                    {users.headline ?
                                        <Text style={{fontSize:18, fontWeight:'700', padding:10, marginTop: 30, fontFamily: 'BuenosAires'}}>{users.headline}</Text>
                                    :
                                        <></>
                                    }
                                    {users.descriptions ?
                                        <Text style={{padding:10, color:'grey', fontFamily: 'BuenosAires'}}>{users.descriptions}</Text>
                                    :
                                        <></>
                                    }
                                </View>
                            </View>
                            {users.youtube_video ?
                                <View style={{width:'100%', alignItems:'center', justifyContent:'center', paddingHorizontal: 10, marginBottom: 5}}>
                                    <View style={{height:200, width:'100%'}}>
                                        <YoutubePlayer
                                            ref={playerRef}
                                            height={200}
                                            width={'100%'}
                                            videoId={getYoutubeId(users.youtube_video)}
                                            play={playing}
                                            onChangeState={event => console.log(event)}
                                            onReady={() => console.log("ready")}
                                            onError={e => console.log(e)}
                                            onPlaybackQualityChange={q => console.log(q)}
                                            volume={50}
                                            playbackRate={1}
                                            playerParams={{
                                                cc_lang_pref: "us",
                                                showClosedCaptions: true
                                        }}
                                        />
                                    </View>
                                </View>
                            :
                                <></>
                            }
                            {imgs !='' && (
                                <View style={{padding:10, alignItems:'center', flexDirection: 'row', flexWrap: 'wrap'}}>
                                    {imgs.map((item, index) =>
                                        item != "" ? (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {this.onPressMediaItem(item, index)}}
                                                style={{flexBasis: '32%', height: 150, marginRight: '1%', marginBottom: '1%', position: 'relative', backgroundColor: 'gray'}}
                                            >
                                                <Image
                                                    source={{uri: IMAGE_BASE_URL+item.img}}
                                                    style={{width: '100%', height: '100%'}}
                                                />
                                                {
                                                    item.checked ? (
                                                        <Icon name="check-circle" size={25}
                                                            color="white"
                                                            style={{position: 'absolute', bottom: 5, right: 5}}
                                                        />
                                                    ) : (
                                                        null
                                                    )
                                                }
                                            </TouchableOpacity>
                                        ) : (
                                            <React.Fragment key={index}></React.Fragment>
                                        )
                                    )}
                                </View>
                            )}

                            <View style={{ backgroundColor:'white', flexDirection:'row', justifyContent:'flex-end', height:50, paddingRight:20}}>
                                <TouchableOpacity style={{marginRight: 8}} onPress={() => RootNavigation.navigate('updateprofile')}>
                                    <Ion name="ellipsis-horizontal-circle" size={30} color="grey"/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {share()}}>
                                    <Ion name="share-outline" size={30} color={shareImages.length ? 'blue' : 'grey'} style={{transform: [{rotateZ: '90deg'}]}} />
                                </TouchableOpacity>
                            </View>

                            {/* <View style={{height:70, justifyContent: 'center', alignItems: 'center', margin: 5}}>
                                <TouchableOpacity onPress={()=> this.updateShareImages()} style={styles.save_btn}>
                                    <Text style={{color:'white', fontFamily: 'BuenosAires'}}>Update share images</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </ScrollView>
            );
    }
}

const styles = StyleSheet.create({

    label: {
        paddingLeft:5,
        color:'#878787',
        fontFamily: 'BuenosAires'
    },

    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },

    textInput: {
        color:'black',
        fontSize:16,
        // marginTop:-10
    },
    linear: {
        height:180,
        alignItems:'flex-end',
        paddingTop:10,
        paddingRight:10
    },
    backgroundVideo: {
        position: 'absolute',
        top: 5,
        left: 5,
        bottom: 5,
        right: 5,
    },
    gridItem: {
        margin:5
    },
    gridView: {
        marginTop: hp(2),
        height: 100,
        // width:'90%',
        flex: 1
    },
    gridImage: {
        resizeMode: "cover",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        borderRadius:5,
        height: 100,
        width: wp(29)
    },
    row: {
        borderBottomWidth:0.5,
        borderBottomColor:'#808080',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20
    },
    item: {
        flexDirection:'row',
        paddingVertical:10,
        backgroundColor:'white',
        borderBottomColor:'grey',
        borderBottomWidth: 0.7
    },
    save_btn: {
        width:'70%',
        height:40,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#35197c'
    },

    TextStyle: {
        color: '#fff',
        textShadowColor: '#ddd',
        textShadowOffset: {width: -1, height: 1},
        fontSize: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#37A000'
    },

    colorPrimaryViewLinearGradient: {
        height: 100
    }

});

Home.propTypes = {
    login: func,
    select_style: func,
    users: object,
  };

  const mapDispatchToProps = dispatch => ({
    login: (email, password) => dispatch(login(email, password)),
    select_style: (style) => dispatch(select_style(style)),
      updateShareImages: (id, share_images) => dispatch(updateShareImages(id, share_images))
  });

  const mapStateToProps = (state) => ({
    users: state.users.users,
  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Home);
