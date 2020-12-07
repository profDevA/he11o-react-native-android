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
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import Ev from 'react-native-vector-icons/EvilIcons';
import En from 'react-native-vector-icons/Entypo';
import Ant from 'react-native-vector-icons/AntDesign';
import Ion from 'react-native-vector-icons/Ionicons';
import Fa from 'react-native-vector-icons/FontAwesome5';
import Sli from 'react-native-vector-icons/SimpleLineIcons';
import * as Animatable from 'react-native-animatable';
const AnimatedIcon = Animatable.createAnimatableComponent(Ant);
import { func, string, bool, object, number } from "prop-types";
import { connect } from "react-redux";
import { login, select_style } from "./../../../reducer/users";
import LinearGradient from "react-native-linear-gradient";
import MI from 'react-native-vector-icons/MaterialIcons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { IMAGE_BASE_URL } from '../../../globals';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";

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

class NoneUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl:
                "http://www.cybecys.com/wp-content/uploads/2017/07/no-profile.png",
            // videoUrl: 'https://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_10mb.mp4',
            header: true,
            videoUrl: require('./../../../../assets/v1.mp4'),
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
            share_img: ''

        }
    }

    toggleModal( view1 ) {
        this.setState({ visible: view1 });
        if(view1){
            this.setState({height:400})
        }else{
            this.setState({height:30})
        }
    }

    render() {
        const { users } = this.props;
        const urls = users.images_url.split(',');

        if (this.state.progressVisible) {
            return (
                <View style={[styles.containerLoader, styles.horizontal]}>
                    <ActivityIndicator size="large" color="grey"/>
                </View>
            );
        } else
            return (
                <ScrollView style={{backgroundColor:'white'}}>
                    <View>
                        <View style={{height:180}}>
                            {users.header_img ?
                                <ImageBackground source={{uri: IMAGE_BASE_URL+users.header_img}}
                                                style={styles.linear}>
                                    <TouchableOpacity onPress={() => RootNavigation.navigate('updatecard', {email:users.user_email, pass:users.user_pass})} style={{position:'absolute', top:20, right:20}}>
                                        <Ion name="ellipsis-horizontal-circle" size={30} color="white"/>
                                    </TouchableOpacity>
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
                                    <TouchableOpacity onPress={() => RootNavigation.navigate('updatecard', {email:users.user_email, pass:users.user_pass})} style={{position:'absolute', top:20, right:20}}>
                                        <Ion name="ellipsis-horizontal-circle" size={30} color="white"/>
                                    </TouchableOpacity>
                                </LinearGradient>
                            }
                        </View>

                        <View style={{height:220, alignItems:'center', backgroundColor:'#F7F8F9'}}>

                            <View style={{
                                marginVertical:25,
                                width:'90%',
                                shadowColor: 'grey',
                                shadowOpacity: 0.3,
                                shadowOffset: { width: 0, height: 5 },
                                shadowRadius: 2,
                                elevation: 2,
                                marginTop:-30,
                                padding:10,
                                height:170,
                                borderRadius:10,
                                borderColor:'#E0E1E0',
                                borderWidth:0.5,
                                backgroundColor:'white'}}
                            >
                                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
                                    <Text style={{fontSize:18, /* color:'#878787', */ fontFamily: 'BuenosAires'}}>{users.user_nicename+ ' ' +users.display_name}</Text>
                                    <TouchableOpacity>
                                        <Icon name="upload" size={25} color="#4C80C0" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{/* color:'#BCBCBC', */ fontFamily: 'BuenosAires'}}>{users.job_title}</Text>

                                <Text style={{/* color:'#BCBCBC', */ fontFamily: 'BuenosAires'}}>{users.campany}</Text>
                                <View style={{flexDirection:'row', borderTopColor:'#E0E1E0', borderTopWidth:0.5, marginTop:40}}>
                                    <View style={{borderRightColor:'#BCBCBC', borderRightWidth:0.5, width:'33%', height:20, marginTop:10, flex: 1}}>
                                        {/* <TouchableOpacity onPress={() => Linking.openURL('tel:123456')} style={{flexDirection:'row', justifyContent:'center'}}>
                                                <Icon name="mic" size={18} color="#A2A6A8" />
                                                <Text style={styles.label}>CALL</Text>
                                            </TouchableOpacity> */}
                                        <View style={{flexDirection:'row', justifyContent:'center'}}>
                                            <Icon name="mic" size={16} color="#A2A6A8" />
                                            <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>CALL</Text>
                                        </View>
                                    </View>
                                    <View style={{borderRightColor:'#BCBCBC', borderRightWidth:1, width:'33%', height:20, marginTop:10}}>
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
                                    <View style={{height:20, marginTop:10, justifyContent:'center', width:'34%'}}>
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
                            {this.state.visible ?
                                <Text style={{color: "#4C80C0", fontFamily: 'BuenosAires'}}>Hide Card Details</Text>
                            :
                                <Text style={{color: "#4C80C0", fontFamily: 'BuenosAires'}}>View Card Details</Text>
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
                                            <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.card_email == ''?'No data':users.card_email}</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <View style={{flexDirection:'row', width:'40%'}}>
                                                <Sli name="screen-smartphone" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Mobile</Text>
                                            </View>
                                            <Text style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.mobile==''?'No data':users.mobile}</Text>
                                        </View>
                                        <View style={[styles.item, {borderBottomWidth: 0}]}>
                                            <View style={{flexDirection:'row', width:'40%'}}>
                                                <Ion name="location-outline" color={"#A2A6A8"} size={16} style={{marginLeft:3, marginRight:15, marginVertical: 2}}/>
                                                <Text style={{color: "#A2A6A8", fontFamily: 'BuenosAires'}}>Address</Text>
                                            </View>
                                            <Text numberOfLines={1} style={{width:'60%', fontFamily: 'BuenosAires'}}>{users.street==''?'No data':users.address}</Text>
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
                            <View style={{width:'100%', alignItems:'center', justifyContent:'center', paddingHorizontal: 10, paddingTop: this.state.visible ? 15 : 0}}>
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
                        {users.images_url !='' && (
                            <View style={{padding:10, alignItems:'center', flexDirection: 'row', flexWrap: 'wrap'}}>
                                {urls.map((item, index) =>
                                    item != "" ? (
                                        <Image
                                            key={index}
                                            source={{uri: 'https://he11o.com/id/api/'+item}}
                                            style={{flexBasis: '32%', height: 150, marginRight: '1%', marginBottom: '1%'}}
                                        />
                                    ) : (
                                        <React.Fragment key={index}></React.Fragment>
                                    )
                                )}
                            </View>
                        )}

                        <View style={{ backgroundColor:'white', flexDirection:'row', justifyContent:'flex-end', height:50, paddingRight:20}}>
                            <TouchableOpacity>
                                <Ion name="ellipsis-horizontal-circle" size={30} color="grey"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            );
    }
}

const styles = StyleSheet.create({

    label: {
        paddingLeft:5,
        color:'#878787'
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

NoneUser.propTypes = {
    login: func,
    select_style: func,
    users: object,
};

const mapDispatchToProps = dispatch => ({
    login: (email, password) => dispatch(login(email, password)),
    select_style: (style) => dispatch(select_style(style)),
});

const mapStateToProps = (state) => ({
    users: state.users.users,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NoneUser);
