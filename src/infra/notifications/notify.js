import {Platform} from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'default';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const ensureSetup = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'XDays Channel',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
};

/**
 * Schedule a local notification at `timestamp` (epoch ms).
 * Returns the notification id, or null if permission was denied / time is past.
 */
const showNotification = async ({timestamp, title, body}) => {
  if (timestamp <= Date.now()) {
    return null;
  }
  const allowed = await ensureSetup();
  if (!allowed) {
    return null;
  }
  return Notifications.scheduleNotificationAsync({
    content: {title, body},
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(timestamp),
      channelId: CHANNEL_ID,
    },
  });
};

const cancelNotification = async id => {
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
};

export {showNotification, cancelNotification};
