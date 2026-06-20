import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface ShareModalProps {
  visible: boolean;
  reportId: string;
  clinicName: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ visible, reportId, clinicName, onClose }) => {
  const [shareLink, setShareLink] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleGenerate = () => {
    const token = Math.random().toString(36).substring(2, 10);
    const link = `https://dental.example.com/s/${token}`;
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 3);
    const expStr = `${expDate.getMonth() + 1}月${expDate.getDate()}日`;
    setShareLink(link);
    setExpiry(expStr);
    console.info('[ShareModal] 生成分享链接', { reportId, link });
  };

  const handleCopy = () => {
    Taro.setClipboardData({
      data: shareLink,
      success: () => {
        Taro.showToast({ title: '链接已复制', icon: 'success' });
      },
      fail: (err) => {
        console.error('[ShareModal] 复制失败', err);
      }
    });
  };

  if (!visible) return null;

  return (
    <View className={styles.overlay} onClick={onClose}>
      <View className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <View className={styles.panelHeader}>
          <Text className={styles.panelTitle}>分享给家属</Text>
          <View className={styles.closeBtn} onClick={onClose}>
            <Text>✕</Text>
          </View>
        </View>

        <View className={styles.shareInfo}>
          <Text className={styles.shareInfoTitle}>分享说明</Text>
          <Text className={styles.shareInfoDesc}>
            家属通过链接可查看本次检查报告和医生建议，不会看到您的其他诊疗记录。链接3天后自动失效。
          </Text>
        </View>

        {shareLink ? (
          <>
            <View className={styles.linkBox}>
              <Text className={styles.linkText}>{shareLink}</Text>
              <View className={styles.copyBtn} onClick={handleCopy}>
                <Text className={styles.copyBtnText}>复制</Text>
              </View>
            </View>
            <View className={styles.expiryInfo}>
              <Text className={styles.expiryIcon}>⏰</Text>
              <Text className={styles.expiryText}>链接将于{expiry}失效</Text>
            </View>
          </>
        ) : (
          <View className={styles.actionBtn} onClick={handleGenerate}>
            <Text className={styles.actionBtnText}>生成分享链接</Text>
          </View>
        )}

        <View className={styles.privacyNote}>
          <Text className={styles.privacyText}>
            🔒 链接仅展示报告和医生建议，不暴露其他诊疗记录
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ShareModal;
