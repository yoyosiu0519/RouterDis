import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { Rating } from 'react-native-ratings';

const RatingInput = ({ onRate }) => {
  const [rating, setRating] = useState(0);

  const handleRate = () => {
    onRate(rating);
    setRating(0);
  };

  return (
    <View>
<Rating
  showRating
  onFinishRating={(value) => {
    console.log('onFinishRating value:', value);
    setRating(value);
  }}
  style={{ paddingVertical: 10 }}
/>
      <Button title="Submit Rating" onPress={handleRate} />
    </View>
  );
};

export default RatingInput;