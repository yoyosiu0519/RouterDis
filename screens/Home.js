import { View, SafeAreaView, ScrollView, Platform } from 'react-native'
import React, { useState, useContext, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons';
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

  // Fetch and decode user ID from token
  useFocusEffect(
    useCallback(() => {
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
      setActiveSections([]);

      return () => { };
    }, [savedPosts])
  );

  // Fetch saved posts
  useFocusEffect(
    useCallback(() => {
      const fetchSavedPosts = async () => {
        try {
          const response = await axios.get(`http://${API_URL}/users/${userID}/savedPosts`);
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

  // Save a post
  const savePost = async (postID, userID) => {
    try {
      const response = await axios.put(`http://${API_URL}/posts/${postID}/${userID}/save`);
      setSavedPosts(prevState => ({
        ...prevState,
        [postID]: response.data.saved.findIndex(user => user.user.toString() === userID) !== -1,
      }));
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  // Toggle the section of the post
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