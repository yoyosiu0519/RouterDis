import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import { Entypo } from '@expo/vector-icons';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { 
  Colors,
  ReviewContainer,
  PostDestination, 
  LocationTitle,
  LocationDetails,
  TextRow,

} from './Styles';

const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;

const Comments = ({ postID}) => {
  const [comments, setComments] = useState([]);


  useEffect(() => {
    axios.get(`http://${API_URL}/posts/${postID}/comments`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [postID]);

  const handleDelete = (commentID) => {
    axios.delete(`http://${API_URL}/posts/${postID}/${userID}/comments`, { data: { commentID } })
      .then((response) => {
        // Handle successful deletion here, e.g., by removing the comment from your state
        setComments(comments.filter(comment => comment._id !== commentID));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View>
      <PostDestination>Post Comment</PostDestination>
      {comments.map((comment, index) => (
        <ReviewContainer key={index}>
          <TextRow>
          <LocationTitle>{comment.user.firstname} {comment.user.surname}</LocationTitle>
          <Entypo name="dots-three-horizontal" size={20} color="black" onPress={() => handleDelete(comment._id)}/>
          </TextRow>
          <LocationDetails>{comment.text}</LocationDetails>
        </ReviewContainer>
      ))}
    </View>
  );
};

export default Comments;