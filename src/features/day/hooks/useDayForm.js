import {useEffect, useMemo, useRef, useState} from 'react';
import {differenceInCalendarDays} from 'date-fns';
import {
  fetchDay,
  insertDay,
  removeDay,
  updateDay,
} from '../../../infra/db/daysdb';
import {cancelNotification} from '../../../infra/notifications/notify';
import {getDate} from '../../../shared/utils/date';
import {scheduleDayReminder} from '../day.reminders';

export function useDayForm({dayId, onDone}) {
  const isEdit = dayId != null;

  // 1. State & refs
  const [title, setTitle] = useState('');
  const [timestamp, setTimestampState] = useState(() => getDate(new Date()));
  const [notify, setNotify] = useState(false);
  const [needCounter, setNeedCounter] = useState(false);
  const [counter, setCounter] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const busy = useRef(false); // guards against double taps while async work runs

  // 2. Derived values
  const isFutureDate = useMemo(
    () => differenceInCalendarDays(timestamp, new Date()) > 0,
    [timestamp],
  );

  const canSave = useMemo(
    () => title !== '' && (!needCounter || !!counter),
    [title, needCounter, counter],
  );

  // 3. Side effects — load the entry when editing
  useEffect(() => {
    if (!isEdit) {
      return undefined;
    }
    let cancelled = false;
    fetchDay(dayId)
      .then(day => {
        if (cancelled) {
          return;
        }
        if (!day) {
          onDone(); // entry vanished (deleted / counter expired)
          return;
        }
        setTitle(day.title);
        setTimestampState(new Date(day.timestamp));
        setNotify(day.notify);
        setNeedCounter(day.counter > 0);
        setCounter(day.counter > 0 ? `${day.counter}` : '');
        setLoading(false);
      })
      .catch(e => {
        console.warn('Could not load day', e);
        onDone();
      });
    return () => {
      cancelled = true;
    };
    // onDone is intentionally excluded: a changing callback must not refetch
    // and overwrite what the user is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayId, isEdit]);

  // 4. Handlers
  const setTimestamp = date => setTimestampState(getDate(date));

  const changeCounter = text => {
    const digits = text.replace(/\D/g, '');
    setCounter(digits === '0' ? '' : digits);
  };

  const normalizeCounter = () => {
    const elapsed = differenceInCalendarDays(new Date(), timestamp);
    if (elapsed >= parseInt(counter, 10)) {
      setCounter(`${elapsed + 1}`);
    }
  };

  const save = async () => {
    if (!canSave || busy.current) {
      return;
    }
    busy.current = true;
    try {
      const counterDays = needCounter && counter ? parseInt(counter, 10) : null;
      const fields = {title, timestamp, notify, counter: counterDays};

      let id = dayId;
      if (isEdit) {
        const previousNotificationId = await updateDay(dayId, fields);
        await cancelNotification(previousNotificationId).catch(() => {});
      } else {
        id = await insertDay(fields);
      }

      await scheduleDayReminder({id, title, timestamp, counterDays, notify});
      onDone();
    } finally {
      busy.current = false;
    }
  };

  const remove = async () => {
    if (!isEdit || busy.current) {
      return;
    }
    busy.current = true;
    try {
      const notificationId = await removeDay(dayId);
      await cancelNotification(notificationId).catch(() => {});
      onDone();
    } finally {
      busy.current = false;
    }
  };

  return {
    isEdit,
    loading,
    title,
    setTitle,
    timestamp,
    setTimestamp,
    isFutureDate,
    notify,
    setNotify,
    needCounter,
    setNeedCounter,
    counter,
    changeCounter,
    normalizeCounter,
    canSave,
    save,
    remove,
  };
}
