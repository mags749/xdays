import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, fonts, icons} from '../../utils/constants';
import {observeDays, removeDay} from '../../db';
import {cancelNotification} from '../../utils/notify';
import DayBoard from './DayBoard';
import SquircleButton from '../components/SquircleButton';
import {SafeAreaView} from 'react-native-safe-area-context';

const {Add, Ascending, Descending} = icons;

const HomeScreen = ({navigation}) => {
  const [daysList, setDaysList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    // Live list of days (expired counters are purged inside the db layer).
    // Re-runs on every insert/delete, and returns the unsubscribe function.
    return observeDays(records => {
      setDaysList(records);
      setLoading(false);
    });
  }, []);

  const handleDelete = async id => {
    setLoading(true);
    const notificationId = await removeDay(id);
    // The subscription above resets `loading` once the list updates.
    cancelNotification(notificationId).catch(() => {});
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
          <>
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
