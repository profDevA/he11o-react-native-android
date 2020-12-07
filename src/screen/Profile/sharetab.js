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
  FlatList,
  Button,
  Platform,

} from "react-native";
import { Actions } from "react-native-router-flux";
import Ion from 'react-native-vector-icons/Ionicons';
import { func, string, bool, object, array } from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { saveShare, share } from "./../../reducer/share";
import * as RootNavigation from './../../navigation/RootNavigation.js';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from "react-native-elements";
class ShareTab extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        imageUrl:
            "http://www.cybecys.com/wp-content/uploads/2017/07/no-profile.png",
        data: [
            { id: 0, imageUrl: "http://www.cybecys.com/wp-content/uploads/2017/07/no-profile.png", name: 'Rick Smith', date:'10/08/2020', mobile:'123 123 123', email: 'rick_smith@samsampleco.com'},
            { id: 1, imageUrl: "http://www.cybecys.com/wp-content/uploads/2017/07/no-profile.png", name: 'Jeny White', date:'10/08/2020', mobile:'123 123 123', email: 'jeny_white@samsampleco.com'},
        ]
      }
    }

    UNSAFE_componentWillMount(){
        // const { share } =this.props
        // share('admin@admin.com')
        var email = 'admin@admin.com';
        const fd = new FormData();
        fd.append("email", email);
        this.setState({progressVisible:true})
        axios.post('https://he11o.com/id/api/sharedata.php', fd,
        {
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(response => {
            console.log(response.data.result);
            this.setState({progressVisible:false})

            if (response.data.status == 200) {
                this.setState({data: response.data.result})
            } else {
                Alert.alert("Error", JSON.stringify(response.data.result))

            }
        }).catch(err => {
            console.log('err')
        })
    }

    del(data, index){
        // return
        const fd = new FormData();
        fd.append("id", data.id);
        this.setState({progressVisible:true})
        axios.post('https://he11o.com/id/api/deldata.php', fd,
        {
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(response => {
            this.setState({progressVisible:false})

            if (response.data.status == 200) {
                this.setState({data: response.data.result});
                let { share_data: { share } } = this.props;
                share.splice(index, 1);
                this.props.saveShare(share);
            } else {
                Alert.alert("Error", JSON.stringify(response.data.result));
            }
        }).catch(err => {
            console.log(err);
            console.log('err')
        })
    }

    render() {
        const { progressVisible, share_data} =this.props
        console.log(share_data)
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
                    <View style={{height:50, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontFamily: 'BuenosAires'}}>Your Shares</Text>
                        <TouchableOpacity onPress={() => RootNavigation.navigate('sharedetails')} style={{position:'absolute', right:15, top:10}}>
                            <Ion name="add" size={25} color="#35197c" />
                        </TouchableOpacity>
                    </View>
                    <View style={{backgroundColor:'#F2F2F2', height:'95%'}}>
                            <FlatList
                                data={share_data.share.length == 0? this.state.data: share_data.share}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <View style={{backgroundColor:'white', flexDirection:'row', marginLeft:10, marginRight:10, marginTop:10, padding:10, justifyContent: 'center'}}>
                                        <View style={{alignItems:'center',justifyContent:'center', width: 50}}>
                                            {item.images_url ?
                                                <Image source={{uri: item.images_url==''?this.state.imageUrl:item.images_url}} style={{width:'100%', height:50}} />
                                            :
                                                <View style={{width:'100%', height:50, borderRadius: 100, backgroundColor: '#A2A6A8', justifyContent: 'center', alignItems: 'center'}}>
                                                    <Text style={{fontSize: 16, color: '#FFFFFF', textTransform: 'uppercase'}}>{`${item.name?item.name[0]:''}${item.surname?item.surname[0]:''}`}</Text>
                                                </View>
                                            }
                                        </View>
                                        <View style={[styles.row, {flex: 1}]}>
                                            <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10}}>
                                                <Text style={{paddingTop:5, fontSize:15, fontFamily: 'BuenosAires'}}>{item.name+' '+item.surname}</Text>
                                                <Text style={{color:'#999999', paddingTop:5, fontSize:12, fontFamily: 'BuenosAires_Light'}}>{item.create_at}</Text>
                                            </View>
                                            <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10}}>
                                                <Text style={[styles.label, {fontFamily: 'BuenosAires'}]}>{item.mobile}</Text>
                                                <Text style={{color:'#999999', fontSize:12, marginLeft:20, fontFamily: 'BuenosAires'}}>{item.email}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={{width:25, alignItems:'center', justifyContent:'center'}} onPress={()=> this.del(item, index)}>
                                            <Image source={{uri: 'asset:/cross.png', cache: 'force-cache'}} style={{width:20, height:20}} />
                                        </TouchableOpacity>
                                    </View>

                                    )}
                                    keyExtractor={item => item.id.toString()}
                                    extraData={this.state}
                            />
                    </View>

                </SafeAreaView>
            );
    }
}

const styles = StyleSheet.create({
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
    label: {
        color:'#999999',
        fontSize:12
    },

    row: {
        paddingTop:10,
        paddingBottom:10
    },

});

ShareTab.propTypes = {
    share: func,
    share_data: object,
    progressVisible: bool
  };

  const mapDispatchToProps = dispatch => ({
    share: (email) => dispatch(share(email)),
    saveShare: (share) => dispatch(saveShare({share})),
  });

  const mapStateToProps = ( state ) => ({
    share_data: state.share,
    progressVisible: state.share.progressVisible
  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ShareTab);
