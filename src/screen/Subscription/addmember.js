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

class AddMember extends React.Component {
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
            name_valid: false,
            productList: {},
            mobile_valid: false,
            email_valid: false,
            text: 'http://facebook.github.io/react-native/'

        }
    }

    async componentDidMount() {
        const { users } = this.props;
        await this.setState({ user_id: users.users.id });

        // try {
        //     const result = await RNIap.initConnection();
        //     console.log('result', result);
        //     this.getSubscriptions();
        //     // this.getProducts();
        //     // this.getAvailablePurchases();
        // } catch (err) {
        //     console.warn(err.code, err.message);
        // }

        // purchaseUpdateSubscription = purchaseUpdatedListener(
        //     async (purchase) => {
        //         const receipt = purchase.transactionReceipt;
        //         if (receipt) {
        //             try {
        //                 if (Platform.OS === 'ios') {
        //                     finishTransactionIOS(purchase.transactionId);
        //                 } else if (Platform.OS === 'android') {
        //                     // If consumable (can be purchased again)
        //                     consumePurchaseAndroid(purchase.purchaseToken);
        //                     // If not itemS
        //                     acknowledgePurchaseAndroid(purchase.purchaseToken);
        //                 }
        //                 const ackResult = await finishTransaction(purchase);
        //             } catch (ackErr) {
        //                 console.warn('ackErr', ackErr);
        //             }

        //             this.setState({ receipt }, () => this.goNext());
        //         }
        //     },
        // );

        // purchaseErrorSubscription = purchaseErrorListener(
        //     (error) => {
        //         console.log('purchaseErrorListener', error);
        //         Alert.alert('purchase error', JSON.stringify(error));
        //     },
        // );
    }

    componentWillUnmount() {
        if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
        }
        RNIap.endConnection();
    }

    goNext = () => {
        // Alert.alert('Receipt', this.state.receipt);
        const { email, name, mobile, surname, user_id, receipt } = this.state

        const fd = new FormData();
        fd.append("user_id", user_id);
        fd.append("name", name);
        fd.append("surname", surname);
        fd.append("email", email);
        fd.append("mobile_num", mobile);
        fd.append("receipt_data", JSON.stringify(receipt));

        this.setState({ progressVisible: true })
        axios.post('https://he11o.com/id/api/iap.php', fd,
            {
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                console.log(response)
                this.setState({ progressVisible: false })
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
    };

    getProducts = async () => {
        try {
            const products = await RNIap.getProducts(itemSubs);
            console.log('IAP products', products);
            Alert.alert('getProducts', products[0]);
            this.setState({ productList: products[0] });
        } catch (err) {

            Alert.alert('getProducts error', err.message);
            console.warn(err.code, err.message);
        }
    };

    getSubscriptions = async () => {
        try {
            const products = await RNIap.getSubscriptions(itemSubs);
            console.log('Subscriptions', products);

            Alert.alert('getSubscriptions', JSON.stringify(products[0]));
            this.setState({ productList: products });
        } catch (err) {
            console.warn(err.code, err.message);
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
                this.setState({
                    availableItemsMessage: `Got ${purchases.length} items.`,
                    receipt: purchases[0].transactionReceipt,
                });
            }
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert(err.message);
        }
    };

    requestProduct = async (sku) => {
        try {
            RNIap.requestPurchase(sku);
        } catch (err) {
            Alert.alert(err.message);
        }
    };

    requestSubscription = async (sku) => {
        try {
            RNIap.requestSubscription(sku);
        } catch (err) {
            Alert.alert(err.message);
        }
    };

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

    share() {

        const { email, name, mobile } = this.state
        if (name == '') {
            this.setState({ name_valid: true })
        } else if (mobile == '') {
            this.setState({ mobile_valid: true })
        } else if (email == '') {
            this.setState({ email_valid: true })
        } else {
            if (!this.validate(email)) {
                Alert.alert("Error", "Email is not correct.");
                return;
            }

            // this.requestSubscription('com.he11o.profile_digital.card');
            this.requestProduct('com.he11o.digital_card');
        }
    }

    render() {
        const { users } = this.props
        const product = this.state.productList;
        if (this.state.progressVisible) {
            return (
                <View style={[styles.containerLoader, styles.horizontal]}>
                    {/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
                    <ActivityIndicator size="large" color="grey" />
                </View>
            );
        } else
            return (
                <SafeAreaView style={{ backgroundColor: 'white' }}>
                    <View>
                        <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'BuenosAires-Regular' }}>Add Staff Member</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('subscription')} style={{ position: 'absolute', top: 15, right: 15 }}>
                                <Mat name="close" color={"#A2A6A8"} size={20} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: '#F2F2F2', height: '100%', paddingTop: 20 }}>
                            <Text style={{ padding: 10, color: 'grey', fontFamily: 'BuenosAires-Regular' }}>Staff Member Details</Text>
                            <View style={styles.row}>
                                <TextInput
                                    name="name"
                                    placeholder="Name"
                                    placeholderTextColor="#ABABAB"
                                    value={this.state.name}
                                    returnKeyType="next"
                                    onChangeText={value =>
                                        this.setState({ name: value, name_valid: false })
                                    }
                                    style={[styles.textInput, { fontFamily: 'BuenosAires-Regular' }]}
                                    placeholderStyle={{ fontFamily: 'BuenosAires-Regular' }}
                                />

                            </View>
                            {this.state.name_valid && (
                                <View style={{ marginLeft: 10, marginRight: 10, backgroundColor: 'white' }}>
                                    <Text style={{ color: 'red', marginLeft: 15, fontFamily: 'BuenosAires-Regular' }}>Please must input name</Text>
                                </View>

                            )}
                            <View style={styles.row}>
                                <TextInput
                                    name="surname"
                                    placeholder="Surname"
                                    placeholderTextColor="#ABABAB"
                                    returnKeyType="next"
                                    value={this.state.surname}
                                    onChangeText={value =>
                                        this.setState({ surname: value })
                                    }
                                    style={[styles.textInput, { fontFamily: 'BuenosAires-Regular' }]}
                                    placeholderStyle={{ fontFamily: 'BuenosAires-Regular' }}
                                />
                            </View>
                            <View style={styles.row}>
                                <TextInput
                                    name="mobile"
                                    placeholder="Mobile Number"
                                    placeholderTextColor="#ABABAB"
                                    returnKeyType="next"
                                    onChangeText={value =>
                                        this.setState({ mobile: value, mobile_valid: false })
                                    }
                                    style={[styles.textInput, { fontFamily: 'BuenosAires-Regular' }]}
                                    placeholderStyle={{ fontFamily: 'BuenosAires-Regular' }}
                                />
                            </View>
                            {this.state.mobile_valid && (
                                <View style={{ marginLeft: 10, marginRight: 10, backgroundColor: 'white' }}>
                                    <Text style={{ color: 'red', marginLeft: 15, fontFamily: 'BuenosAires-Regular' }}>Please must input mobile</Text>
                                </View>

                            )}
                            <View style={styles.row}>
                                <TextInput
                                    name="email"
                                    placeholder="Email"
                                    placeholderTextColor="#ABABAB"
                                    returnKeyType="next"
                                    value={this.state.email}
                                    onChangeText={value =>
                                        this.setState({ email: value, email_valid: false })
                                    }
                                    style={[styles.textInput, { fontFamily: 'BuenosAires-Regular' }]}
                                    placeholderStyle={{ fontFamily: 'BuenosAires-Regular' }}
                                    autoCapitalize="none"
                                />
                            </View>
                            {this.state.email_valid && (
                                <View style={{ marginLeft: 10, marginRight: 10, backgroundColor: 'white' }}>
                                    <Text style={{ color: 'red', marginLeft: 15, fontFamily: 'BuenosAires-Regular' }}>Please must input email</Text>
                                </View>

                            )}

                            <View style={{ paddingHorizontal: 30, paddingTop: 10, paddingBottom: 10, alignItems: 'center', width: '100%' }}>
                                <Text style={{ fontFamily: 'BuenosAires-Regular' }}>Your staff member will receive</Text>
                                <Text style={{ fontFamily: 'BuenosAires-Regular' }}>a verification email advising them</Text>
                                <Text style={{ fontFamily: 'BuenosAires-Regular' }}>how to set up their card.</Text>
                            </View>
                            <View style={{ paddingHorizontal: 30, paddingTop: 0, alignItems: 'center', width: '100%' }}>
                                <Text style={{ color: 'grey', fontFamily: 'BuenosAires-Regular' }}>You are about to purchase an additional</Text>
                                <Text style={{ color: 'grey', fontFamily: 'BuenosAires-Regular' }}>he11o digital business card. You are</Text>
                                <Text style={{ color: 'grey', fontFamily: 'BuenosAires-Regular' }}>subscribing to a monthly</Text>
                                <Text style={{ color: 'grey', fontFamily: 'BuenosAires-Regular' }}>subscription of {product.localizedPrice}</Text>
                            </View>

                            <View style={{ height: 90, width: '100%', position: 'absolute', bottom: '25%' }}>
                                <TouchableOpacity onPress={() => this.share()} style={styles.save_btn}>
                                    <Text style={{ color: 'white', fontWeight: '700', fontFamily: 'BuenosAires-Regular' }}>ADD STAFF MEMBER</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.share()} style={{ width: '40%', marginTop: 20, alignItems: 'center', alignSelf: 'center' }}>
                                    <Text style={{ color: 'grey', fontFamily: 'BuenosAires-Regular' }}>Cancel</Text>
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
        paddingTop: 5,
        // paddingLeft:5,
        color: '#9D9D9D',
        fontSize: 12
    },

    textInput: {
        color: 'black',
        fontSize: 16,
        // marginTop:-10
    },
    row: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#808080',
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 10,
        paddingTop: Platform.OS == 'ios' ? 25 : 5,
        paddingBottom: 5,
        paddingLeft: 20
    },
    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },
    save_btn: {
        width: '70%',
        height: 40,
        borderRadius: 20,
        marginTop: 20,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#35197c'
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


AddMember.propTypes = {
    share: func,
    share_data: object,
    progressVisible: bool
};

const mapDispatchToProps = dispatch => ({
    share: (email) => dispatch(share(email)),
});

const mapStateToProps = (state) => ({
    users: state.users,
    share_data: state.share,
    progressVisible: state.share.progressVisible
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddMember);