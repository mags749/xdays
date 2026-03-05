import { tableSchema } from '@nozbe/watermelondb';

const DaySchema = tableSchema({
  name: 'days',
  columns: [
    { name: 'title', type: 'string' },
    { name: 'timestamp', type: 'number' },
    { name: 'counter', type: 'number', isOptional: true },
    { name: 'notify', type: 'boolean' },
  ],
});

export default DaySchema;
