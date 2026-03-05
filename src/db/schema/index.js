import {appSchema, tableSchema} from '@nozbe/watermelondb';

const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'days',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'timestamp', type: 'number'},
        {name: 'counter', type: 'number', isOptional: true},
        {name: 'notify', type: 'boolean'},
      ],
    }),
  ],
});

export default schema;
