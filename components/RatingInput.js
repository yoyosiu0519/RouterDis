import React, { useState, useEffect } from 'react';
import { View} from 'react-native';
import { Rating } from 'react-native-ratings';
import {
  Colors,
  StyledButton,
  ButtonText,
  ReviewText,
  WhiteInputField
} from './Styles';

const RatingInput = ({ onRate, initialRating, onComment }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [comment, setComment] = useState('');

  // Update rating if initialRating changes
  useEffect(() => {
    setRating(initialRating || 0);
  }, [initialRating]);

  // Handle submit button
  const handleSubmit = () => {
    onRate(rating);
    onComment(comment);
    setComment('');
  };

  return (
    <View>
      <ReviewText>
        {rating > 0 ? 'Update your previous rating?' : 'Give a rating?'}
      </ReviewText>
      <Rating
        startingValue={rating}
        onFinishRating={(value) => {
          setRating(value);
        }}
        style={{ paddingVertical: 10 }}
      />
      <ReviewText>
        Want to leave a comment?
      </ReviewText>
      <WhiteInputField
        value={comment}
        onChangeText={setComment}
        placeholder="Write your comment here"
        multiline={true}
        numberOfLines={4}
        style={{ height: 80, width: '90%', alignSelf: 'center', textAlignVertical: 'top' }}
      />
      <StyledButton onPress={handleSubmit} style={{ backgroundColor: Colors.sage }}>
        <ButtonText >
          Submit Review
        </ButtonText>
      </StyledButton>
    </View>
  );
};

export default RatingInput;