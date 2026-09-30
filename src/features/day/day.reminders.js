import {add, toDate} from 'date-fns';
import {setNotificationId} from '../../infra/db/daysdb';
import {showNotification} from '../../infra/notifications/notify';

/** Schedule a reminder for a day and store its id. Never throws. */
export const scheduleDayReminder = async ({
  id,
  title,
  timestamp,
  counterDays,
  notify,
}) => {
  if (!notify && !counterDays) {
    return;
  }
  try {
    const target = counterDays
      ? add(timestamp, {days: counterDays})
      : toDate(timestamp);

    const notificationId = await showNotification({
      title,
      body: counterDays ? "Counter end's today" : 'Today is the Day!',
      timestamp: target.getTime(),
    });
    if (notificationId) {
      await setNotificationId(id, notificationId);
    }
  } catch (e) {
    // Never block saving because a reminder couldn't be scheduled
    console.warn('Could not schedule notification', e);
  }
};
