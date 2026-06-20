import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { DentalReport } from '@/types/report';
import dayjs from 'dayjs';
import styles from './index.module.scss';

interface ReportCardProps {
  report: DentalReport;
  onClick: (id: string) => void;
}

const typeStyleMap: Record<string, string> = {
  panoramic: styles.typePanoramic,
  periapical: styles.typePeriapical,
  cbct: styles.typeCbct
};

const ReportCard: React.FC<ReportCardProps> = ({ report, onClick }) => {
  return (
    <View className={styles.card} onClick={() => onClick(report.id)}>
      <View className={styles.cardHeader}>
        <View className={classnames(styles.typeTag, typeStyleMap[report.reportType])}>
          <Text>{report.reportTypeLabel}</Text>
        </View>
        <Text className={styles.statusTag}>
          {report.status === 'published' ? '新报告' : '已查看'}
        </Text>
      </View>
      <View className={styles.cardBody}>
        <Text className={styles.clinicName}>{report.clinicName}</Text>
        <Text className={styles.doctorInfo}>检查医生：{report.doctorName}</Text>
        <Text className={styles.examArea}>检查范围：{report.examInfo.area}</Text>
      </View>
      <View className={styles.cardFooter}>
        <Text className={styles.reportDate}>{dayjs(report.reportDate).format('YYYY年MM月DD日')}</Text>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <Text className={styles.findingCount}>{report.findings.length}项发现</Text>
          {report.reminder && (
            <View className={styles.reminderBadge}>
              <Text>{report.reminder.typeLabel}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ReportCard;
