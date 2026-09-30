import {useEffect, useMemo, useState} from 'react';
import {observeDays, removeDay} from '../../../infra/db/daysdb';
import {cancelNotification} from '../../../infra/notifications/notify';

const compareTitles = (a, b) => {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x > y ? 1 : y > x ? -1 : 0;
};

export function useDays() {
  // 1. State
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAscending, setSortAscending] = useState(true);

  // 2. Live list — re-emits on every insert / update / delete
  useEffect(
    () =>
      observeDays(records => {
        setDays(records);
        setLoading(false);
      }),
    [],
  );

  // 3. Derived
  const sortedDays = useMemo(
    () =>
      [...days].sort((a, b) =>
        sortAscending
          ? compareTitles(b.title, a.title)
          : compareTitles(a.title, b.title),
      ),
    [days, sortAscending],
  );

  // 4. Handlers
  const toggleSort = () => setSortAscending(prev => !prev);

  const deleteDay = async id => {
    setLoading(true); // the subscription resets it when the list updates
    const notificationId = await removeDay(id);
    cancelNotification(notificationId).catch(() => {});
  };

  return {
    days: sortedDays,
    loading,
    sortAscending,
    canSort: days.length > 1,
    toggleSort,
    deleteDay,
  };
}
