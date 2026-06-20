import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { getAllShareRecords } from '@/data/share-records';
import styles from './index.module.scss';

const SharePage: React.FC = () => {
  const records = useMemo(() => getAllShareRecords(), []);

  const handleCopyLink = (token: string) => {
    const link = `https://dental-report.example.com/share?token=${token}`;
    Taro.setClipboardData({
      data: `${link}\n\n这是我分享的口腔检查报告，包含医生结论和就诊建议。\n💡 链接 3 天内有效，请在浏览器中打开查看。`,
      success: () => {
        Taro.showToast({ title: '链接已复制', icon: 'success' });
      },
      fail: (err) => {
        console.error('[SharePage] 复制链接失败', err);
      }
    });
  };

  const handleViewFamily = (token: string) => {
    Taro.navigateTo({ url: `/pages/family-view/index?token=${token}` });
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
        <Text className={styles.sectionTitle}>分享记录（共{records.length}条）</Text>
        {records.map(record => {
          const exp = dayjs(record.expiryDate);
          const isActive = record.status === 'active';
          return (
            <View key={record.token} className={styles.shareItem}>
              <View className={styles.shareItemHeader}>
                <Text className={styles.shareItemClinic}>{record.clinicName}</Text>
                <View className={classnames(
                  styles.shareItemStatus,
                  isActive ? styles.statusActive : styles.statusExpired
                )}>
                  <Text>{isActive ? '有效中' : '已过期'}</Text>
                </View>
              </View>
              <Text className={styles.shareItemInfo}>
                {record.reportTypeLabel} · {record.doctorName}医生
              </Text>
              <Text className={styles.shareItemExpiry}>
                {isActive
                  ? `⏰ 链接有效期至 ${exp.format('MM月DD日 HH:mm')}（剩余约 ${exp.diff(dayjs(), 'day')} 天）`
                  : `⏰ 链接已于 ${exp.format('MM月DD日')} 过期`
                }
              </Text>
              <View className={styles.shareItemActions}>
                <View
                  className={styles.shareActionBtn}
                  onClick={() => handleViewReport(record.reportId)}
                >
                  <Text className={styles.shareActionBtnText}>查看原报告</Text>
                </View>
                <View
                  className={styles.shareActionBtn}
                  onClick={() => handleViewFamily(record.token)}
                >
                  <Text className={styles.shareActionBtnText}>预览家属页</Text>
                </View>
                {isActive && (
                  <View
                    className={classnames(styles.shareActionBtn, styles.shareActionBtnPrimary)}
                    onClick={() => handleCopyLink(record.token)}
                  >
                    <Text className={styles.shareActionBtnText}>复制链接</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {records.length === 0 && (
          <View style={{ padding: '80rpx 0', textAlign: 'center' }}>
            <Text style={{ fontSize: '28rpx', color: '#BDC3C7' }}>暂无分享记录</Text>
          </View>
        )}
      </View>

      <View className={styles.privacyCard}>
        <Text className={styles.privacyTitle}>🔒 隐私保护说明</Text>
        <View className={styles.privacyItem}>
          <Text className={styles.privacyIcon}>✅</Text>
          <Text className={styles.privacyText}>家属只能看到当前报告和医生建议</Text>
        </View>
        <View className={styles.privacyItem}>
          <Text className={styles.privacyIcon}>✅</Text>
          <Text className={styles.privacyText}>链接 3 天后自动失效，无需手动取消</Text>
        </View>
        <View className={styles.privacyItem}>
          <Text className={styles.privacyIcon}>✅</Text>
          <Text className={styles.privacyText}>不会暴露您的历史诊疗记录和其他信息</Text>
        </View>
        <View className={styles.privacyItem}>
          <Text className={styles.privacyIcon}>✅</Text>
          <Text className={styles.privacyText}>家属页无底部导航栏、无法看到您的其他报告</Text>
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
