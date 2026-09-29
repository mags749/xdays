import * as SQLite from 'expo-sqlite';
import {differenceInCalendarDays} from 'date-fns';

const DB_NAME = 'xdays.db';
const SCHEMA_VERSION = 1;

const db = SQLite.openDatabaseSync(DB_NAME);

/**
 * Versioned migrations, tracked with SQLite's `PRAGMA user_version`.
 * Add a new entry to run on next launch when the schema changes.
 */
const migrations = [
  // v1 — initial schema
  `CREATE TABLE IF NOT EXISTS days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    counter INTEGER,
    notify INTEGER NOT NULL DEFAULT 0,
    notification_id TEXT
  );`,
];

let ready = null;

const init = () => {
  if (!ready) {
    ready = (async () => {
      const row = await db.getFirstAsync('PRAGMA user_version');
      let version = row?.user_version ?? 0;
      while (version < SCHEMA_VERSION) {
        await db.execAsync(migrations[version]);
        version += 1;
        await db.execAsync(`PRAGMA user_version = ${version}`);
      }
    })();
  }
  return ready;
};

const toDay = row => ({
  id: row.id,
  title: row.title,
  timestamp: row.timestamp,
  counter: row.counter,
  notify: !!row.notify,
  notificationId: row.notification_id,
});

// --- change subscriptions (replaces Vasern's onChange / Watermelon's observe) ---
const listeners = new Set();
const emit = async () => {
  if (!listeners.size) {
    return;
  }
  const days = await fetchDays();
  listeners.forEach(cb => cb(days));
};

/** Delete counter entries whose counter window has fully elapsed. */
const purgeExpired = async () => {
  const rows = await db.getAllAsync(
    'SELECT id, timestamp, counter FROM days WHERE counter > 0',
  );
  const now = new Date();
  const expired = rows.filter(
    r => differenceInCalendarDays(now, new Date(r.timestamp)) > r.counter,
  );
  for (const r of expired) {
    await db.runAsync('DELETE FROM days WHERE id = ?', r.id);
  }
};

/** Fetch all days (expired counters are purged first). */
export const fetchDays = async () => {
  await init();
  await purgeExpired();
  const rows = await db.getAllAsync('SELECT * FROM days ORDER BY id ASC');
  return rows.map(toDay);
};

/**
 * Subscribe to the list of days. Emits once immediately and again after every
 * insert / delete. Returns an unsubscribe function.
 */
export const observeDays = cb => {
  listeners.add(cb);
  fetchDays().then(cb);
  return () => listeners.delete(cb);
};

/** Insert a new day; returns the new row id. */
export const insertDay = async ({
  title,
  timestamp,
  counter,
  notify,
  notificationId,
}) => {
  await init();
  const result = await db.runAsync(
    'INSERT INTO days (title, timestamp, counter, notify, notification_id) VALUES (?, ?, ?, ?, ?)',
    title,
    timestamp instanceof Date ? timestamp.getTime() : timestamp,
    counter ?? null,
    notify ? 1 : 0,
    notificationId ?? null,
  );
  await emit();
  return result.lastInsertRowId;
};

/** Attach a scheduled-notification id to an existing row. */
export const setNotificationId = async (id, notificationId) => {
  await init();
  await db.runAsync(
    'UPDATE days SET notification_id = ? WHERE id = ?',
    notificationId,
    id,
  );
};

/** Delete a day by id; returns its notification id (if any) so it can be cancelled. */
export const removeDay = async id => {
  await init();
  const row = await db.getFirstAsync(
    'SELECT notification_id FROM days WHERE id = ?',
    id,
  );
  await db.runAsync('DELETE FROM days WHERE id = ?', id);
  await emit();
  return row?.notification_id ?? null;
};
