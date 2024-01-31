import React, {useEffect, useMemo, useState} from 'react';
import {differenceInCalendarDays} from 'date-fns';
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
import {colors, fonts, icons} from '../../utils/constants';
import {Days} from '../../db';
import {getDate} from '../../utils/date';
import SquircleButton from '../components/SquircleButton';

const {Back, CalendarEvent, Check} = icons;

const DayScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [counter, setCounter] = useState(null);
  const [timestamp, setTimestamp] = useState(getDate(new Date()));
  const [notify, toggleNotify] = useState(false);
  const [open, setOpen] = useState(false);
  const [needCounter, toggleCounter] = useState(false);

  useEffect(() => {
    if (!counter) {
      setCounter(null);
    }
  }, [counter]);

  const buttonDisabled = useMemo(
    () =>
      title === '' || (needCounter ? counter === '' || counter === '0' : false),
    [title, needCounter, counter],
  );

  const saveData = () => {
    if (buttonDisabled) {
      return;
    }
    const record = {
      title,
      timestamp,
      notify,
    };
    if (counter) {
      record.counter = parseInt(counter, 10);
    }
    Days.insert(record);
    navigation.goBack();
  };

  const isFutureDate = useMemo(
    () => differenceInCalendarDays(timestamp, new Date()) > 0,
    [timestamp],
  );

  const updateCounter = text => {
    let filteredText = text.replace(/\D/g, '');
    setCounter(filteredText === '0' ? '' : filteredText);
  };

  const onBlurCounter = () => {
    const parsedNumber = parseInt(counter, 10);
    if (differenceInCalendarDays(new Date(), timestamp) >= parsedNumber) {
      setCounter(`${differenceInCalendarDays(new Date(), timestamp) + 1}`);
    }
  };

  return (
    <SafeAreaView className="flex flex-1 text-white bg-black h-screen">
      <StatusBar style="light" backgroundColor={colors.black.default} />
      <DatePicker
        modal
        open={open}
        date={timestamp}
        onConfirm={date => {
          setOpen(false);
          setTimestamp(getDate(date));
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode="date"
      />
      <View className="flex flex-row px-5 text-white w-screen justify-start items-center">
        <SquircleButton onPress={() => navigation.goBack()}>
          <Back size={28} color="black" />
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
          placeholderTextColor={colors.grey.default}
          className="m-8 px-4 rounded-full bg-white text-black h-16"
          style={{fontSize: 16}}
          maxLength={50}
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
              <CalendarEvent size={28} color="black" />
            </SquircleButton>
          </View>
        </View>
        {!isFutureDate ? (
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
        ) : (
          <View className="flex flex-row mx-8 justify-between items-center">
            <Text
              className="text-white mx-2"
              style={{fontFamily: fonts.MAIN_FONT_SB, fontSize: 24}}>
              need notification?
            </Text>
            <Switch
              onValueChange={toggleNotify}
              value={notify}
              trackColor={{
                true: colors.blue.primary,
                false: colors.grey.default,
              }}
              thumbColor={colors.white.primary}
            />
          </View>
        )}
        {needCounter && (
          <View className="flex flex-row mx-8 items-center">
            <TextInput
              onChangeText={updateCounter}
              value={counter || ''}
              placeholder="Counter"
              className="my-8 px-4 rounded-full bg-white text-black h-16 text-right flex-1 w-100"
              style={{fontSize: 16}}
              inputMode="numeric"
              keyboardType="numeric"
              maxLength={4}
              onEndEditing={onBlurCounter}
            />
            <Text
              className="text-white mx-3"
              style={{fontFamily: fonts.MAIN_FONT_SB, fontSize: 24}}>
              days
            </Text>
          </View>
        )}
        <View className="flex flex-row m-9 justify-end">
          <SquircleButton
            onPress={saveData}
            color={buttonDisabled ? colors.grey.default : colors.blue.primary}>
            <Check size={28} color="white" />
          </SquircleButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DayScreen;
