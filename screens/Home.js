import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Platform } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import Accordion from 'react-native-collapsible/Accordion';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import KeyboardAvoid from '../components/KeyboardAvoid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserType } from '../UserContext';
import Post from '../components/RenderPost';
import SearchBar from '../components/SearchBar';
import {
  Colors,
  StyledContainer,
  HomeAppName,
  IconPressable,
  LogoContainer,
  PostContainer,
  PostTitle,
  DeleteLocationText

} from "./../components/Styles";

const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;

const Home = () => {
  const navigation = useNavigation();
  const { userID, setUserID } = useContext(UserType);
  const [activeSections, setActiveSections] = useState([]);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

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
          const posts = response.data;
          setPosts(posts);
        } catch (error) {
          console.log('Home screen: ', error);
        }
      };
      fetchPosts();

      // Reset the active sections
      setActiveSections([]);

      return () => { };
    }, [savedPosts])
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
      return () => { };
    }, [userID])
  );

  // Filter the posts based on the search term when rendering them
  const filteredPosts = posts.filter(post => post.destination && post.destination.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const savePost = async (postID, userID) => {
    try {
      const response = await axios.put(`http://${API_URL}/posts/${postID}/${userID}/save`);
      console.log('savePost response:', response.data);
      setSavedPosts(prevState => ({
        ...prevState,
        [postID]: response.data.saved.findIndex(user => user.user.toString() === userID) !== -1,
      }));
    } catch (error) {
      console.error('Failed to save post:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Home screen: ', error.response.data);
        console.log('Home screen: ', error.response.status);
        console.log('Home screen: ', error.response.headers);
      } else if (error.request) {
        console.log('Home screen: ', error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log('Home screen: ', error.config);
    }
  };


  const toggleSection = index => {
    setActiveSections(activeSections.includes(index) ? activeSections.filter(i => i !== index) : [...activeSections, index]);
  };


  return (

    <KeyboardAvoid>
      <StyledContainer>
        <SafeAreaView>
          <ScrollView>
            <LogoContainer>
              <HomeAppName>Router
              </HomeAppName>
              <IconPressable onPress={() => navigation.navigate('Network')}>
                <Ionicons name="person-add" size={24} color={Colors.navy} />
              </IconPressable>
            </LogoContainer>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {filteredPosts.length === 0 && <DeleteLocationText style={{ margin: 20 }}>No posts found</DeleteLocationText>}
            <ScrollView>
              {userID && posts && (
                <View style={{ margin: 5 }}>
                  <PostContainer>
                    {searchTerm === '' && <PostTitle>Recent Posts</PostTitle>}
                    {filteredPosts.map((post, index) => (
                      <Post
                        key={index}
                        post={post}
                        savedPosts={savedPosts}
                        savePost={savePost}
                        userID={userID}
                        isActive={activeSections.includes(index)}
                        toggleSection={() => toggleSection(index)}
                      />
                    ))}
                  </PostContainer>
                </View>
              )}
            </ScrollView>

          </ScrollView>
        </SafeAreaView>
      </StyledContainer>
    </KeyboardAvoid>
  )
}

export default Home
