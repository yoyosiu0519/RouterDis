import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Platform } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { AntDesign } from '@expo/vector-icons';
import KeyboardAvoid from '../components/KeyboardAvoid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';

import {
  Colors,
  StyledContainer,
  NetworkButtonContainer,
  NetworkButton,
  NetworkButtonText,
  ScreenHeadtitle,
  LogoContainer,

} from "./../components/Styles";

const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;

const Network = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelctedButton] = useState("people");
  const [content, setContent] = useState("People Content");
  const { userID, setUserID } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
 

  const handleSelectedButton = (button) => {
    setSelctedButton(button);
  }
  const handleFollow = (loggedInUserID, followUserID) => {
    console.log('loggedInUserID:', loggedInUserID);
    console.log('followUserID:', followUserID);
    axios.post(`http://${API_URL}/follow`, {
      loggedInUserID,
      followUserID
    }).then((response) => {
      console.log(response.data.message); // "User followed successfully"
      setUsers(users => users.filter(user => user._id !== followUserID));
    }).catch((error) => {
      console.log(error.response.data.message); // "Unable to follow user"
    });
  }
  const handleUnfollow = (loggedInUserID, unfollowUserID) => {
    axios.post(`http://${API_URL}/users/unfollow`, {
      loggedInUserID,
      unfollowUserID
    }).then((response) => {
      console.log(response.data.message); // "User unfollowed successfully"
      setUsers(users.filter(user => user._id !== unfollowUserID));
    }).catch((error) => {
      console.log(error.response.data.message); // "Unable to unfollow user"
    });
  }
  const logToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Retrieved token:", token);
    } catch (error) {
      console.log("Error getting token:", error);
    }
  }
  useEffect(() => {
    console.log(followers);
  }, [followers]);
  useEffect(() => {
    const fetchPeople = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.userID;
      setUserID(userID);

      axios.get(`http://${API_URL}/user/${userID}`).then((response) => {
        console.log("Server response:", response.data);
        setUsers(response.data.users);
        setFollowers(response.data.users.filter(user => user.followers.includes(userID)));
      }).catch((error) => {
        console.log("Error fetching people", error);
      });
    };
    fetchPeople();
  }, []);
  useEffect(() => {
    axios.get(`http://${API_URL}/users/${userID}/following`)
      .then((response) => {
        setFollowingUsers(response.data.following);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userID]);
  

  useEffect(() => {
    logToken();
  }, []);
  console.log("users", users);
  return (
    <KeyboardAvoid>
      <StyledContainer>
        <SafeAreaView>
          <ScrollView>
            <LogoContainer>
              <Pressable onPress={() => navigation.goBack()}>
                <AntDesign name="left" size={24} color="black" />
              </Pressable>
              <ScreenHeadtitle>Network</ScreenHeadtitle>
            </LogoContainer>
            <NetworkButtonContainer>
              <NetworkButton
                onPress={() => handleSelectedButton("people")}
                style={
                  selectedButton === "people" ? {
                    backgroundColor: Colors.darkPurple
                  } : null}>
                <NetworkButtonText
                  style={
                    selectedButton === "people" ? {
                      color: Colors.white
                    } : null}
                >
                  People
                </NetworkButtonText>
              </NetworkButton>
              <NetworkButton
                onPress={() => handleSelectedButton("follow")}
                style={
                  selectedButton === "follow" ? {
                    backgroundColor: Colors.darkPurple
                  } : null}>
                <NetworkButtonText
                  style={
                    selectedButton === "follow" ? {
                      color: Colors.white
                    } : null}
                >
                  Follow
                </NetworkButtonText>
              </NetworkButton>
              <NetworkButton
                onPress={() => {
                  handleSelectedButton("follower");
                }}
                style={
                  selectedButton === "follower" ? {
                    backgroundColor: Colors.darkPurple
                  } : null}>
                <NetworkButtonText
                  style={
                    selectedButton === "follower" ? {
                      color: Colors.white
                    } : null}
                >
                  Follower
                </NetworkButtonText>
              </NetworkButton>
            </NetworkButtonContainer>

            {/* ........For the people button.........*/}
            <View>
              {selectedButton === "people" && (
                <View style={{ marginTop: 20 }}>
                  {users?.filter(item => !item.followers.includes(userID)).map((item, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Text>{item.firstname} {item.surname}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Pressable onPress={() => handleFollow(userID, item._id)} style={{ marginLeft: 10, backgroundColor: 'black', padding: 10 }}>
                            <Text style={{ color: 'white' }}>Follow</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>


            {/* ........For the follow button.........*/}
            <View>
              {selectedButton === "follow" && (
                <View style={{ marginTop: 20 }}>
                  {followingUsers.map((item, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                        <Text>{item.firstname} {item.surname}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Pressable onPress={() => handleUnfollow(userID, item._id)} style={{ marginLeft: 10, backgroundColor: 'black', padding: 10 }}>
                            <Text style={{ color: 'white' }}>Unfollow</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* ........For the follower button.........*/}
            <View>
              {selectedButton === "follower" && (
                <View style={{ marginTop: 20 }}>
                  {followers?.filter(item => item.followers.includes(userID)).map((item, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                        <Text>{item.firstname} {item.surname}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </StyledContainer>
    </KeyboardAvoid>
  )
}

export default Network

const styles = StyleSheet.create({})