import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import axios from 'axios';
import { API_URL_ANDROID, API_URL_IOS } from '../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  ReviewContainer,
  PostDestination, 
  LocationTitle,
  LocationDetails,
  TextRow,

} from './Styles';

const API_URL = Platform.OS === 'ios' ? API_URL_IOS : API_URL_ANDROID;

const Comments = ({ postID, userID}) => {
  const [comments, setComments] = useState([]);


  const handleDelete = (commentID) => {
    axios.delete(`http://${API_URL}/posts/${postID}/${userID}/comments`, { data: { commentID } })
      .then((response) => {
        setComments(comments.filter(comment => comment._id !== commentID));
      })
      .catch((error) => {
        console.error('Delete error:', error); // Log the error
      });
  };

  useEffect(() => {
    axios.get(`http://${API_URL}/posts/${postID}/comments`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error('Fetch error:', error); // Log the error
      });
  }, [postID]);

  return (
    <View>
      <PostDestination>Post Comment</PostDestination>
      {comments.map((comment, index) => {
  return (
    <ReviewContainer key={index}>
      <TextRow>
        <LocationTitle>{comment.user.firstname} {comment.user.surname}</LocationTitle>
        {comment.user._id === userID && (
          <MaterialCommunityIcons name="delete-circle" size={24} color="black" onPress={() => handleDelete(comment._id)} />
        )}
      </TextRow>
      <LocationDetails>{comment.text}</LocationDetails>
    </ReviewContainer>
  );
})}
    </View>
  );
};

export default Comments;