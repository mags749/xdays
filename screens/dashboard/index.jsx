import React from 'react';
import {ScrollView, StatusBar, Text, View} from 'react-native';
import DayBoard from './DayBoard';
import {parse} from 'date-fns/parse';
import SquircleButton from '../components/SquircleButton';
import {PlusIcon} from 'react-native-heroicons/solid';
import {fonts} from '../utils/constants';

const HomeScreen = ({navigation}) => {
  return (
    <View className="flex flex-1 text-white bg-black h-screen">
      <StatusBar style="light" backgroundColor="#000000" />
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
        <View className="flex flex-col items-center justify-center h-80">
          <Text className="text-white" style={{fontSize: 32}}>
            Nothing to show!
          </Text>
          <Text className="text-white" style={{fontSize: 24}}>
            Add something.
          </Text>
        </View>
        {/* {[
          '12/20/2023',
          '03/12/1987',
          '02/05/1995',
          '12/18/2018',
          '11/16/2016',
        ].map((item, index) => (
          <DayBoard
            date={parse(item, 'MM/dd/yyyy', new Date())}
            index={index}
            key={index}
            title={`Nityas birthday`}
          />
        ))} */}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
