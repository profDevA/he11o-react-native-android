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
import axios from "axios";
import { share } from "./../../reducer/share";
// import { users } from "./../../reducer/share";
import * as RootNavigation from './../../navigation/RootNavigation.js';

class ShareDetails extends React.Component {
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
        // const { users } = this.props
        // this.setState({
        //     name: users.display_name,
        //     mobile: users.mobile,
        //     email: users.user_email
        // })
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

    share(){
        
        const {email, name, mobile, surname} = this.state
        if(name == ''){
            this.setState({name_valid:true})
        }else if(mobile == ''){
            this.setState({mobile_valid:true})
        }else if(email == ''){
            this.setState({email_valid:true})
        }else{
            if(!this.validate(email)){
                Alert.alert("Error", "Email is not correct.");
                return;
            }
            const fd = new FormData();
            fd.append("name", name);
            fd.append("surname", surname);
            fd.append("email", email);
            fd.append("mobile_num", mobile);

            this.setState({progressVisible:true})
            axios.post('https://he11o.com/id/api/share.php', fd,
            {
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                console.log(response)
                this.setState({progressVisible: false})
                if (response.data.status == 200) {
                    const { share } = this.props
                    share(email)
                    RootNavigation.navigate('sharetab');
                } else {
                    Alert.alert("Error", JSON.stringify(response.data.result))

                }
            }).catch(err => {
                console.log('err')
            })
        }
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
                <SafeAreaView style={{backgroundColor:'white'}}>
                    <View>
                        <View style={{height:50, alignItems:'center', justifyContent:'center'}}>
                            <Text style={{fontFamily: 'BuenosAires'}}>Enter Details</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('sharetab')} style={{position:'absolute', top:15, right:15}}>
                                <Mat name="close" color={"#A2A6A8"} size={20}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor:'#F2F2F2', height:'100%', paddingTop:20}}>
                            
                            <View style={{marginRight:10, marginLeft:10, backgroundColor:'white'}}>
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
                                        style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                        placeholderStyle={{fontFamily: 'BuenosAires'}}
                                    />
                                
                                </View>
                                {this.state.name_valid && (
                                    <View style={{marginLeft:10, marginRight:10, backgroundColor:'white'}}>
                                        <Text style={{color:'red', marginLeft:15, fontFamily: 'BuenosAires'}}>Please must input name</Text>
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
                                        style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                        placeholderStyle={{fontFamily: 'BuenosAires'}}
                                    />
                                </View>
                                <View style={styles.row}>
                                    <TextInput
                                        name="mobile"
                                        placeholder="Mobile Number"
                                        placeholderTextColor="#ABABAB"
                                        returnKeyType="next"
                                        onChangeText={value =>
                                            this.setState({mobile: value, mobile_valid:false})
                                        }
                                        style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                        placeholderStyle={{fontFamily: 'BuenosAires'}}
                                    />
                                </View>
                                {this.state.mobile_valid && (
                                    <View style={{marginLeft:10, marginRight:10, backgroundColor:'white'}}>
                                        <Text style={{color:'red', marginLeft:15, fontFamily: 'BuenosAires'}}>Please must input mobile</Text>
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
                                        style={[styles.textInput, {fontFamily: 'BuenosAires'}]}
                                        placeholderStyle={{fontFamily: 'BuenosAires'}}
                                        autoCapitalize="none"
                                    />
                                </View>
                                {this.state.email_valid && (
                                    <View style={{marginLeft:10, marginRight:10, backgroundColor:'white'}}>
                                        <Text style={{color:'red', marginLeft:15, fontFamily: 'BuenosAires'}}>Please must input email</Text>
                                    </View>

                                ) }
                             </View>
                            <View style={{height:90, width:'100%', position:'absolute', bottom:'25%'}}>
                                <TouchableOpacity onPress={()=> this.share()} style={styles.save_btn}>
                                    <Text style={{color:'white', fontFamily: 'BuenosAires'}}>SAVE DETAILS</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </View>
                </SafeAreaView>
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
        paddingTop:Platform.OS=='ios'?25:5,
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


ShareDetails.propTypes = {
    share: func,
    share_data: object,
    progressVisible: bool
  };
  
  const mapDispatchToProps = dispatch => ({
    share: (email) => dispatch(share(email)),
  });
  
  const mapStateToProps = ( state ) => ({
    users: state.users,
    share_data: state.share,
    progressVisible: state.share.progressVisible
  });
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ShareDetails);