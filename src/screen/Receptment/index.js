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
  KeyboardAvoidingView
} from "react-native";
import { Actions } from "react-native-router-flux";
import { RadioButton } from 'react-native-paper';
import { Icon1 } from "react-native-vector-icons/Feather";

export default class Receptment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        progressVisible: false,
        message: '',
        checked:'first',

      }
    }

    save(){
        Actions.kind();
    }

    setChecked(val){
        this.setState({
            checked: val
        })
    }

    render() {
        const data = [
            {
              label: 'data 1'
             },
             {
              label: 'data 2'
             }
            ];
            
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
                            <Text style={{fontFamily: 'BuenosAires'}}>Select Receptment</Text>
                        </View>
                        <View style={{height:50, width:'100%', alignItems:'flex-end', justifyContent:'center', borderTopColor:'grey', borderTopWidth:1, borderBottomColor:'grey', borderBottomWidth:0.5}}>
                            <TouchableOpacity>
                                <Text style={{marginRight:10, color:'grey', fontFamily: 'BuenosAires'}}>Select All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <Text style={{fontFamily: 'BuenosAires'}}>Sample</Text>
                            <View style={styles.row_child}>
                                <View style={{flexDirection:'row', justifyContent:'center'}}>
                                    {/* <Icon1 name="mail" size={18} color="#900" /> */}
                                    <Text style={{paddingTop:5, color:'grey', fontFamily: 'BuenosAires'}}>someone@outlook.com</Text>
                                </View>
                                <RadioButton
                                    value="first"
                                    status={ this.state.checked === 'first' ? 'checked' : 'unchecked' }
                                    onPress={() => this.setChecked('first')}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={{fontFamily: 'BuenosAires'}}>Sample</Text>
                            <View style={styles.row_child}>
                                <View style={{flexDirection:'row', justifyContent:'center'}}>
                                    {/* <Icon name="phone-call" size={18} color="#900" /> */}
                                    <Text style={{paddingTop:5, color:'grey', fontFamily: 'BuenosAires'}}>someone@outlook.com</Text>
                                </View>
                                <RadioButton
                                    value="second"
                                    status={ this.state.checked === 'second' ? 'checked' : 'unchecked' }
                                    onPress={() => this.setChecked('second')}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={{fontFamily: 'BuenosAires'}}>Sample</Text>
                            <View style={styles.row_child}>
                                <View style={{flexDirection:'row', justifyContent:'center'}}>
                                    {/* <Icon name="phone-call" size={18} color="#900" /> */}
                                    <Text style={{paddingTop:5, color:'grey', fontFamily: 'BuenosAires'}}>someone@outlook.com</Text>
                                </View>
                                <RadioButton
                                    value="third"
                                    status={ this.state.checked === 'third' ? 'checked' : 'unchecked' }
                                    onPress={() => this.setChecked('third')}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={{fontFamily: 'BuenosAires'}}>Sample</Text>
                            <View style={styles.row_child}>
                                <View style={{flexDirection:'row', justifyContent:'center'}}>
                                    {/* <Icon name="phone-call" size={18} color="#900" /> */}
                                    <Text style={{paddingTop:5, color:'grey', fontFamily: 'BuenosAires'}}>someone@outlook.com</Text>
                                </View>
                                <RadioButton
                                    value="fourth"
                                    status={ this.state.checked === 'fourth' ? 'checked' : 'unchecked' }
                                    onPress={() => this.setChecked('fourth')}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={{color:'grey', fontSize:14, fontFamily: 'BuenosAires'}}>Your message</Text>
                            <TextInput
                                name="message"
                                placeholder="Please enter your message"
                                placeholderTextColor="#ABABAB"
                                returnKeyType="next"
                                multiline={true}
                                numberOfLines = {2}
                                onChangeText={value =>
                                    this.setState({msg: value})
                                }
                                style={{fontFamily: 'BuenosAires'}}
                                placeholderStyle={{fontFamily: 'BuenosAires'}}
                                // style={styles.textInput}
                            />
                        </View>
                        <View style={{height:150, width:'90%', alignSelf:'center'}}>
                            

                            <TouchableOpacity style={{width:'100%', height:40, marginTop:20, alignItems:'center', justifyContent:'center', borderRadius:10, backgroundColor:'grey'}}>
                                <Text style={{color:'white', fontFamily: 'BuenosAires'}}>Send</Text>
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
    
    textInput: {
        color:'black',
        fontSize:16,
        // marginTop:-10
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
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    
    row: {
        padding:10, 
        borderBottomColor:'grey', 
        borderBottomWidth:0.5
    },

    row_child: {
        flexDirection:'row', 
        alignItems:'stretch', 
        justifyContent:'space-between'
    },
    save_btn: {
        width:'80%', 
        height:40, 
        borderRadius:10, 
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor:'#999999'
    }

});