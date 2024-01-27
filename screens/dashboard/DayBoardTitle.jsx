import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {fonts} from '../utils/constants';

const DayBoardTitle = ({title}) => {
  const words = title.split(' ');
  return (
    <View className="absolute top-5 left-5 flex flex-col opacity-20">
      {words.map((word, index) => (
        <Text
          style={{
            fontFamily: fonts.MAIN_FONT_B,
            fontSize: 24,
          }}
          className="text-black lowercase"
          key={index}>
          {word}
        </Text>
      ))}
    </View>
  );
};

export default memo(DayBoardTitle);
