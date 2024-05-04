import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Platform } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { FontAwesome6 } from '@expo/vector-icons';
import KeyboardAvoid from '../components/KeyboardAvoid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { UserType } from '../UserContext';
import Post from '../components/RenderPost';

import {
    Colors,
    StyledContainer,
    Subtitle,
    PostContainer,
    PostTitle,
    MessageText,
    PostTime,
    PostDestination,
    PostLocationContainer,
    PostDay,
    PostLocation,
    LocationTitle,
    LocationDetails,
    DeleteLocationText

} from "./../components/Styles";
const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;

const Save = () => {
  const { userID, setUserID } = useContext(UserType);
  const [savedPosts, setSavedPosts] = useState({});
  const [posts, setPosts] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  console.log('API_URL:', API_URL);
  useFocusEffect(
    useCallback(() => {
      // Fetch and decode user ID
      const fetchPeople = async () => {
        const token = await AsyncStorage.getItem('userToken');
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.userID;
        setUserID(userID);
      };
      fetchPeople();
  
      // Fetch all posts
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`http://${API_URL}/posts`);
          const saved = response.data.filter(post => post.saved.findIndex(user => user.user.toString() === userID) !== -1);
          setPosts(saved);
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchPosts();
  
      // Reset the active sections
      setActiveSections([]);
  
      return () => { };
    }, [userID, savedPosts])
  );
useFocusEffect(
    useCallback(() => {
      const fetchSavedPosts = async () => {
        try {
          const response = await axios.get(`http://${API_URL}/users/${userID}/savedPosts`);
          console.log('response.data:', response.data);
          const savedPosts = response.data.savedPosts.reduce((acc, post) => ({ ...acc, [post._id]: true }), {});
          setSavedPosts(savedPosts);
        } catch (error) {
          console.error('Failed to fetch saved posts:', error);
        }
      };
  
      if (userID) {
        fetchSavedPosts();
      }
      return () => {};
    }, [userID])
  );
  const savePost = async (postID, userID) => {
    try {
        const response = await axios.put(`http://${API_URL}/posts/${postID}/${userID}/save`);
        console.log('savePost response:', response.data);
        // Update the savedPosts state
        setSavedPosts(prevState => ({
            ...prevState,
            [postID]: response.data.saved.findIndex(user => user.user.toString() === userID) !== -1,
        }));
    } catch (error) {
        console.error('Failed to save post:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
};

 
  return (
    <KeyboardAvoid>
    <StyledContainer>
        <SafeAreaView>
            <ScrollView>
            {posts.length === 0 ? (
              <View>
  <Subtitle>You currently have no saved posts</Subtitle>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <FontAwesome6 name="face-sad-cry" size={80} color="black" />
</View>
<MessageText>Start saving posts for your next trip! </MessageText>
  
  </View>
) : (
  <PostContainer>
    <PostTitle>Your Saved Posts</PostTitle>
    {posts.map((post, index) => (
      <Post
        key={index}
        post={post}
        savedPosts={savedPosts}
        savePost={savePost}
        userID={userID}
        isActive={activeSections.includes(index)}
      />
    ))}
  </PostContainer>
)}
            </ScrollView>
                </SafeAreaView>
            </StyledContainer>
        </KeyboardAvoid>
  );
};

export default Save;
