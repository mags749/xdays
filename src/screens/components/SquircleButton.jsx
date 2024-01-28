import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {SquircleView} from 'react-native-figma-squircle';
import {colors} from '../../utils/constants';

const SquircleButton = ({onPress, children, color}) => (
  <TouchableOpacity onPress={onPress}>
    <SquircleView
      className="min-h-12 min-w-12"
      squircleParams={{
        cornerSmoothing: 0.9,
        cornerRadius: 12,
        fillColor: color ? color : colors.white.default,
      }}>
      <View className="h-12 w-12 flex justify-center items-center">
        {children}
      </View>
    </SquircleView>
  </TouchableOpacity>
);

export default memo(SquircleButton);
