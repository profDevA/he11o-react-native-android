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
//   TextInput,
//   KeyboardAvoidingView
} from "react-native";
import { Actions } from "react-native-router-flux";

export default class Share extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        image: 'aaa',
        headline: '',
        desc: '',
        youtube: '',
    
      }
    }

    save(){
        Actions.kind();
    }
    render() {
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
                            <Text style={{fontFamily: 'BuenosAires'}}>Select Images</Text>
                        </View>
                        <View style={{height:150, width:'90%', alignSelf:'center'}}>
                            {/* <FlatGrid
                                itemDimension={wp(20)}
                                items={this.state.galleryPhoto}
                                style={styles.gridView}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        style={styles.gridItem}
                                        onPress={() => this.onPressMediaItem(item, index)}
                                    >
                                    {item.url != "" ? (
                                        <Image
                                        source={{ uri: item.url }}
                                        style={styles.gridImage}
                                        />
                                    ) : (
                                        <Image
                                        style={{ height: wp(10), width: wp(10) }}
                                        source={Images.addIcon}
                                        ></Image>
                                    )}
                                    
                                    </TouchableOpacity>
                                )}
                                extraData={this.state}
                            /> */}

                            <TouchableOpacity onPress={()=>Actions.receptment()} style={{width:'100%', height:40, alignItems:'center', justifyContent:'center', borderRadius:10, backgroundColor:'grey'}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Share to List</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'100%', height:40, marginTop:10, alignItems:'center', justifyContent:'center', borderRadius:10, borderColor:'grey', borderWidth:0.5}}>
                                <Text style={{fontFamily: 'BuenosAires'}}>Share with Anyone</Text>
                            </TouchableOpacity>
                        </View>
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
    
});