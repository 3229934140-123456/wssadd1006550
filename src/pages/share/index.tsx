import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

interface ShareRecord {
  id: string;
  reportId: string;
  clinicName: string;
  reportTypeLabel: string;
  doctorName: string;
  createdAt: string;
  expiryDate: string;
  status: 'active' | 'expired';
  link: string;
}

const shareRecords: ShareRecord[] = [
  {
    id: 'SH001',
    reportId: 'RPT001',
    clinicName: '康美口腔门诊部',
    reportTypeLabel: '全景片',
    doctorName: '李明华',
    createdAt: '2026-06-18',
    expiryDate: '2026-06-21',
    status: 'active',
    link: 'https://dental.example.com/s/abc12345'
  },
  {
    id: 'SH002',
    reportId: 'RPT003',
    clinicName: '康美口腔门诊部',
    reportTypeLabel: 'CBCT',
    doctorName: '陈建国',
    createdAt: '2026-06-11',
    expiryDate: '2026-06-14',
    status: 'expired',
    link: 'https://dental.example.com/s/def67890'
  }
];

const SharePage: React.FC = () => {
  const handleCopyLink = (link: string) => {
    Taro.setClipboardData({
      data: link,
      success: () => {
        Taro.showToast({ title: '链接已复制', icon: 'success' });
      },
      fail: (err) => {
        console.error('[SharePage] 复制链接失败', err);
      }
    });
  };

  const handleViewReport = (reportId: string) => {
    Taro.navigateTo({ url: `/pages/report/index?id=${reportId}` });
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.headerCard}>
        <Text className={styles.headerIcon}>👨‍👩‍👧‍👦</Text>
        <Text className={styles.headerTitle}>家属分享</Text>
        <Text className={styles.headerDesc}>
          生成限时查看链接，让家人一起了解检查结果，共同参与诊疗决策
        </Text>
      </View>

      <View className={styles.shareList}>
        <Text className={styles.sectionTitle}>分享记录</Text>
        {shareRecords.map(record => (
          <View key={record.id} className={styles.shareItem}>
            <View className={styles.shareItemHeader}>
              <Text className={styles.shareItemClinic}>{record.clinicName}</Text>
              <View className={classnames(
                styles.shareItemStatus,
                record.status === 'active' ? styles.statusActive : styles.statusExpired
              )}>
                <Text>{record.status === 'active' ? '有效' : '已过期'}</Text>
              </View>
            </View>
            <Text className={styles.shareItemInfo}>
              {record.reportTypeLabel} · {record.doctorName}医生
            </Text>
            <Text className={styles.shareItemExpiry}>
              {record.status === 'active'
                ? `链接有效期至${record.expiryDate}`
                : `链接已于${record.expiryDate}过期`
              }
            </Text>
            <View className={styles.shareItemActions}>
              <View
                className={styles.shareActionBtn}
                onClick={() => handleViewReport(record.reportId)}
              >
                <Text className={styles.shareActionBtnText}>查看报告</Text>
              </View>
              {record.status === 'active' && (
                <View
                  className={classnames(styles.shareActionBtn, styles.shareActionBtnPrimary)}
                  onClick={() => handleCopyLink(record.link)}
                >
                  <Text className={styles.shareActionBtnText}>复制链接</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      <View className={styles.privacyCard}>
        <Text className={styles.privacyTitle}>🔒 隐私保护说明</Text>
        <View className={styles.privacyItem}>
          <Text className={styles.privacyIcon}>✅</Text>
          <Text className={styles.privacyText}>家属只能看到当前报告和医生建议</Text>
        </View>
        <View className={styles.privacyItem}>
          <Text className={styles.privacyIcon}>✅</Text>
          <Text className={styles.privacyText}>链接3天后自动失效，无需手动取消</Text>
        </View>
        <View className={styles.privacyItem}>
          <Text className={styles.privacyIcon}>✅</Text>
          <Text className={styles.privacyText}>不会暴露您的历史诊疗记录和其他信息</Text>
        </View>
        <View className={styles.privacyItem}>
          <Text className={styles.privacyIcon}>✅</Text>
          <Text className={styles.privacyText}>适合拔牙、正畸、种植前与家人共同决策</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SharePage;
