import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockReminders } from '@/data/reminders';
import ReminderCard from '@/components/ReminderCard';
import styles from './index.module.scss';

const tabOptions = [
  { label: '全部', value: 'all' },
  { label: '待就诊', value: 'pending' },
  { label: '已完成', value: 'done' }
];

const RemindPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredReminders = useMemo(() => {
    if (activeTab === 'all') return mockReminders;
    if (activeTab === 'pending') return mockReminders.filter(r => r.status !== 'done');
    return mockReminders.filter(r => r.status === 'done');
  }, [activeTab]);

  const urgentReminders = useMemo(() =>
    filteredReminders.filter(r => r.status === 'overdue' || r.status === 'due_soon'),
    [filteredReminders]
  );

  const normalReminders = useMemo(() =>
    filteredReminders.filter(r => r.status === 'upcoming'),
    [filteredReminders]
  );

  const doneReminders = useMemo(() =>
    filteredReminders.filter(r => r.status === 'done'),
    [filteredReminders]
  );

  const handleReminderClick = (id: string) => {
    const reminder = mockReminders.find(r => r.id === id);
    if (reminder) {
      Taro.navigateTo({ url: `/pages/report/index?id=${reminder.reportId}` });
    }
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>复诊提醒</Text>
        <Text className={styles.headerDesc}>按时复诊，口腔更健康</Text>
      </View>

      <View className={styles.tabs}>
        {tabOptions.map(opt => (
          <View
            key={opt.value}
            className={classnames(styles.tab, activeTab === opt.value && styles.tabActive)}
            onClick={() => setActiveTab(opt.value)}
          >
            <Text className={styles.tabText}>{opt.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.listContainer}>
        {urgentReminders.length > 0 && (
          <View className={styles.urgentSection}>
            <View style={{ display: 'flex', alignItems: 'center', marginBottom: '16rpx' }}>
              <Text className={styles.sectionTitle}>需要关注</Text>
              <View className={styles.countBadge}>
                <Text className={styles.countText}>{urgentReminders.length}</Text>
              </View>
            </View>
            {urgentReminders.map(r => (
              <ReminderCard key={r.id} reminder={r} onClick={handleReminderClick} />
            ))}
          </View>
        )}

        {normalReminders.length > 0 && (
          <View className={styles.normalSection}>
            <Text className={styles.sectionTitle}>即将到来</Text>
            {normalReminders.map(r => (
              <ReminderCard key={r.id} reminder={r} onClick={handleReminderClick} />
            ))}
          </View>
        )}

        {doneReminders.length > 0 && (
          <View className={styles.doneSection}>
            <Text className={styles.sectionTitle}>已完成</Text>
            {doneReminders.map(r => (
              <ReminderCard key={r.id} reminder={r} onClick={handleReminderClick} />
            ))}
          </View>
        )}

        {filteredReminders.length === 0 && (
          <View className={styles.emptyHint}>
            <Text className={styles.emptyText}>暂无提醒</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RemindPage;
