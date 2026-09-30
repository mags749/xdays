import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts, icons} from '../../../shared/constants/theme';
import SquircleButton from '../../../shared/components/SquircleButton';

const {Back, CalendarEvent, Check, Trash} = icons;

const SwitchRow = ({label, value, onValueChange}) => (
  <View className="flex flex-row mx-8 justify-between items-center">
    <Text
      className="text-white mx-2"
      style={{fontFamily: fonts.MAIN_FONT_SB, fontSize: 24}}>
      {label}
    </Text>
    <Switch
      onValueChange={onValueChange}
      value={value}
      trackColor={{true: colors.blue.primary, false: colors.grey.default}}
      thumbColor={colors.white.primary}
    />
  </View>
);

const DayForm = ({
  isEdit,
  loading,
  title,
  onTitleChange,
  timestamp,
  onTimestampChange,
  isFutureDate,
  notify,
  onNotifyChange,
  needCounter,
  onNeedCounterChange,
  counter,
  onCounterChange,
  onCounterBlur,
  canSave,
  onSave,
  onDelete,
  onBack,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const confirmDelete = () =>
    Alert.alert('Delete day', 'This entry will be removed permanently.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: onDelete},
    ]);

  if (loading) {
    return (
      <SafeAreaView className="flex flex-1 bg-black justify-center">
        <ActivityIndicator size="large" color={colors.blue.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex flex-1 text-white bg-black h-screen">
      <DatePicker
        modal
        open={pickerOpen}
        date={timestamp}
        onConfirm={date => {
          setPickerOpen(false);
          onTimestampChange(date);
        }}
        onCancel={() => setPickerOpen(false)}
        mode="date"
      />
      <View className="flex flex-row px-5 text-white w-screen justify-start items-center">
        <SquircleButton onPress={onBack}>
          <Back size={28} color="black" />
        </SquircleButton>
      </View>
      <Text
        className="text-white m-8"
        style={{fontSize: 32, fontFamily: fonts.MAIN_FONT_SB}}>
        {isEdit ? 'Edit days' : 'Add days'}
      </Text>
      <ScrollView>
        <TextInput
          onChangeText={onTitleChange}
          value={title}
          placeholder="Label"
          placeholderTextColor={colors.grey.default}
          className="m-8 px-4 rounded-full bg-white text-black h-16"
          style={{fontSize: 16}}
          maxLength={50}
        />
        <View className="flex flex-row px-8 my-8 gap-2 items-center justify-between">
          <TouchableOpacity
            onPress={() => setPickerOpen(true)}
            className="w-10/12">
            <TextInput
              value={timestamp.toDateString()}
              placeholder="Select date"
              className="px-4 rounded-full bg-white text-black h-16"
              style={{fontSize: 16}}
              readOnly
            />
          </TouchableOpacity>
          <View className="flex justify-center items-center px-4">
            <SquircleButton onPress={() => setPickerOpen(true)}>
              <CalendarEvent size={28} color="black" />
            </SquircleButton>
          </View>
        </View>
        {isFutureDate ? (
          <SwitchRow
            label="need notification?"
            value={notify}
            onValueChange={onNotifyChange}
          />
        ) : (
          <SwitchRow
            label="need a counter?"
            value={needCounter}
            onValueChange={onNeedCounterChange}
          />
        )}
        {needCounter && (
          <View className="flex flex-row mx-8 items-center">
            <TextInput
              onChangeText={onCounterChange}
              value={counter}
              placeholder="Counter"
              className="my-8 px-4 rounded-full bg-white text-black h-16 text-right flex-1 w-100"
              style={{fontSize: 16}}
              inputMode="numeric"
              keyboardType="numeric"
              maxLength={4}
              onEndEditing={onCounterBlur}
            />
            <Text
              className="text-white mx-3"
              style={{fontFamily: fonts.MAIN_FONT_SB, fontSize: 24}}>
              days
            </Text>
          </View>
        )}
        <View
          className={`flex flex-row m-9 items-center ${
            isEdit ? 'justify-between' : 'justify-end'
          }`}>
          {isEdit && (
            <SquircleButton color={colors.red.default} onPress={confirmDelete}>
              <Trash size={28} color="white" />
            </SquircleButton>
          )}
          <SquircleButton
            onPress={onSave}
            color={canSave ? colors.blue.primary : colors.grey.default}>
            <Check size={28} color="white" />
          </SquircleButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DayForm;
