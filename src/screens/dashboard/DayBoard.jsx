import {add, compareAsc, format, differenceInCalendarDays} from 'date-fns';
import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {SquircleView} from 'react-native-figma-squircle';
import NumView from './NumView';
import DayBoardTitle from './DayBoardTitle';
import {colors, fonts} from '../../utils/constants';
import {CalendarDaysIcon, ClockIcon} from 'react-native-heroicons/solid';

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

const DayBoard = ({counter, date, index, title}) => {
  const dateRef = counter ? add(date, {days: counter}) : date;

  const dateIsPast = useMemo(() => compareAsc(dateRef, new Date()) === -1);

  const completeDiff = useMemo(() => {
    const currDate = new Date();
    const startYear = dateRef.getFullYear();
    const february =
      (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
        ? 29
        : 28;
    const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let yearDiff = dateIsPast
      ? currDate.getFullYear() - startYear
      : startYear - currDate.getFullYear();
    let monthDiff = dateIsPast
      ? currDate.getMonth() - dateRef.getMonth()
      : dateRef.getMonth() - currDate.getMonth();
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }
    let dayDiff = dateIsPast
      ? currDate.getDate() - dateRef.getDate()
      : dateRef.getDate() - currDate.getDate();
    if (dayDiff < 0) {
      if (monthDiff > 0) {
        monthDiff--;
      } else {
        yearDiff--;
        monthDiff = 11;
      }
      dayDiff += daysInMonth[dateRef.getMonth()];
    }

    let returnVal = {
      year: yearDiff,
      month: monthDiff,
      day: dayDiff,
    };
    return returnVal;
  }, [dateRef]);

  const isToday = useMemo(
    () => Object.keys(completeDiff).every(key => completeDiff[key] === 0),
    [completeDiff],
  );

  return (
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
              <CalendarDaysIcon size={16} color={colors.black.default} />
              <Text style={{fontSize: 16, color: colors.black.default}}>
                It's the{' '}
              </Text>
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
          {!counter ? (
            Object.keys(completeDiff).map((key, index) => (
              <NumView num={completeDiff[key]} title={key} key={index} />
            ))
          ) : (
            <>
              <View
                className="flex flex-col px-4 items-end opacity-50 self-end"
                style={{marginBottom: -2}}>
                <ClockIcon size={16} color={colors.black.default} />
                <DateText value={format(date, 'MMM')} />
                <DateText value={format(date, 'dd')} />
                <DateText value={format(date, 'yyyy')} />
              </View>
              <NumView
                num={differenceInCalendarDays(dateRef, new Date())}
                title={'day'}
              />
            </>
          )}
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
  );
};

export default DayBoard;
