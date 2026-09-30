import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {colors, fonts, icons} from '../../../shared/constants/theme';

const {Ascending, Descending} = icons;

const DashboardHeader = ({canSort, sortAscending, onToggleSort}) => (
  <View>
    {/* Reserved space for the floating add button (rendered in DashboardView) */}
    <View style={{height: 48}} />
    <View className="flex flex-row justify-between items-center px-8">
      <View
        className="flex flex-row items-center px-8"
        style={{marginBottom: 16}}>
        <Text
          className="text-white"
          style={{fontSize: 64, fontFamily: fonts.MAIN_FONT_SB}}>
          X
        </Text>
        <Text
          className="text-white"
          style={{fontSize: 32, fontFamily: fonts.DISPLAY_FONT}}>
          days
        </Text>
      </View>
      <TouchableOpacity onPress={onToggleSort}>
        {canSort &&
          (sortAscending ? (
            <Ascending size={24} color={colors.white.primary} />
          ) : (
            <Descending size={24} color={colors.white.primary} />
          ))}
      </TouchableOpacity>
    </View>
  </View>
);

export default DashboardHeader;
