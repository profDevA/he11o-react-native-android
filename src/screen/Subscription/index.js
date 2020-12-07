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
  FlatList,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { func, string, bool, object } from "prop-types";
import { connect } from "react-redux";
import Mat from 'react-native-vector-icons/MaterialIcons';
import Ion from 'react-native-vector-icons/Ionicons';
import * as RootNavigation from './../../navigation/RootNavigation.js';
import axios from "axios";

import RNIap, {
    InAppPurchase,
    PurchaseError,
    SubscriptionPurchase,
    acknowledgePurchaseAndroid,
    consumePurchaseAndroid,
    finishTransaction,
    finishTransactionIOS,
    purchaseErrorListener,
    purchaseUpdatedListener,
} from 'react-native-iap';


let purchaseUpdateSubscription;
let purchaseErrorSubscription;
const itemSubs = Platform.select({
    ios: [
        'com.he11o.selfsubscription',
    ],
    android: [
        'com.he11o.selfsubscription', // subscription
    ],
});

class Subscription extends React.Component {
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
        digitalCards: [],
        gridUrl: [
            { id: 0, name: 'Rick Smith', email: 'rick_smith@samsampleco.com', price: '$4.95/month' },
            { id: 1, name: 'Jeny White', email: 'jeny_white@samsampleco.com', price: '$4.95/month' },
          
        ],
        isPurchased:false,
      }
    }

    componentDidMount() {
        console.log('GET PRODUCTS HERE');

        this.getDigitalCards();

        try {
            const result = RNIap.initConnection().then(conn =>{
                console.log('result', result);
                this.getSubscriptions();
                // this.getProducts();
                this.getAvailablePurchases();

                purchaseUpdateSubscription = purchaseUpdatedListener(
                    async (purchase) => {
                        const receipt = purchase.transactionReceipt;
                        if (receipt) {
                            this.successMonthlySubscriptoin();
                            try {
                                if (Platform.OS === 'ios') {
                                    finishTransactionIOS(purchase.transactionId);
                                } else if (Platform.OS === 'android') {
                                    // If consumable (can be purchased again)
                                    consumePurchaseAndroid(purchase.purchaseToken);
                                    // If not itemS
                                    acknowledgePurchaseAndroid(purchase.purchaseToken);
                                }
                                const ackResult = await finishTransaction(purchase);
                            } catch (ackErr) {
                                console.warn('ackErr', ackErr);
                            }
                            
                            this.setState({ receipt }, () => this.goNext());
                        }
                    },
                );
        
                purchaseErrorSubscription = purchaseErrorListener(
                    (error) => {
                        console.log('purchaseErrorListener', error);
                        Alert.alert('Error', JSON.stringify(error));
                    },
                );
            });
            
        } catch (err) {
            console.warn(err.code, err.message);
        }
    }

    successMonthlySubscriptoin() {
        this.setState({isPurchased: true});
    }

    getSubscriptions = async () => {
        try {
            const products = await RNIap.getSubscriptions(itemSubs);
            console.log('Subscriptions', products);

            // Alert.alert('getSubscriptions', JSON.stringify(products[0]));
            this.setState({ productList: products });
        } catch (err) {
            console.warn(err.code, err.message);
        }
    };

    purchaseMonthly = async () => {
        try {

            // this.successMonthlySubscriptoin();
            this.requestSubscription('com.he11o.selfsubscription');
        } catch (err) {
            console.warn(err.code, err.message);
        }
    };

    requestSubscription = async (sku) => {
        try {
            await RNIap.requestSubscription(sku);
        } catch (err) {
            Alert.alert('', err.message);
        }
    };

    getAvailablePurchases = async () => {
        try {
            console.info(
                'Get available purchases (non-consumable or unconsumed consumable)',
            );
            const purchases = await RNIap.getAvailablePurchases();
            console.info('Available purchases :: ', purchases);
            if (purchases && purchases.length > 0) {
                this.successMonthlySubscriptoin();
                // this.setState({
                //     availableItemsMessage: `Got ${purchases.length} items.`,
                //     receipt: purchases[0].transactionReceipt,
                // });
            }
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert('', err.message);
        }
    };

    getDigitalCards() {
        const fd = new FormData();
        const { users } = this.props
        fd.append("id", users.id);
        this.setState({ progressVisible: true })
        axios.post('https://he11o.com/id/api/iapdata.php', fd,
            {
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                console.log('iapdata',response.data.result);
                this.setState({ progressVisible: false })

                if (response.data.status == 200) {
                    this.setState({ digitalCards: response.data.result })
                } else {
                    Alert.alert('', JSON.stringify(response.data.result))
                }
            }).catch(err => {
                console.log('err', err)
            })
    }

    delete() {
        Alert.alert(
            "Confirm Cancellation", 
            "The card will be deleted and user will be logged out of the app.",
            [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
        )
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
                            <Text style={{fontFamily: 'BuenosAires-Regular'}}>Subscription</Text>
                            <TouchableOpacity onPress={() => RootNavigation.navigate('setting')} style={{position:'absolute', top:15, right:15}}>
                                <Mat name="close" color={"#A2A6A8"} size={20}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor:'#F2F2F2', height:'100%'}}>
                            <Text style={{margin:10, color:'#BCBCBC', fontFamily: 'BuenosAires-Regular'}}>YOUR SUBSCRIPTION</Text>
                            <View style={{height:100, backgroundColor:'white'}}>
                                <View style={{flexDirection:'row', paddingLeft:20, paddingTop:10}}>
                                    <View style={{backgroundColor:'#DFDEDE', width:70, height:70, borderRadius:10}}>
                                        <Image 
                                            source={{uri: users.user_url==''?this.state.imageUrl:'https://he11o.com/id/api/'+users.user_url}}
                                            style={{width:70, height:70, borderRadius:10}}/>
                                        
                                    </View>
                                    <View style={{marginLeft:10, marginTop: 8}}>
                                        <Text style={{color:'black', fontSize:18, fontFamily: 'BuenosAires-Regular'}}>{users.user_nicename+ ' ' +users.display_name}</Text>
                                        <Text style={{color:'#999999', fontSize:12, fontFamily: 'BuenosAires-Regular'}}>{users.campany}</Text>

                                        { this.state.isPurchased === false ?  (
                                            <TouchableOpacity onPress={() => this.purchaseMonthly()}>
                                                <Text style={{color:'#337FF5', fontSize:13, fontFamily: 'BuenosAires-Regular'}}>$5.99/month</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <Text style={{color:'#bbbbbbbb', fontSize:13, fontFamily: 'BuenosAires-Regular'}}>$5.99/month</Text>
                                        )}                                        


                                    </View>
                                    <TouchableOpacity onPress={() => this.getAvailablePurchases()} style={{position:'absolute', right:15, top:35}}>
                                        <Text style={{color:'#337FF5', fontSize:13}}>Restore</Text>
                                    </TouchableOpacity>
                                    
                                    
                                </View>
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
        // borderBottomWidth:0.5, 
        // borderBottomColor:'#808080', 
        backgroundColor:'white',
        marginLeft:10,
        marginRight:10,
        paddingTop:5,
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


Subscription.propTypes = {
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
  )(Subscription);