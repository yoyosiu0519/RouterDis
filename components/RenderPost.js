import { StyleSheet, TextInput, View, SafeAreaView, ScrollView, Pressable, Platform } from 'react-native'
import React, { useState, useMemo, useContext } from 'react'
import Accordion from 'react-native-collapsible/Accordion';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import RenderLocations from './RenderLocations';
import RatingInput from './RatingInput';
import Comments from './Comment';
import {
    Colors,
    TextRow,
    PostUser,
    PostTime,
    PostDestination,
    PostLocationContainer,
    StyledButton,
    ButtonText,
    StyledPostButton,

} from "./../components/Styles";

const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;


const RenderPost = ({ post, savedPosts, savePost, userID, showDeleteButton, deletePost }) => {
    const [activeSections, setActiveSections] = useState([]);
    const [isReviewing, setIsReviewing] = useState(false);

    const toggleSection = () => {
        setActiveSections(activeSections.includes(0) ? [] : [0]);
    };

    const getHoursSince = (dateString) => {
        const postDate = new Date(dateString);
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate - postDate;
        const differenceInHours = Math.floor(differenceInMilliseconds / 1000 / 60 / 60);
        return differenceInHours;
    };

    const [userRating, setUserRating] = useState(null);
    const [initialRating, setInitialRating] = useState(0);
    const rating = useMemo(() => {
        let ratings = post.points.map(point => point.star);
        const userPoint = post.points.find(point => point.user === userID);
        const initialRating = userPoint ? userPoint.star : 0;
        setInitialRating(initialRating);
        if (userRating !== null) {
            if (userPoint) {
                const index = ratings.indexOf(userPoint.star);
                ratings[index] = userRating;
            } else {
                ratings.push(userRating);
            }
        }
        const sum = ratings.reduce((total, rating) => total + rating, 0);
        const average = sum / ratings.length;
        return average;
    }, [post, userRating]);

    const validRating = !isNaN(rating) && isFinite(rating) ? rating : 0;
    const handleRate = async (rating) => {
        console.log(`Rating: ${rating}, Post ID: ${post._id}`);
        setUserRating(rating);
        try {
            const response = await axios.post(`http://${API_URL}/posts/${post._id}/${userID}/rate`, {
                star: rating,
            });
        } catch (error) {
            console.log('Error rating post:', error);
        }
    };
    const handleWriteReview = () => {
        setIsReviewing(prevIsReviewing => !prevIsReviewing);
    };

    const handleComment = async (comment) => {
        console.log(`Comment: ${comment}, Post ID: ${post._id}`);
        try {
            const response = await axios.post(`http://${API_URL}/posts/${post._id}/${userID}/comment`, {
                text: comment,
            });
            console.log('Comment saved successfully:', response.data);
        } catch (error) {
            console.log('Error commenting on post:', error);
        }
    };

    return (
        <PostLocationContainer>
            {post && (
                <Accordion
                    activeSections={activeSections}
                    sections={[post]}
                    onChange={toggleSection}
                    touchableProps={{ underlayColor: 'transparent' }}

                    renderHeader={post => (
                        <View>
                            <TextRow>
                                <PostDestination>{post.destination}</PostDestination>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Rating
                                        imageSize={20}
                                        readonly
                                        startingValue={validRating}
                                        ratingColor={Colors.red}

                                        style={{ paddingVertical: 10 }}
                                    />
                                    {activeSections.includes(0) ? (
                                        <Ionicons name="caret-up" size={24} color={Colors.navy} />
                                    ) : (
                                        <Ionicons name="caret-down" size={24} color={Colors.navy} />
                                    )}
                                </View>
                            </TextRow>
                            <TextRow>
                                <PostUser>{post.user.firstname} {post.user.surname}</PostUser>
                                <PostTime>{getHoursSince(post.createdAt)} hours ago</PostTime>
                            </TextRow>
                        </View>
                    )}

                    renderContent={post => (
                        <Pressable activeOpacity={1} onPress={toggleSection}>
                            <RenderLocations locations={post.locations} />

                            {post.user._id !== userID && (
                            <View>
                                <Ionicons
                                    style={{ alignSelf: 'flex-end', marginRight: 10 }}
                                    name={savedPosts[post._id] ? "bookmark" : "bookmark-outline"}
                                    size={34}
                                    color={Colors.red}
                                    onPress={() => savePost(post._id, userID)}
                                />
                                     <Comments postID={post._id} />
                                <StyledPostButton onPress={handleWriteReview}>
                                    <ButtonText>{isReviewing ? 'Hide' : 'Write a Review'}</ButtonText>
                                </StyledPostButton>
                                {isReviewing && <RatingInput onRate={handleRate} onComment={handleComment} initialRating={initialRating} />}                           
                            
                            </View>
                        )}
                            {showDeleteButton && (
                                <StyledButton onPress={() => deletePost(post._id)}>
                                    <ButtonText>Delete Post</ButtonText>
                                </StyledButton>
                            )}


                        </Pressable>
                    )}
                />
            )}
        </PostLocationContainer>
    );
};

export default RenderPost;