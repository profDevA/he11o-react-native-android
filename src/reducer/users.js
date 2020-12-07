import * as React from 'react';
import {
    Alert,
    AsyncStorage
} from "react-native";
import axios from "axios";
import * as RootNavigation from './../navigation/RootNavigation.js';
import RNFetchBlob from 'rn-fetch-blob'
import {share} from "./share";
import { read } from 'react-native-fs';

const SET_USER = "SET_USER";
const LODING = "LOADING";
const LOGOUT = "LOGOUT";
const SET_IMAGES = 'SET_IMAGES';

const initialState = {
    progressVisible: false,
    email: '',
    password: '',
    name: '',
    surname: '',
    org: '',
    job: '',
    tel: '',
    mobile: '',
    web: '',
    address: '',
    street: '',
    suburb: '',
    city: '',
    state: '',
    country: '',
    code: '',
    skype: '',
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    user_url: '',
    style: '',
    snapchat: '',
    headline: '',
    descriptions: '',
    youtube: '',
    header_img: '',
    users: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_IMAGES:
            return {
                ...state,
                users: {
                    ...state.users,
                    images_url: action.images_url
                }
            }
        case SET_USER:
            return {
                ...state,
                users: {
                    id: action.payload.ID,
                    abn: action.payload.abn,
                    user_email: action.payload.user_email,
                    campany: action.payload.campany,
                    card_email: action.payload.card_email,
                    descriptions: action.payload.descriptions,
                    display_name: action.payload.display_name,
                    headline: action.payload.headline,
                    images_url: action.payload.images_url,
                    images_share_url: action.payload.images_share_url,
                    job_title: action.payload.job_title,
                    mobile: action.payload.mobile,
                    web_url: action.payload.web_url,
                    address: action.payload.address,
                    street: action.payload.street,
                    suburb: action.payload.suburb,
                    city: action.payload.city,
                    state: action.payload.state,
                    country: action.payload.country,
                    post_code: action.payload.post_code,
                    user_nicename: action.payload.user_nicename,
                    telephone: action.payload.telephone,
                    skype: action.payload.skype,
                    twitter: action.payload.twitter,
                    facebook: action.payload.facebook,
                    instagram: action.payload.instagram,
                    linkedin: action.payload.linkedin,
                    snapchat: action.payload.snapchat,
                    user_url: action.payload.user_url,
                    youtube_url: action.payload.youtube_url,
                    style: action.payload.style,
                    header_img: action.payload.header_img,
                    share_message: action.payload.share_message,
                    youtube_video: action.payload.youtube_video,
                }
            };
        case LODING:
            return {
                ...state,
                progressVisible: action.load.progressVisible,
            }

        case LOGOUT:
            return {
                ...state,
                ...initialState,
            }
        default:
            return state;
    }
}

export const setLoading = (progressVisible) => async (dispatch) => {
    const load = { progressVisible };
    dispatch({ type: LODING, load });
}

export const signup = () => async (dispatch, getState) => {


};

export const updateImages = (images_url) => (dispatch) => {
    dispatch({type: SET_IMAGES, images_url})
};

export const updatecard = (id, header_type, header_data, type, data, filename, email, password, name, surname, campany, abn, job, tel, mobile, card_email, web, street, suburb, city, state, country, code, skype, twitter, facebook, instagram, linkedin, snapchat, youtube, Address) => async (dispatch, getState) => {
    try {
        let base_url = 'https://he11o.com/id/api/updatecard.php';
        var real_data = [
            {name:"id", data: id},
            {name:"email", data: email},
            {name:"password", data: password},
            {name:"username", data: name},
            {name:"surname", data: surname},
            {name:"campany", data: campany},
            {name:"abn", data: abn},
            {name:"job_title", data: job},
            {name:"telephone", data: tel},
            {name:"mobile_num", data: mobile},
            {name:"card_email", data: card_email},
            {name:"web_url", data: web},
            {name:"address", data: Address},
            {name:"street", data: street},
            {name:"suburb", data: suburb},
            {name:"city", data: city},
            {name:"state", data: state},
            {name:"country", data: country},
            {name:"code", data: code},
            {name:"skype", data: skype},
            {name:"twitter", data: twitter},
            {name:"facebook", data: facebook},
            {name:"instagram", data: instagram},
            {name:"linkedin", data: linkedin},
            {name:"snapchat", data: snapchat},
            {name:"youtube_url", data: youtube},

        ]
        if(type !=''){
            real_data.push(
                {
                    name: "file",
                    type: type,
                    data: data,
                    filename: filename

                },
            )
        }

        if(header_type !=''){
            real_data.push(
                {
                    name: "file1",
                    type: header_type,
                    data: header_data,
                    filename: "filename"

                },
            )
        }
        console.log('WHAT THE FUCK', real_data);
        const load = {
            progressVisible: true
        }
        dispatch({ type: LODING, load });

        RNFetchBlob.fetch('POST', base_url,{
            Authorization : "Bearer access-token",
            otherHeader : "foo",
            'Content-Type' : 'multipart/form-data',
        }, real_data)
        .then(response => {
            console.log(response.data)
            var obj = JSON.parse(response.data)
            const load = {
                progressVisible: false
            }
            dispatch({ type: LODING, load });

            if(obj.status == 200){
                const payload = obj.result
                console.log("---update card payload---", payload);

                dispatch({ type: SET_USER, payload });

                RootNavigation.navigate('bottomtab', { screen: 'home' });

                return;
            } else{
                // this.setState({ isUploading: false});
                Alert.alert('Error', response.data.message);
            }

        }).catch(err => {
            Alert.alert('Error', 'Error on network');
            console.log(err)
        })

    } catch (error) {

        console.log("error")
    }

};

