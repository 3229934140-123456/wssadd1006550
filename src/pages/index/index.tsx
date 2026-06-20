import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockReports } from '@/data/reports';
import ReportCard from '@/components/ReportCard';
import styles from './index.module.scss';

const filterOptions: { label: string; value: string }[] = [
  { label: '全部', value: 'all' },
  { label: '全景片', value: 'panoramic' },
  { label: '根尖片', value: 'periapical' },
  { label: 'CBCT', value: 'cbct' }
];

const IndexPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredReports = useMemo(() => {
    if (activeFilter === 'all') return mockReports;
    return mockReports.filter(r => r.reportType === activeFilter);
  }, [activeFilter]);

  const handleReportClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/report/index?id=${id}` });
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.greeting}>你好，张小明</Text>
        <Text className={styles.subtitle}>以下是您的口腔影像检查报告</Text>
      </View>

      <View className={styles.filterBar}>
        {filterOptions.map(opt => (
          <View
            key={opt.value}
            className={classnames(styles.filterBtn, activeFilter === opt.value && styles.filterBtnActive)}
            onClick={() => setActiveFilter(opt.value)}
          >
            <Text className={styles.filterBtnText}>{opt.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.listContainer}>
        <Text className={styles.reportCount}>共{filteredReports.length}份报告</Text>
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <ReportCard key={report.id} report={report} onClick={handleReportClick} />
          ))
        ) : (
          <View className={styles.emptyHint}>
            <Text className={styles.emptyText}>暂无此类报告</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default IndexPage;
