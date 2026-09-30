import React, {useRef, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import {BlurTargetView, BlurView} from 'expo-blur';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, icons} from '../../../shared/constants/theme';
import SquircleButton from '../../../shared/components/SquircleButton';

import DashboardHeader from './DashboardHeader';
import DayBoard from './DayBoard';

const {Add} = icons;

const DashboardView = ({
  days,
  loading,
  sortAscending,
  canSort,
  onToggleSort,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const blurTargetRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <SafeAreaView className="flex flex-1 bg-black">
      <View className="flex-1">
        {/* Everything inside the target is what gets blurred (required on Android) */}
        <BlurTargetView
          ref={blurTargetRef}
          style={{flex: 1, backgroundColor: colors.black.default}}>
          <ScrollView
            contentContainerStyle={{
              paddingTop: headerHeight,
              paddingBottom: 24,
            }}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.blue.primary} />
            ) : days.length ? (
              days.map(({timestamp, title, counter, id}, index) => (
                <DayBoard
                  key={id}
                  date={new Date(timestamp)}
                  index={index}
                  counter={counter}
                  title={title}
                  onPress={() => onEdit(id)}
                  onDelete={() => onDelete(id)}
                />
              ))
            ) : (
              <View className="flex flex-col items-center justify-center h-80">
                <Text className="text-white" style={{fontSize: 32}}>
                  Nothing to show!
                </Text>
                <Text className="text-white" style={{fontSize: 24}}>
                  Add something.
                </Text>
              </View>
            )}
          </ScrollView>
        </BlurTargetView>

        {/* Frosted header overlay — must render AFTER the scrolling content */}
        <BlurView
          blurTarget={blurTargetRef}
          blurMethod="dimezisBlurView"
          intensity={60}
          tint="dark"
          onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            overflow: 'hidden',
          }}>
          <DashboardHeader
            canSort={canSort}
            sortAscending={sortAscending}
            onToggleSort={onToggleSort}
          />
        </BlurView>

        {/* Floating add button: sibling of the blur, not inside it or its target */}
        <View className="absolute top-0 right-0 px-5">
          <SquircleButton onPress={onAdd}>
            <Add size={28} color="black" />
          </SquircleButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardView;
