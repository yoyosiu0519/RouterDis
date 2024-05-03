import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Platform } from 'react-native'
import React, { useState, useEffect, useContext,useCallback } from 'react'
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
              setPosts(response.data);
              console.log(response.data);
            } catch (error) {
              console.log(error);
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
          return () => {};
        }, [userID])
      );

    // Filter the posts based on the search term when rendering them
    const filteredPosts = posts.filter(post => post.destination.toLowerCase().includes(searchTerm.toLowerCase()));

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

    const toggleSection = index => {
        setActiveSections(activeSections.includes(index) ? activeSections.filter(i => i !== index) : [...activeSections, index]);
    };


    useEffect(() => {
        console.log('savedPosts:', savedPosts);
    }, [savedPosts]);

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
                        <SearchContainer>
                            <IconContainer>
                                <Ionicons name="search" size={24} color={Colors.gold} />
                            </IconContainer>
                            <StyledInputText
                                placeholder="Search Destination"
                                onChangeText={text => setSearchTerm(text)}
                                value={searchTerm}
                            />
                        </SearchContainer>
                        {filteredPosts.length === 0 && <DeleteLocationText style={{margin:20}}>No posts found</DeleteLocationText>}
            <ScrollView>
              {/* ... */}
              {posts && (
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
                            {/* ... */}
                        </ScrollView>

                    </ScrollView>
                </SafeAreaView>
            </StyledContainer>
        </KeyboardAvoid>
    )
}

export default Home