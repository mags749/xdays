import React from 'react';
import DashboardView from './components/DashboardView';
import {useDays} from './hooks/useDays';

export const DashboardScreen = ({navigation}) => {
  const {days, loading, sortAscending, canSort, toggleSort, deleteDay} =
    useDays();

  return (
    <DashboardView
      days={days}
      loading={loading}
      sortAscending={sortAscending}
      canSort={canSort}
      onToggleSort={toggleSort}
      onAdd={() => navigation.navigate('Day')}
      onEdit={id => navigation.navigate('Day', {id})}
      onDelete={deleteDay}
    />
  );
};
