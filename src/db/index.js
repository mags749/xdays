import Vasern from 'vasern';
import DaySchema from './schema/Day';

const VasernDB = new Vasern({
  schemas: [DaySchema],
  version: 1,
});

const {Days} = VasernDB;

export default VasernDB;
export {Days};