export const saveUser = (user) => async (dispatch) => {
    dispatch({type: SET_USER, payload: user});
}

export const login = (email, password) => async (dispatch, getState) => {
    try {

        const fd = new FormData();
        fd.append("email", email);
        fd.append("password", password);

        const load = {
            progressVisible: true
        }
        dispatch({ type: LODING, load });

        axios.post('https://he11o.com/id/api/mobile_login.php', fd,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                console.log(response)
                const load = {
                    progressVisible: false
                }
                dispatch({ type: LODING, load });
                if (response.data.status == 200) {
                    const payload = response.data.result
                    console.log("payload", payload);

                    dispatch({ type: SET_USER, payload });
                    // AsyncStorage.setItem("login", "true");
                    RootNavigation.navigate('bottomtab', { screen: 'home' });
                } else {
                    Alert.alert("Error", JSON.stringify(response.data.result))

                }

            }).catch(err => {
                console.log('err')
            })


    } catch (error) {

        console.log("error")
    }

};

export const getUserData = (email, password) => async (dispatch, getState) => {
    try {

        const fd = new FormData();
        fd.append("email", email);
        fd.append("password", password);

        const load = {
            progressVisible: true
        }
        dispatch({ type: LODING, load });

        axios.post('https://he11o.com/id/api/mobile_login.php', fd,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            })
            .then(response => {
                console.log(response)
                const load = {
                    progressVisible: false
                }
                dispatch({ type: LODING, load });
                if (response.data.status == 200) {
                    const payload = response.data.result
                    console.log("payload", payload);

                    dispatch({ type: SET_USER, payload });
                } else {
                    Alert.alert("Error", JSON.stringify(response.data.result))

                }

            }).catch(err => {
            console.log('err')
        })


    } catch (error) {

        console.log("error")
    }

};

export const select_style = (style, id) => async (dispatch) => {
    // console.log(id)
    const fd = new FormData();
    fd.append("id", id);
    fd.append("style", style);

    const load = {
        progressVisible: true
    };
    console.log('-------disptach-------', style, id);
    dispatch({ type: LODING, load });

    axios.post('https://he11o.com/id/api/style.php', fd,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        })
        .then(response => {
            console.log(response)
            const load = {
                progressVisible: false
            }
            dispatch({ type: LODING, load });

            if (response.data.status == 200) {
                const payload = response.data.result

                dispatch({ type: SET_USER, payload });
                RootNavigation.navigate('bottomtab', { screen: 'home' });
            } else {
                Alert.alert("Error", JSON.stringify(response.data.message))
            }

        }).catch(err => {
            console.log('err')
        })

};

// export const updateprofile = (id, headline, desc, type, filename, data, youtube) => async (dispatch) => {

//     let base_url = 'https://he11o.com/id/api/create_profile.php';

//         if(type==''){
//             alert('Please select image.')
//             return;
//         }

//         var real_data = [
//             {name:"id", data: id},
//             {
//                 name: "file",
//                 type: type,
//                 data: data,
//                 filename: "filename"

//             },
//             {name:"submit", data:"ok"}
//         ]
//         if(headline != ''){
//             real_data.push({name:"headline", data: headline})
//         }
//         if(desc != ''){
//             real_data.push({name:"desc", data: desc})
//         }
//         if(youtube !=''){
//             real_data.push({name:"youtube_url", data: youtube})

//         }
//         console.log(real_data)
//         const load = {
//             progressVisible: true
//         }
//         dispatch({ type: LODING, load });

