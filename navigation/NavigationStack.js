import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Save from '../screens/Save'
import Post from '../screens/Post'
import Profile from '../screens/Profile'
import Network from '../screens/Network'
import Upload from '../screens/Upload'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  Colors
} from "./../components/Styles";


const NavigationStack = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function HomeTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            paddingTop: 1,
            paddingBottom: 8
          },
          tabBarHideOnKeyboard: true,
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={
            {
              tabBarLabel: "Home",
              tabBarLabelStyle: { color: Colors.navy },
              headerShown: false,
              tabBarIcon: ({ focused }) => focused ? (
                // <Ionicons name="home" size={24} color={Colors.black}/>
                <Ionicons name="home" size={24} color={Colors.navy} />
              ) : (
                //<Ionicons name="home-outline" size={24} color={Colors.darkPurple} />
                <Ionicons name="home-outline" size={24} color={Colors.navy} />
              ),

            }

          }
        />
        <Tab.Screen
          name="Save"
          component={Save}
          options={
            {
              tabBarLabel: "Saved",
              tabBarLabelStyle: { color: Colors.navy },
              headerShown: false,
              tabBarIcon: ({ focused }) => focused ? (
                //<Ionicons name="bookmark" size={24} color={Colors.black} />
                <Ionicons name="bookmark" size={24} color={Colors.navy} />
              ) : (
                // <Ionicons name="bookmark-outline" size={24} color={Colors.darkPurple} />
                <Ionicons name="bookmark-outline" size={24} color={Colors.navy} />
              ),
            }

          }
        />
        <Tab.Screen
          name="Post"
          component={Post}
          options={
            {
              tabBarLabel: "Post",
              tabBarLabelStyle: { color: Colors.navy },
              headerShown: false,
              tabBarIcon: ({ focused }) => focused ? (
                //<Ionicons name="add-circle" size={24} color={Colors.black} />
                <Ionicons name="add-circle" size={24} color={Colors.navy} />
              ) : (
                //<Ionicons name="add-circle-outline" size={24} color={Colors.darkPurple}/>
                <Ionicons name="add-circle-outline" size={24} color={Colors.navy} />

              ),
            }

          }
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={
            {
              tabBarLabel: "Profile",
              tabBarLabelStyle: { color: Colors.navy },
              headerShown: false,
              tabBarIcon: ({ focused }) => focused ? (
                //<FontAwesome5 name="user-alt" size={24} color={Colors.black}/>
                <FontAwesome5 name="user-alt" size={24} color={Colors.navy} />

              ) : (
                //<FontAwesome5 name="user" size={24} color={Colors.darkPurple} />
                <FontAwesome5 name="user" size={24} color={Colors.navy} />

              ),
            }

          }
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Network"
          component={Network}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Upload"
          component={Upload}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>

    </NavigationContainer>
  )
}

export default NavigationStack

const styles = StyleSheet.create({})