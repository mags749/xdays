import {set} from 'date-fns';

const getDate = date =>
  set(date, {
    hours: 6,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

export {getDate};