//         RNFetchBlob.fetch('POST', base_url,{
//             Authorization : "Bearer access-token",
//             otherHeader : "foo",
//             'Content-Type' : 'multipart/form-data',
//         }, real_data)

//         .then(response => {
//             console.log(response)
//             var obj = JSON.parse(response.data)
//             const load = {
//                 progressVisible: false
//             }
//             dispatch({ type: LODING, load });

//             if(obj.status == '200'){
//                 const payload = obj.result
//                 console.log(payload)
//                 dispatch({ type: SET_USER, payload });
//                 RootNavigation.navigate('bottomtab', { screen: 'home' });
//             } else{
//                 // this.setState({ isUploading: false});
//                 Alert.alert('Error', response.data.message);
//             }

//         }).catch(err => {
//             Alert.alert('Error', 'Error on network');
//             console.log(err)
//         })

// };

export const updateprofile = (id, headline, desc, files, youtube) => async (dispatch) => {
    const load = {
        progressVisible: true
    }
    dispatch({ type: LODING, load });

    let base_url = 'https://he11o.com/id/api/create_profile.php';

        var real_data = [
            {name:"id", data: id},
            ...files,
            {name:"submit", data:"ok"}
        ]
        if(headline != ''){
            real_data.push({name:"headline", data: headline})
        }
        if(desc != ''){
            real_data.push({name:"desc", data: desc})
        }
        if(youtube !=''){
            real_data.push({name:"youtube_video", data: youtube})
        }
        console.log(real_data)

        RNFetchBlob.fetch('POST', base_url,{
            Authorization : "Bearer access-token",
            otherHeader : "foo",
            'Content-Type' : 'multipart/form-data',
        }, real_data)

        .then(response => {
            console.log(response)
            var obj = JSON.parse(response.data)
            const load = {
                progressVisible: false
            }
            dispatch({ type: LODING, load });

            if(obj.status == '200'){
                const payload = obj.result
                console.log('-----payload----- ', payload)
                dispatch({ type: SET_USER, payload });
                RootNavigation.navigate('bottomtab', { screen: 'home' });
            } else{
                // this.setState({ isUploading: false});
                Alert.alert('Error', response.data.message);
            }

        }).catch(err => {
            Alert.alert('Error', 'Error on network');
            console.log(err)
        })

};

export const createprofile = (id, headline, desc, files, youtube) => async (dispatch) => {
    const load = {
        progressVisible: true
    }
    dispatch({ type: LODING, load });

    let base_url = 'https://he11o.com/id/api/create_profile.php';

        var real_data = [
            {name:"id", data: id},
            ...files,
            {name:"submit", data:"ok"}
        ]
        if(headline != ''){
            real_data.push({name:"headline", data: headline})
        }
        if(desc != ''){
            real_data.push({name:"desc", data: desc})
        }
        if(youtube !=''){
            real_data.push({name:"youtube_video", data: youtube})
        }
        console.log(real_data)

        RNFetchBlob.fetch('POST', base_url,{
            Authorization : "Bearer access-token",
            otherHeader : "foo",
            'Content-Type' : 'multipart/form-data',
        }, real_data)

        .then(response => {
            console.log(response)
            var obj = JSON.parse(response.data)

            if(obj.status == '200'){
                const payload = obj.result
                console.log('-----payload----- ', payload)
                dispatch({ type: SET_USER, payload });
                RootNavigation.navigate('kind', { id });
            } else{
                // this.setState({ isUploading: false});
                Alert.alert('Error', response.data.message);
            }

        }).catch(err => {
            Alert.alert('Error', 'Error on network');
            console.log(err)
        }).finally( () => {
            const load = {
                progressVisible: false
            }
            dispatch({ type: LODING, load });
        });
};

export const updateShareImages = (id, share_iamges) => async (dispatch) => {

    let formData = new FormData();
    formData.append('id', id);
    formData.append('images_share_url', share_iamges);

    let load = {
        progressVisible: true
    };
    dispatch({ type: LODING, load });

    axios.post('https://he11o.com/id/api/update_profile.php', formData, {
        headers: {
            Accept: "application/json",
            'Content-Type' : 'multipart/form-data',
        },
    }).then(response => {
        let obj = response.data;
        console.log('---update share image result----', obj);
        let load = {
            progressVisible: false
        }
        dispatch({ type: LODING, load });

        if(obj.status == '200'){
            const payload = obj.result
            dispatch({ type: SET_USER, payload });
        } else{
            Alert.alert('Error', response.data.message);
        }
     }).catch(err => {
        Alert.alert('Error', 'Error on network');
        console.log(err)
     });

};

export const logout = () => async (dispatch) => {

    dispatch({ type: LOGOUT});
    RootNavigation.navigate('login');

};

