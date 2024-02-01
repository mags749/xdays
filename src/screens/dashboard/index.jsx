import React, {useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {add, differenceInCalendarDays, toDate} from 'date-fns';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {colors, fonts, icons} from '../../utils/constants';
import {Days} from '../../db';
import DayBoard from './DayBoard';
import SquircleButton from '../components/SquircleButton';
import {showNotification} from '../../utils/notify';

const {Add} = icons;

const HomeScreen = ({navigation}) => {
  const [daysList, setDaysList] = useState(Days.data());
  const [loading, setLoading] = useState(true);

  const dataChange = async ({event, changed}) => {
    if (
      event === 'loaded' ||
      ((event === 'insert' || event === 'remove') && changed.length)
    ) {
      const data = Days.data();
      setDaysList(data);
    }
    if (event === 'loaded') {
      setLoading(true);
      Days.data().forEach(function (item) {
        if (
          item.counter > 0 &&
          differenceInCalendarDays(new Date(), item.timestamp) > item.counter
        ) {
          Days.remove(item, true);
        }
      });
      setLoading(false);
    }
    if (event === 'loaded' || (event === 'remove' && changed.length)) {
      setLoading(false);
    }
    if (event === 'insert') {
      const {notify, counter} = changed[0];
      if (notify || counter) {
        const {title, timestamp} = changed[0];
        const newDate = counter
          ? add(timestamp, {days: counter})
          : toDate(timestamp);

        showNotification({
          title,
          body: counter ? "Counter end's today" : 'Today is the Day!',
          timestamp: newDate.getTime(),
        });
      }
    }
  };

  Days.onChange(dataChange);

  return (
    <View className="flex flex-1 text-white bg-black h-screen">
      <StatusBar style="light" backgroundColor={colors.black.default} />
      <ScrollView style={{gap: 5}} stickyHeaderIndices={[1]}>
        <View className="flex flex-row px-5 text-white w-screen justify-end items-center">
          <SquircleButton onPress={() => navigation.navigate('Day')}>
            <Add size={28} color="black" />
          </SquircleButton>
        </View>
        <View
          className="flex flex-row items-center px-8 fixed bg-black"
          style={{marginBottom: 48}}>
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
        {loading ? (
          <ActivityIndicator size="large" color={colors.blue.primary} />
        ) : (
          <GestureHandlerRootView>
            {daysList.length ? (
              daysList.map(({timestamp, title, counter, id}, index) => (
                <DayBoard
                  date={new Date(timestamp)}
                  index={index}
                  counter={counter}
                  key={index}
                  title={title}
                  onDelete={() => {
                    setLoading(true);
                    Days.remove(id, true);
                  }}
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
          </GestureHandlerRootView>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
