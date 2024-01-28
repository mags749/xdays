const DaySchema = {
  name: 'Days',
  props: {
    title: 'string',
    timestamp: 'datetime',
    counter: '?int',
    notify: 'boolean',
  },
};

export default DaySchema;
