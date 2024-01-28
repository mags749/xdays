import React, {useEffect, useState} from 'react';
import {ScrollView, StatusBar, Text, View} from 'react-native';
import DayBoard from './DayBoard';
import SquircleButton from '../components/SquircleButton';
import {PlusIcon} from 'react-native-heroicons/solid';
import {colors, fonts} from '../../utils/constants';
import {Days} from '../../db';
import {differenceInCalendarDays} from 'date-fns';

const HomeScreen = ({navigation}) => {
  const [daysList, setDaysList] = useState(Days.data());

  Days.onChange(({event, changed}) => {
    if (
      event === 'loaded' ||
      ((event === 'insert' || event === 'update' || event === 'remove') &&
        changed.length)
    ) {
      setDaysList(Days.data());
    }
    if (event === 'loaded') {
      Days.data().forEach(function (item) {
        if (
          item.counter >= 0 &&
          differenceInCalendarDays(item.timestamp, new Date()) > item.counter
        ) {
          Days.remove(item);
        }
      });
    }
  });

  return (
    <View className="flex flex-1 text-white bg-black h-screen">
      <StatusBar style="light" backgroundColor={colors.black.default} />
      <ScrollView style={{gap: 5}} stickyHeaderIndices={[1]}>
        <View className="flex flex-row px-5 text-white w-screen justify-end items-center">
          <SquircleButton onPress={() => navigation.navigate('Day')}>
            <PlusIcon size={28} color="black" />
          </SquircleButton>
        </View>
        <View className="flex flex-row items-center px-8 fixed bg-black">
          <Text
            className="text-white"
            style={{
              fontSize: 64,
              fontFamily: fonts.MAIN_FONT_SB,
            }}>
            X
          </Text>
          <Text
            className="text-white"
            style={{
              fontSize: 32,
              fontFamily: fonts.DISPLAY_FONT,
            }}>
            days
          </Text>
        </View>
        {daysList.length ? (
          daysList.map(({timestamp, title, counter}, index) => (
            <DayBoard
              date={new Date(timestamp)}
              index={index}
              counter={counter}
              key={index}
              title={title}
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
    </View>
  );
};

export default HomeScreen;
