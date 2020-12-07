import {
    Alert,
    AsyncStorage
} from "react-native";
import { Actions } from "react-native-router-flux";
import axios from "axios";

const LODING = "LOADING";
const SHARE = "SHARE";

const initialState = {
    progressVisible: false,
    
    share: [],
};

export default (state = initialState, action) => {
    switch (action.type) {

        case LODING:
            return {
                ...state,
                progressVisible: action.load.progressVisible,
            }
        
        case SHARE:
            return {
                share: action.payload.share
            }
        default:
            return state;
    }
}

export const saveShare = (payload) => (dispatch) => {
    dispatch({ type: SHARE, payload });
}

export const share = (email) => async (dispatch) => {

    const fd = new FormData();
    fd.append("email", email);
    const load = {
        progressVisible: true
    }
    dispatch({ type: LODING, load });
    axios.post('https://he11o.com/id/api/sharedata.php', fd,
    {
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(response => {
        console.log(response)
        if (response.data.status == 200) {
            const load = {
                progressVisible: false
            }
            dispatch({ type: LODING, load });

            const payload = {
                share: response.data.result
            }
            console.log("payload", payload);
        
            dispatch({ type: SHARE, payload });
        } else {
            Alert.alert("Error", JSON.stringify(response.data.result))

        }
    }).catch(err => {
        console.log('err')
    })
    

};
