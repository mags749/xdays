import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {fonts} from '../utils/constants';

const NumView = ({num, title}) =>
  num > 0 ? (
    <View className="flex flex-col items-center gap-0">
      <Text
        className="text-black"
        style={{fontSize: 54, fontFamily: fonts.DISPLAY_FONT_B}}>
        {num}
      </Text>
      <Text
        className="text-black text-bold uppercase"
        style={{fontFamily: fonts.DISPLAY_FONT, fontSize: 12}}>
        {title}
        {num > 0 ? 's' : ''}
      </Text>
    </View>
  ) : null;

export default memo(NumView);
