import React, {useMemo} from 'react';
import {
  add,
  compareAsc,
  format,
  differenceInCalendarDays,
  intervalToDuration,
} from 'date-fns';
import {SquircleView} from 'react-native-figma-squircle';
import {Swipeable} from 'react-native-gesture-handler';
import {Text, View} from 'react-native';
import {colors, fonts, icons} from '../../utils/constants';
import {getDate} from '../../utils/date';
import DayBoardTitle from './DayBoardTitle';
import NumView from './NumView';
import SquircleButton from '../components/SquircleButton';

const {CalenderDate, HourGlass, X} = icons;

const boardColors = [
  colors.green.flat,
  colors.yellow.flat,
  colors.blue.flat,
  colors.orange.flat,
];

const DateText = ({value}) => (
  <Text
    style={{
      fontSize: 16,
      color: colors.black.default,
      fontFamily: fonts.DISPLAY_FONT,
    }}>
    {value}
  </Text>
);

const DayBoard = ({counter, date, index, title, onDelete}) => {
  const dateRef = counter ? add(date, {days: counter}) : date;
  const currDate = getDate(new Date());

  const dateIsPast = useMemo(
    () => compareAsc(dateRef, currDate) === -1,
    [dateRef, currDate],
  );

  const completeDiff = useMemo(() => {
    const {days, months, years} = intervalToDuration({
      start: dateIsPast ? dateRef : currDate,
      end: dateIsPast ? currDate : dateRef,
    });
    let returnVal = {
      year: years || 0,
      month: months || 0,
      day: days || 0,
    };
    return returnVal;
  }, [dateRef, currDate, dateIsPast]);

  const isToday = useMemo(
    () => Object.keys(completeDiff).every(key => completeDiff[key] === 0),
    [completeDiff],
  );

  const onSwipeLeft = () => (
    <View className="flex justify-center items-end px-4">
      <SquircleButton color={colors.red.default} onPress={onDelete}>
        <X size={28} color={colors.black.default} />
      </SquircleButton>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={onSwipeLeft}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={200}>
      <SquircleView
        className="min-h-48 w-100 mx-6 my-2"
        squircleParams={{
          cornerSmoothing: 0.9,
          cornerRadius: 50,
          fillColor: boardColors[index % boardColors.length],
        }}>
        <View
          className="flex flex-col p-8 w-100 justify-between min-h-80 items-end relative"
          style={{rowGap: 10}}>
          <DayBoardTitle title={title} />
          <View
            className="flex flex-row justify-between items-center"
            style={{columnGap: 10}}>
            {isToday && (
              <>
                <View className="flex flex-col items-end opacity-50">
                  <CalenderDate size={16} color={colors.black.default} />
                  <Text style={{fontSize: 16, color: colors.black.default}}>
                    It's the{' '}
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.black.default,
                    fontSize: 54,
                    fontFamily: fonts.DISPLAY_FONT_B,
                  }}>
                  DAY!
                </Text>
              </>
            )}
            {!isToday &&
              (!counter ? (
                Object.keys(completeDiff).map((key, idx) => (
                  <NumView num={completeDiff[key]} title={key} key={idx} />
                ))
              ) : (
                <>
                  <View
                    className="flex flex-col px-4 items-end opacity-50 self-end"
                    style={{marginBottom: -2}}>
                    <HourGlass size={16} color={colors.black.default} />
                    <DateText value={format(date, 'MMM')} />
                    <DateText value={format(date, 'dd')} />
                    <DateText value={format(date, 'yyyy')} />
                  </View>
                  <NumView
                    num={differenceInCalendarDays(dateRef, new Date())}
                    title={'day'}
                  />
                </>
              ))}
          </View>
          <View className="flex flex-row items-center" style={{columnGap: 4}}>
            <Text
              className="text-black opacity-50"
              style={{
                fontFamily: fonts.MAIN_FONT,
                fontSize: 16,
              }}>
              {isToday ? ' ' : dateIsPast ? 'since ' : 'to '}
            </Text>
            <Text
              className="text-black text-2xl uppercase"
              style={{fontFamily: fonts.DISPLAY_FONT}}>
              {format(dateRef, 'MMM dd, yyyy')}
            </Text>
          </View>
        </View>
      </SquircleView>
    </Swipeable>
  );
};

export default DayBoard;
