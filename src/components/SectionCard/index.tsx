import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => {
  return (
    <View className={styles.sectionCard}>
      <View className={styles.sectionTitle}>
        <View className={styles.sectionIcon} />
        <Text>{title}</Text>
      </View>
      <View className={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

export default SectionCard;
