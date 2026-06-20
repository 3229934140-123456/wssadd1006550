import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { Reminder } from '@/types/reminder';
import dayjs from 'dayjs';
import styles from './index.module.scss';

interface ReminderCardProps {
  reminder: Reminder;
  onClick?: (id: string) => void;
}

const statusStyleMap: Record<string, string> = {
  upcoming: styles.statusUpcoming,
  due_soon: styles.statusDueSoon,
  overdue: styles.statusOverdue,
  done: styles.statusDone
};

const statusLabelMap: Record<string, string> = {
  upcoming: '待就诊',
  due_soon: '即将到期',
  overdue: '已逾期',
  done: '已完成'
};

const cardStyleMap: Record<string, string> = {
  overdue: styles.cardOverdue,
  due_soon: styles.cardDueSoon,
  done: styles.cardDone
};

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onClick }) => {
  const today = dayjs();
  const targetDate = dayjs(reminder.date);
  const diffDays = targetDate.diff(today, 'day');

  const getCountdown = () => {
    if (reminder.status === 'done') return { text: '已完成', style: styles.countdownDone };
    if (diffDays < 0) return { text: `已逾期${Math.abs(diffDays)}天`, style: styles.countdownUrgent };
    if (diffDays === 0) return { text: '今天', style: styles.countdownUrgent };
    if (diffDays <= 3) return { text: `${diffDays}天后`, style: styles.countdownUrgent };
    return { text: `${diffDays}天后`, style: styles.countdownNormal };
  };

  const countdown = getCountdown();

  return (
    <View
      className={classnames(styles.card, cardStyleMap[reminder.status])}
      onClick={() => onClick?.(reminder.id)}
    >
      <View className={styles.cardHeader}>
        <Text className={styles.typeLabel}>{reminder.typeLabel}</Text>
        <View className={classnames(styles.statusBadge, statusStyleMap[reminder.status])}>
          <Text>{statusLabelMap[reminder.status]}</Text>
        </View>
      </View>
      <View className={styles.cardBody}>
        <Text className={styles.note}>{reminder.note}</Text>
        <Text className={styles.clinicInfo}>{reminder.clinicName}</Text>
        <Text className={styles.doctorInfo}>{reminder.doctorName}医生</Text>
      </View>
      <View className={styles.cardFooter}>
        <Text className={styles.dateInfo}>{targetDate.format('MM月DD日')}</Text>
        <Text className={classnames(styles.countdown, countdown.style)}>{countdown.text}</Text>
      </View>
    </View>
  );
};

export default ReminderCard;
