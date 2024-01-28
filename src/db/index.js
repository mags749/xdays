import Vasern from 'vasern';
import DaySchema from './schema/Day';
import {useState} from 'react';

const VasernDB = new Vasern({
  schemas: [DaySchema],
  version: 1,
});

const {Days} = VasernDB;

const useVasernData = Table => {
  const [tableData, setTableData] = useState(Table.data());

  Table.onChange(({event, changed}) => {
    if (
      event === 'loaded' ||
      ((event === 'insert' || event === 'update' || event === 'remove') &&
        changed.length)
    ) {
      console.info('Updating data');
      console.info({data: Table.data()});
      setTableData(Table.data());
    }
  });

  return tableData;
};

export default VasernDB;
export {Days, useVasernData};
