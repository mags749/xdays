import {format} from 'date-fns/format';
import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {SquircleView} from 'react-native-figma-squircle';
import NumView from './NumView';
import DayBoardTitle from './DayBoardTitle';
import {fonts} from '../utils/constants';

const colors = ['#92E498', '#FBFE63', '#A8EBF9', '#F0B27A'];

const DayBoard = ({date, index, title}) => {
  const completeDiff = useMemo(() => {
    const currDate = new Date();
    const startYear = date.getFullYear();
    const february =
      (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
        ? 29
        : 28;
    const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let yearDiff = currDate.getFullYear() - startYear;
    let monthDiff = currDate.getMonth() - date.getMonth();
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }
    let dayDiff = currDate.getDate() - date.getDate();
    if (dayDiff < 0) {
      if (monthDiff > 0) {
        monthDiff--;
      } else {
        yearDiff--;
        monthDiff = 11;
      }
      dayDiff += daysInMonth[date.getMonth()];
    }

    let returnVal = {
      year: yearDiff,
      month: monthDiff,
      day: dayDiff,
    };
    return returnVal;
  }, [date]);

  return (
    <SquircleView
      className="min-h-48 w-100 mx-6 my-2"
      squircleParams={{
        cornerSmoothing: 0.9,
        cornerRadius: 50,
        fillColor: colors[index % colors.length],
      }}>
      <View
        className="flex flex-col p-8 w-100 justify-between min-h-80 items-end relative"
        style={{rowGap: 10}}>
        <DayBoardTitle title={title} />
        <View
          className="flex flex-row justify-between items-center"
          style={{columnGap: 10}}>
          {Object.keys(completeDiff).map((key, index) => (
            <NumView num={completeDiff[key]} title={key} key={index} />
          ))}
        </View>
        <View className="flex flex-row items-center" style={{columnGap: 4}}>
          <Text
            className="text-gray"
            style={{fontFamily: fonts.MAIN_FONT, fontSize: 16}}>
            since{' '}
          </Text>
          <Text
            className="text-black text-2xl uppercase"
            style={{fontFamily: fonts.DISPLAY_FONT}}>
            {format(date, 'MMM dd, yyyy')}
          </Text>
        </View>
      </View>
    </SquircleView>
  );
};

export default DayBoard;
