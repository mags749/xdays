import React from 'react';
import DayForm from './components/DayForm';
import {useDayForm} from './hooks/useDayForm';

export const DayScreen = ({navigation, route}) => {
  const goBack = () => navigation.goBack();
  const form = useDayForm({dayId: route.params?.id, onDone: goBack});

  return (
    <DayForm
      isEdit={form.isEdit}
      loading={form.loading}
      title={form.title}
      onTitleChange={form.setTitle}
      timestamp={form.timestamp}
      onTimestampChange={form.setTimestamp}
      isFutureDate={form.isFutureDate}
      notify={form.notify}
      onNotifyChange={form.setNotify}
      needCounter={form.needCounter}
      onNeedCounterChange={form.setNeedCounter}
      counter={form.counter}
      onCounterChange={form.changeCounter}
      onCounterBlur={form.normalizeCounter}
      canSave={form.canSave}
      onSave={form.save}
      onDelete={form.remove}
      onBack={goBack}
    />
  );
};
