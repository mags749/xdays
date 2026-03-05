import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import migrations from './migrations';
import Day from './models/Day';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'xdays',
  // JSI mode: faster synchronous access, supported on RN 0.71+ (including 0.79)
  jsi: true,
  onSetUpError: error => {
    console.error('WatermelonDB setup error:', error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [Day],
});

export default database;

/** Get the Days collection */
export const getDaysCollection = () => database.get('days');

/** Live observable of all days — emits on every change */
export const observeDays = () => getDaysCollection().query().observe();

/** Insert a new day record */
export const insertDay = async ({title, timestamp, counter, notify}) => {
  await database.write(async () => {
    await getDaysCollection().create(day => {
      day.title = title;
      // Store timestamp as epoch ms (number) — consistent across the app
      day.timestamp =
        timestamp instanceof Date ? timestamp.getTime() : timestamp;
      day.counter = counter || null;
      day.notify = notify || false;
    });
  });
};

/** Permanently delete a day by its id */
export const removeDay = async id => {
  await database.write(async () => {
    const record = await getDaysCollection().find(id);
    await record.destroyPermanently();
  });
};
