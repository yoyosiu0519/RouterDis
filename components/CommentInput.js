import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const CommentInput = ({ onComment }) => {
  const [comment, setComment] = useState('');

  const handleComment = () => {
    onComment(comment);
    setComment('');
  };

  return (
    <View>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Write a comment"
      />
      <Button title="Submit Comment" onPress={handleComment} />
    </View>
  );
};

export default CommentInput;