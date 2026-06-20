import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const handleMenuClick = (path: string) => {
    Taro.navigateTo({ url: path });
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.profileCard}>
        <View className={styles.avatar}>
          <Text>😊</Text>
        </View>
        <View className={styles.profileInfo}>
          <Text className={styles.profileName}>张小明</Text>
          <Text className={styles.profileMeta}>35岁 · 男 · 康美口腔门诊部</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>10</Text>
          <Text className={styles.statLabel}>检查报告</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>3</Text>
          <Text className={styles.statLabel}>待复诊</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>2</Text>
          <Text className={styles.statLabel}>已分享</Text>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuItem} onClick={() => handleMenuClick('/pages/index/index')}>
          <View className={styles.menuLeft}>
            <Text className={styles.menuIcon}>📋</Text>
            <Text className={styles.menuLabel}>报告历史</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => handleMenuClick('/pages/share/index')}>
          <View className={styles.menuLeft}>
            <Text className={styles.menuIcon}>🔗</Text>
            <Text className={styles.menuLabel}>分享记录</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => {}}>
          <View className={styles.menuLeft}>
            <Text className={styles.menuIcon}>📖</Text>
            <Text className={styles.menuLabel}>术语科普</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>

      <View className={`${styles.menuSection} ${styles.menuSectionSpacing}`}>
        <View className={styles.menuItem} onClick={() => {}}>
          <View className={styles.menuLeft}>
            <Text className={styles.menuIcon}>⚙️</Text>
            <Text className={styles.menuLabel}>设置</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => {}}>
          <View className={styles.menuLeft}>
            <Text className={styles.menuIcon}>❓</Text>
            <Text className={styles.menuLabel}>帮助与反馈</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipTitle}>💡 小贴士</Text>
        <Text className={styles.tipContent}>
          定期口腔检查是维护口腔健康的重要方式。建议每6-12个月进行一次全景片检查，发现问题及时处理。
        </Text>
      </View>
    </ScrollView>
  );
};

export default MinePage;
