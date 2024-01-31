import notifee, {EventType, TriggerType} from '@notifee/react-native';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    await notifee.cancelNotification(notification.id);
  }
});

const showNotification = async ({timestamp, title, body}) => {
  await notifee.requestPermission();

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp,
  };

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'XDays Channel',
  });

  await notifee.createTriggerNotification(
    {
      title,
      body,
      android: {
        channelId,
        smallIcon: 'ic_notification',
      },
    },
    trigger,
  );
};

export {showNotification};
