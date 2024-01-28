import React, {useMemo, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
} from 'react-native-heroicons/solid';
import SquircleButton from '../components/SquircleButton';
import {colors, fonts} from '../../utils/constants';
import {Days} from '../../db';
import {compareAsc, differenceInCalendarDays} from 'date-fns';

const DayScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [counter, setCounter] = useState(null);
  const [timestamp, setTimestamp] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [needCounter, toggleCounter] = useState(false);

  const buttonDisabled = useMemo(
    () =>
      title === '' || (needCounter ? counter === '' || counter === '0' : false),
    [title, needCounter, counter],
  );

  const saveData = () => {
    if (buttonDisabled) return;
    const record = {
      title,
      timestamp,
    };
    if (counter) {
      record.counter = parseInt(counter);
    }
    Days.insert(record);
    navigation.goBack();
  };

  const isFutureDate = useMemo(
    () => differenceInCalendarDays(timestamp, new Date()) > 0,
    [timestamp],
  );

  return (
    <SafeAreaView className="flex flex-1 text-white bg-black h-screen">
      <StatusBar style="light" backgroundColor={colors.black.default} />
      <DatePicker
        modal
        open={open}
        date={timestamp}
        onConfirm={date => {
          setOpen(false);
          setTimestamp(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode="date"
      />
      <View className="flex flex-row px-5 text-white w-screen justify-start items-center">
        <SquircleButton onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={28} color="black" />
        </SquircleButton>
      </View>
      <Text
        className="text-white m-8"
        style={{
          fontSize: 32,
          fontFamily: fonts.MAIN_FONT_SB,
        }}>
        Add days
      </Text>
      <ScrollView>
        <TextInput
          onChangeText={setTitle}
          value={title}
          placeholder="Label"
          className="m-8 px-4 rounded-full bg-white text-black h-16"
          style={{fontSize: 16}}
        />
        <View className="flex flex-row px-8 m-8 gap-2 items-center">
          <TextInput
            value={timestamp.toDateString()}
            placeholder="Select date"
            className="px-4 rounded-full bg-white text-black h-16 w-10/12"
            style={{fontSize: 16}}
            readOnly
          />
          <View className="flex justify-center items-center px-4">
            <SquircleButton onPress={() => setOpen(true)}>
              <CalendarIcon size={28} color="black" />
            </SquircleButton>
          </View>
        </View>
        {!isFutureDate && (
          <View className="flex flex-row mx-8 justify-between items-center">
            <Text
              className="text-white mx-2"
              style={{fontFamily: fonts.MAIN_FONT_SB, fontSize: 24}}>
              need a counter?
            </Text>
            <Switch
              onValueChange={toggleCounter}
              value={needCounter}
              trackColor={{
                true: colors.blue.primary,
                false: colors.grey.default,
              }}
              thumbColor={colors.white.primary}
            />
          </View>
        )}
        {needCounter && (
          <TextInput
            onChangeText={text =>
              setCounter(text === '0' ? '' : text.replace(/\D/g, ''))
            }
            value={counter || ''}
            placeholder="Counter"
            className="m-8 px-4 rounded-full bg-white text-black h-16 text-right"
            style={{fontSize: 16}}
            inputMode="numeric"
            keyboardType="numeric"
          />
        )}
        <View className="flex flex-row m-9 justify-end">
          <SquircleButton
            onPress={saveData}
            color={buttonDisabled ? colors.grey.default : colors.blue.primary}>
            <CheckIcon size={28} color="white" />
          </SquircleButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DayScreen;
