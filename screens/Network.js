import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Platform } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { AntDesign } from '@expo/vector-icons';
import KeyboardAvoid from '../components/KeyboardAvoid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserType } from '../UserContext';

import {
  Colors,
  StyledContainer,
  NetworkButtonContainer,
  NetworkButton,
  NetworkButtonText,
  ButtonText,
  ScreenHeadtitle,
  LogoContainer,
  FollowButton,
  PostDestination,

} from "./../components/Styles";

const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;

const Network = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelctedButton] = useState("people");
  const { userID, setUserID } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followers, setFollowers] = useState([]);


  const handleSelectedButton = (button) => {
    setSelctedButton(button);
    if (button === 'people') {
      fetchPeople();
    } else if (button === 'follow') {
      fetchFollowingUsers();
    } else if (button === 'follower') {
      fetchFollowers();
    }
  }
  const handleFollow = (loggedInUserID, followUserID) => {
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
      setUsers(users => users.filter(user => user._id !== unfollowUserID));
      setFollowingUsers(followingUsers => followingUsers.filter(user => user._id !== unfollowUserID));
    }).catch((error) => {
      console.log(error.response.data.message); // "Unable to unfollow user"
    });
  }

  const fetchPeople = async () => {
    axios.get(`http://${API_URL}/user/${userID}`).then((response) => {
      console.log("Server response:", response.data);
      const otherUsers = response.data.users.filter(user => user._id !== userID);
      setUsers(otherUsers);
      setFollowers(otherUsers.filter(user => user.followers.includes(userID)));
    }).catch((error) => {
      console.log("Error fetching people", error);
    });
  };

  const fetchFollowingUsers = async () => {
    try {
      const response = await axios.get(`http://${API_URL}/users/${userID}/following`);
      setFollowingUsers(response.data.following);
    } catch (error) {
      console.log("Error fetching following users", error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(`http://${API_URL}/users/${userID}/followers`);
      setFollowers(response.data.followers);
    } catch (error) {
      console.log("Error fetching followers", error);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);
  return (
    <KeyboardAvoid>
      <StyledContainer>
        <SafeAreaView>
          <ScrollView>
            <LogoContainer>
              <Pressable onPress={() => navigation.goBack()}>
                <AntDesign name="left" size={24} color={Colors.navy} />
              </Pressable>
              <ScreenHeadtitle>Network</ScreenHeadtitle>
            </LogoContainer>
            <NetworkButtonContainer>
              <NetworkButton
                onPress={() => handleSelectedButton("people")}
                style={
                  selectedButton === "people" ? {
                    backgroundColor: Colors.navy
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
                    backgroundColor: Colors.navy
                  } : null}>
                <NetworkButtonText
                  style={
                    selectedButton === "follow" ? {
                      color: Colors.white
                    } : null}
                >
                  Following
                </NetworkButtonText>
              </NetworkButton>
              <NetworkButton
                onPress={() => {
                  handleSelectedButton("follower");
                }}
                style={
                  selectedButton === "follower" ? {
                    backgroundColor: Colors.navy
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
                          <PostDestination>{item.firstname} {item.surname}</PostDestination>
                        </View>
                        <View style={{ flex: 1 }}>
                          <FollowButton onPress={() => handleFollow(userID, item._id)}>
                            <ButtonText>Follow</ButtonText>
                          </FollowButton>
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
                          <PostDestination>{item.firstname} {item.surname}</PostDestination>
                        </View>
                        <View style={{ flex: 1 }}>
                          <FollowButton onPress={() => handleUnfollow(userID, item._id)}>
                            <ButtonText>Unfollow</ButtonText>
                          </FollowButton>
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
                  {followers.map((item, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <PostDestination style={{ textAlign: 'center' }}>{item.firstname} {item.surname}</PostDestination>
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
