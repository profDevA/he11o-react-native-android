import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import { Router, Scene, Stack } from "react-native-router-flux";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef, isReadyRef } from './RootNavigation';

import Login from "./../screen/Auth/Login";
import Card from "../screen/Profile/card";
import UpdateCard from "../screen/Profile/updatecard";

import Profile from "../screen/Profile/profile";
import UpdateProfile from "../screen/Profile/updateprofile";

import Setting from "../screen/Profile/setting";
import Share from "../screen/Profile/share";
import Receptment from "../screen/Receptment";

import Kind from "../screen/Kind";
import UpdateKind from "../screen/Kind/update";

import Home from "../screen/Home";
import ShareCard from "../screen/Profile/sharecard";
import ShareMsg from "../screen/Profile/sharemsg";

import ShareDetails from "../screen/Profile/sharedetails";

import ShareTab from "../screen/Profile/sharetab";
import Subscription from "../screen/Subscription";
import AddMember from "../screen/Subscription/addmember";

import Icon from 'react-native-vector-icons/Feather';
import SignUp from "../screen/Auth/Signup";
import Forgot from "../screen/Auth/Forgot";
import Reset from "../screen/Auth/Forgot/reset";
import Verify from "../screen/Auth/Verify";
import VerifyConfirm from "../screen/Auth/VerifyConfirm";

const HomeStack = createStackNavigator();

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'home') {
            iconName = focused
              ? 'credit-card'
              : 'credit-card';
          } else if (route.name === 'sharetab') {
            iconName = focused ? 'list' : 'list';
          } else if (route.name === 'setting') {
            iconName = focused ? 'settings' : 'settings';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={25} color={color}/>;
        },

      })}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#35197c',
        inactiveTintColor: 'gray',
        // style:{height:50}
      }}

    >
        <Tab.Screen name="home" component={Home} />
        <Tab.Screen name="sharetab" component={ShareTab} />
        <Tab.Screen name="setting" component={Setting} />

    </Tab.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    return () => {
      isReadyRef.current = false
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      <HomeStack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
          <HomeStack.Screen name="login" component={Login} />
          <HomeStack.Screen name="signup" component={SignUp}/>
          <HomeStack.Screen name="forgot" component={Forgot}/>
          <HomeStack.Screen name="reset" component={Reset}/>
          <HomeStack.Screen name="card" component={Card}/>
          <HomeStack.Screen name="verify" component={Verify}/>
          <HomeStack.Screen name="verifyConfirm" component={VerifyConfirm}/>
          <HomeStack.Screen name="updatecard" component={UpdateCard}/>

          <HomeStack.Screen name="profile" component={Profile}/>
          <HomeStack.Screen name="updateprofile" component={UpdateProfile}/>

          {/* <HomeStack.Screen name="share" component={Share} hideNavBar={true}/> */}
          <HomeStack.Screen name="receptment" component={Receptment}/>

          <HomeStack.Screen name="kind" component={Kind}/>
          <HomeStack.Screen name="updatekind" component={UpdateKind}/>

          {/* <HomeStack.Screen name="home" component={Home} hideNavBar={true}/> */}
          <HomeStack.Screen name="sharecard" component={ShareCard}/>
          <HomeStack.Screen name="sharemsg" component={ShareMsg}/>

          <HomeStack.Screen name="sharedetails" component={ShareDetails}/>
          <HomeStack.Screen name="subscription" component={Subscription}/>
          <HomeStack.Screen name="addmember" component={AddMember}/>

          <HomeStack.Screen name="bottomtab" component={BottomTabs}/>

      </HomeStack.Navigator>

    </NavigationContainer>
  );
}
