import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { Severity } from '@/types/report';
import styles from './index.module.scss';

interface ToothDiagramProps {
  affectedTeeth: string[];
  severityMap?: Record<string, Severity>;
}

const upperRight = ['18', '17', '16', '15', '14', '13', '12', '11'];
const upperLeft = ['21', '22', '23', '24', '25', '26', '27', '28'];
const lowerRight = ['48', '47', '46', '45', '44', '43', '42', '41'];
const lowerLeft = ['31', '32', '33', '34', '35', '36', '37', '38'];

const severityStyleMap: Record<Severity, string> = {
  severe: styles.toothSevere,
  moderate: styles.toothModerate,
  mild: styles.toothMild,
  normal: styles.toothAffected
};

const ToothDiagram: React.FC<ToothDiagramProps> = ({ affectedTeeth, severityMap = {} }) => {
  const getToothStyle = (toothNum: string) => {
    const isAffected = affectedTeeth.includes(toothNum);
    const severity = severityMap[toothNum] || 'normal';
    if (isAffected) {
      return classnames(styles.tooth, severityStyleMap[severity]);
    }
    return styles.tooth;
  };

  const renderTooth = (num: string) => (
    <View key={num} className={getToothStyle(num)}>
      <Text className={styles.toothNumber}>{num}</Text>
    </View>
  );

  return (
    <View className={styles.container}>
      <Text className={styles.title}>牙位示意图（受影响牙位高亮显示）</Text>
      <View className={styles.chart}>
        <View className={styles.row}>
          <View className={styles.halfRow}>
            {upperRight.map(renderTooth)}
          </View>
          <View className={styles.divider} />
          <View className={styles.halfRow}>
            {upperLeft.map(renderTooth)}
          </View>
        </View>
        <View className={styles.dividerHorizontal} />
        <View className={styles.row}>
          <View className={styles.halfRow}>
            {lowerRight.map(renderTooth)}
          </View>
          <View className={styles.divider} />
          <View className={styles.halfRow}>
            {lowerLeft.map(renderTooth)}
          </View>
        </View>
      </View>
      <View className={styles.legend}>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.legendSevere)} />
          <Text className={styles.legendText}>严重</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.legendModerate)} />
          <Text className={styles.legendText}>中等</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.legendMild)} />
          <Text className={styles.legendText}>轻微</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.legendNormal)} />
          <Text className={styles.legendText}>关注</Text>
        </View>
      </View>
    </View>
  );
};

export default ToothDiagram;
