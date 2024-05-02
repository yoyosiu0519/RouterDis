import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Platform } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import Accordion from 'react-native-collapsible/Accordion';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Table, Row } from 'react-native-table-component';
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
    SearchContainer,
    IconContainer,
    StyledInputText,
    HomeAppName,
    IconPressable,
    LogoContainer,
    LocationTextRow,
    PostContainer,
    PostTitle,
    PostUser,
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
  const navigation = useNavigation();
  const { userID, setUserID } = useContext(UserType);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  console.log('API_URL:', API_URL);
  useFocusEffect(
    React.useCallback(() => {
      console.log('userID:', userID); // Log the userID
  
      const fetchSavedPosts = async () => {
        try {
          const response = await axios.get(`http://${API_URL}/savedPosts/${userID}`);
          setSavedPosts(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchSavedPosts();
    }, [userID]) // Add userID as a dependency
  );

  const unsavePost = async (postID) => {
    console.log('unsavePost function called');
    console.log('postID:', postID);
    try {
      await axios.put(`http://${API_URL}/posts/${postID}/${userID}/save`);
      setSavedPosts(savedPosts.filter(post => post._id !== postID));
    } catch (error) {
      console.error(error);
    }
  };
 
  return (
    <ScrollView>
      {savedPosts.map((post, index) => (
        <Post
          key={index}
          post={post}
          savedPosts={savedPosts}
          savePost={unsavePost}
          userID={userID}
          isActive={activeSections.includes(index)}
          toggleSection={() => toggleSection(index)}
        />
      ))}
    </ScrollView>
  );
};

export default Save;
