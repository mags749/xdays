import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {add, differenceInCalendarDays, toDate} from 'date-fns';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {colors, fonts, icons} from '../../utils/constants';
import {observeDays, removeDay, insertDay} from '../../db';
import DayBoard from './DayBoard';
import SquircleButton from '../components/SquircleButton';
import {SafeAreaView} from 'react-native-safe-area-context';

const {Add, Ascending, Descending} = icons;

const HomeScreen = ({navigation}) => {
  const [daysList, setDaysList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    // Subscribe to live WatermelonDB query
    const subscription = observeDays().subscribe(async records => {
      // Auto-delete expired counter entries
      const now = new Date();
      for (const item of records) {
        if (
          item.counter > 0 &&
          differenceInCalendarDays(now, new Date(item.timestamp)) > item.counter
        ) {
          await removeDay(item.id);
        }
      }
      // Re-query after potential deletions — the observable will fire again
      setDaysList(records);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDelete = async id => {
    setLoading(true);
    await removeDay(id);
    // Loading will be reset by the subscription update
  };

  const memoDaysList = useMemo(
    () =>
      daysList.length
        ? [...daysList].sort((a, b) => {
            const sort = (a, b) =>
              a.toLowerCase() > b.toLowerCase()
                ? 1
                : b.toLowerCase() > a.toLowerCase()
                  ? -1
                  : 0;
            return !sortAscending
              ? sort(a.title, b.title)
              : sort(b.title, a.title);
          })
        : daysList,
    [sortAscending, daysList],
  );

  return (
    <SafeAreaView className="flex flex-1 text-white bg-black h-screen">
      <StatusBar style="light" backgroundColor={colors.black.default} />
      <ScrollView style={{gap: 5}} stickyHeaderIndices={[1]}>
        <View className="flex flex-row px-5 text-white w-screen justify-end items-center">
          <SquircleButton onPress={() => navigation.navigate('Day')}>
            <Add size={28} color="black" />
          </SquircleButton>
        </View>
        <View className="flex flex-row justify-between items-center px-8 bg-black/80">
          <View
            className="flex flex-row items-center px-8 fixed"
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
          <TouchableOpacity onPress={() => setSortAscending(!sortAscending)}>
            {![0, 1].includes(daysList.length) &&
              (sortAscending ? (
                <Ascending size={24} color={colors.white.primary} />
              ) : (
                <Descending size={24} color={colors.white.primary} />
              ))}
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={colors.blue.primary} />
        ) : (
          <GestureHandlerRootView>
            {memoDaysList.length ? (
              memoDaysList.map(({timestamp, title, counter, id}, index) => (
                <DayBoard
                  date={new Date(timestamp)}
                  index={index}
                  counter={counter}
                  key={id}
                  title={title}
                  onDelete={() => handleDelete(id)}
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
    </SafeAreaView>
  );
};

export default HomeScreen;
