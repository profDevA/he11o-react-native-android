import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import { Router, Scene, Stack } from "react-native-router-flux";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from "./../screen/Auth/Login";
import Card from "../screen/Profile/card";
import Profile from "../screen/Profile/profile";
import Setting from "../screen/Profile/setting";
import Share from "../screen/Profile/share";
import Receptment from "../screen/Receptment";

import Kind from "../screen/Kind";
import Home from "../screen/Home";
import ShareCard from "../screen/Profile/sharecard";
import ShareDetails from "../screen/Profile/sharedetails";

import ShareTab from "../screen/Profile/sharetab";
import Subscription from "../screen/Subscription";

import Icon from 'react-native-vector-icons/Feather';
import SignUp from "../screen/Auth/Signup";
import Forgot from "../screen/Auth/Forgot";


class TabIcon1 extends Component {
  render() {
    
    return (
     
      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
        <Icon name="credit-card" size={30} color="#D4D3D3"
          style={{
            // resizeMode: "contain",
            // tintColor:this.props.focused ? '#ff8960' :'#c1c0c9'
          }}
        />
        
      </View>
     
    );
  }
}

class TabIcon2 extends Component {
  render() {
   
    return (
      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
        <Icon name="list" size={30} color="#D4D3D3"
          style={{
            // resizeMode: "contain",
            // tintColor:this.props.focused ? '#ff8960' :'#c1c0c9'
          }}
        />
        
      </View>
    );
  }
}

class TabIcon3 extends Component {
  render() {
    console.log("color",this.props);

    return (
      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
        <Icon name="settings" size={30} color="#D4D3D3"
          style={{
            // resizeMode: "contain",
            // tintColor:this.props.focused ? '#ff8960' :'#c1c0c9'
          }}
          
        />
      </View>
    );
  }
}


export default class Route extends Component {
 
  render() {
    // const Tab = createMaterialBottomTabNavigator();
    return (
      <Router>
        <Stack key="root">
         
          <Scene key="login" component={Login}  hideNavBar={true}/>
          <Scene key="signup" component={SignUp}  hideNavBar={true}/>
          <Scene key="forgot" component={Forgot}  hideNavBar={true}/>
          <Scene key="card" component={Card} hideNavBar={true}/>
          <Scene key="profile" component={Profile} hideNavBar={true}/>
          {/* <Scene key="share" component={Share} hideNavBar={true}/> */}
          <Scene key="receptment" component={Receptment} hideNavBar={true}/>

          <Scene key="kind" component={Kind} hideNavBar={true}/>
          {/* <Scene key="home" component={Home} hideNavBar={true}/> */}
          <Scene key="sharecard" icon={TabIcon1} hideNavBar={true} component={ShareCard}/>
          <Scene key="sharedetails" hideNavBar={true} component={ShareDetails}/>
          <Scene key="subscription" hideNavBar={true} component={Subscription}/>

          <Scene key="bottomtab" hideNavBar={true} replace={true}>
              
              <Scene key="homeTAB"
                // inactiveBackgroundColor={'#F2F2F2'}
                activeBackgroundColor={'#35197c'}
                tabs={true} 
                lazy={true} 
                hideNavBar={true} 
                showLabel={false}>
                <Scene
                  key="home"
                  title=""
                  icon={TabIcon1}
                  hideNavBar={true}
                  component={Home}
                />

                <Scene
                  key="sharetab"
                  title=""
                  icon={TabIcon2}
                  component={ShareTab}
                  hideNavBar={true}
                />

                <Scene
                  key="setting"
                  showLabel={false}
                  icon={TabIcon3}
                  hideNavBar={true}
                  component={Setting}
                />

              </Scene>
            </Scene>
          
        </Stack>
      </Router>
    );
  }
}
