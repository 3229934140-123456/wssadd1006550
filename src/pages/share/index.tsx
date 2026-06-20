import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import {
  getAllShareRecords,
  buildShareLink,
  revokeShareRecord,
  regenerateShareRecord
} from '@/data/share-records';
import styles from './index.module.scss';

const SharePage: React.FC = () => {
  const [records, setRecords] = useState(useMemo(() => getAllShareRecords(), []));

  const refresh = useCallback(() => {
    setRecords(getAllShareRecords());
  }, []);

  useEffect(() => {
    const timer = setInterval(refresh, 1500);
    return () => clearInterval(timer);
  }, [refresh]);

  const handleCopyLink = (token: string, reportTypeLabel: string) => {
    const link = buildShareLink(token);
    Taro.setClipboardData({
      data: `${link}\n\n这是我分享的口腔检查报告（${reportTypeLabel}），包含医生结论和就诊建议。\n💡 链接 3 天内有效，请在浏览器中打开查看。`,
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

  const handleRevoke = (token: string) => {
    Taro.showModal({
      title: '确认撤销链接？',
      content: '撤销后，家属再打开该链接将无法查看报告。可重新生成新链接。',
      confirmText: '确认撤销',
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          const ok = revokeShareRecord(token);
          if (ok) {
            Taro.showToast({ title: '链接已撤销', icon: 'success' });
            refresh();
          }
        }
      }
    });
  };

  const handleRegenerate = (token: string, reportTypeLabel: string) => {
    Taro.showModal({
      title: '重新生成链接？',
      content: '将生成一条新的链接，旧链接不受此操作影响。',
      confirmText: '生成新链接',
      success: (res) => {
        if (res.confirm) {
          const rec = regenerateShareRecord(token);
          if (rec) {
            refresh();
            Taro.showModal({
              title: '新链接已生成',
              content: '是否立即复制新链接？',
              confirmText: '复制链接',
              success: (r2) => {
                if (r2.confirm) {
                  handleCopyLink(rec.token, rec.reportTypeLabel);
                }
              }
            });
          }
        }
      }
    });
  };

  const getStatusMeta = (status: string) => {
    switch (status) {
      case 'active':
        return { label: '有效中', style: styles.statusActive };
      case 'expired':
        return { label: '已过期', style: styles.statusExpired };
      case 'revoked':
        return { label: '已撤销', style: styles.statusRevoked };
      default:
        return { label: status, style: styles.statusActive };
    }
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
          const isRead = !!record.readAt;
          const statusMeta = getStatusMeta(record.status);
          return (
            <View key={record.token} className={styles.shareItem}>
              <View className={styles.shareItemHeader}>
                <Text className={styles.shareItemClinic}>{record.clinicName}</Text>
                <View className={classnames(
                  styles.shareItemStatus,
                  statusMeta.style
                )}>
                  <Text>{statusMeta.label}</Text>
                </View>
              </View>
              <Text className={styles.shareItemInfo}>
                {record.reportTypeLabel} · {record.doctorName}医生
              </Text>
              <Text className={styles.shareItemExpiry}>
                {isActive
                  ? `⏰ 链接有效期至 ${exp.format('MM月DD日 HH:mm')}（剩余约 ${Math.max(0, exp.diff(dayjs(), 'day'))} 天）`
                  : record.status === 'revoked'
                    ? `🚫 已于 ${dayjs(record.revokedAt).format('MM月DD日 HH:mm')} 被撤销`
                    : `⏰ 链接已于 ${exp.format('MM月DD日')} 过期`
                }
              </Text>

              {isRead ? (
                <View className={styles.readInfo}>
                  <Text className={styles.readIcon}>👀</Text>
                  <Text className={styles.readText}>
                    {record.readBy} 已于 {dayjs(record.readAt).format('MM月DD日 HH:mm')} 查看
                  </Text>
                </View>
              ) : isActive ? (
                <View className={styles.readInfoPending}>
                  <Text className={styles.readIconPending}>⏳</Text>
                  <Text className={styles.readTextPending}>待家属查看确认</Text>
                </View>
              ) : (
                <View className={styles.readInfoDisabled}>
                  <Text className={styles.readIconPending}>—</Text>
                  <Text className={styles.readTextPending}>
                    {record.status === 'revoked' ? '链接撤销前未查看' : '链接过期前未查看'}
                  </Text>
                </View>
              )}

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
                    onClick={() => handleCopyLink(record.token, record.reportTypeLabel)}
                  >
                    <Text className={styles.shareActionBtnText}>复制链接</Text>
                  </View>
                )}
              </View>

              <View className={styles.shareItemActionsSecondary}>
                {isActive && (
                  <>
                    <View
                      className={classnames(styles.shareActionBtn, styles.shareActionBtnDanger)}
                      onClick={() => handleRevoke(record.token)}
                    >
                      <Text className={styles.shareActionBtnTextDanger}>撤销此链接</Text>
                    </View>
                    <View
                      className={classnames(styles.shareActionBtn, styles.shareActionBtnAlt)}
                      onClick={() => handleRegenerate(record.token, record.reportTypeLabel)}
                    >
                      <Text className={styles.shareActionBtnTextAlt}>重新生成</Text>
                    </View>
                  </>
                )}
                {!isActive && (
                  <View
                    className={classnames(styles.shareActionBtn, styles.shareActionBtnAlt, styles.shareActionBtnFull)}
                    onClick={() => handleRegenerate(record.token, record.reportTypeLabel)}
                  >
                    <Text className={styles.shareActionBtnTextAlt}>🔄 重新生成链接</Text>
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
          <Text className={styles.privacyText}>可随时手动撤销，撤销后家属无法继续查看</Text>
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
          <Text className={styles.privacyText}>家属可点击确认已读，您能实时查看状态</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SharePage;
