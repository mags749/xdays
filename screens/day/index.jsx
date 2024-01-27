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
import {fonts} from '../utils/constants';

const DayScreen = ({navigation}) => {
  const [label, setLabel] = useState('');
  const [counter, setCounter] = useState('');
  const [day, setDay] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [needCounter, toggleCounter] = useState(false);

  const buttonDisabled = useMemo(
    () => label === '' || (needCounter ? counter === '' : false),
    [label, needCounter, counter],
  );

  return (
    <SafeAreaView className="flex flex-1 text-white bg-black h-screen">
      <StatusBar style="light" backgroundColor="#000000" />
      <DatePicker
        modal
        open={open}
        date={day}
        onConfirm={date => {
          setOpen(false);
          setDay(date);
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
          onChangeText={setLabel}
          value={label}
          placeholder="Label"
          className="m-8 px-4 rounded-full bg-white text-black h-16"
          style={{fontSize: 16}}
        />
        <View className="flex flex-row px-8 m-8 gap-2 items-center">
          <TextInput
            value={day.toDateString()}
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
        <View className="flex flex-row mx-8 justify-between items-center">
          <Text
            className="text-white mx-2"
            style={{fontFamily: fonts.MAIN_FONT_SB, fontSize: 24}}>
            need a counter?
          </Text>
          <Switch
            className=""
            onValueChange={toggleCounter}
            value={needCounter}
            trackColor={{true: '#3498db', false: '#bdc3c7'}}
            thumbColor="#ecf0f1"
          />
        </View>
        {needCounter && (
          <TextInput
            onChangeText={text => setCounter(text.replace(/\D/g, ''))}
            value={counter}
            placeholder="Counter"
            className="m-8 px-4 rounded-full bg-white text-black h-16 text-right"
            style={{fontSize: 16}}
            inputMode="numeric"
            keyboardType="numeric"
          />
        )}
        <View className="flex flex-row m-9 justify-end">
          <SquircleButton
            onPress={() => console.info(buttonDisabled ? 'Disabled' : 'Saving')}
            color={buttonDisabled ? '#bdc3c7' : '#3498db'}>
            <CheckIcon size={28} color="white" />
          </SquircleButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DayScreen;
