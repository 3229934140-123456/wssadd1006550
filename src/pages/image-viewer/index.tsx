import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockReports } from '@/data/reports';
import { Severity } from '@/types/report';
import styles from './index.module.scss';

const upperRow = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
const lowerRow = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

const severityLabelMap: Record<Severity, string> = {
  severe: '严重',
  moderate: '中等',
  mild: '轻微',
  normal: '关注'
};

const ImageViewerPage: React.FC = () => {
  const { report, severityMap } = useMemo(() => {
    const instance = Taro.getCurrentInstance();
    const id = instance.router?.params?.id;
    const rep = mockReports.find(r => r.id === id) || mockReports[0];
    const map: Record<string, Severity> = {};
    rep.findings.forEach(f => {
      if (f.toothPosition) {
        f.toothPosition.split(',').forEach(tooth => {
          map[tooth.trim()] = f.severity;
        });
      }
    });
    return { report: rep, severityMap: map };
  }, []);

  const getCellClass = (num: string) => {
    if (!report.affectedTeeth.includes(num)) return styles.gridCell;
    const s = severityMap[num];
    if (s === 'severe') return classnames(styles.gridCell, styles.gridCellHighlight);
    if (s === 'moderate') return classnames(styles.gridCell, styles.gridCellMod);
    if (s === 'mild') return classnames(styles.gridCell, styles.gridCellMild);
    return classnames(styles.gridCell, styles.gridCellMild);
  };

  const getFindingIndexClass = (sev: Severity) => {
    if (sev === 'severe') return classnames(styles.findingIndex, styles.findingIndexSevere);
    if (sev === 'moderate') return classnames(styles.findingIndex, styles.findingIndexModerate);
    if (sev === 'mild') return classnames(styles.findingIndex, styles.findingIndexMild);
    return styles.findingIndex;
  };

  const getItemClass = (sev: Severity) => {
    if (sev === 'severe') return classnames(styles.findingItem, styles.findingItemSevere);
    if (sev === 'moderate') return classnames(styles.findingItem, styles.findingItemModerate);
    if (sev === 'mild') return classnames(styles.findingItem, styles.findingItemMild);
    return styles.findingItem;
  };

  const getMarkerClass = (sev: Severity) => {
    if (sev === 'moderate') return classnames(styles.annotationMarkerMod);
    if (sev === 'mild') return classnames(styles.annotationMarkerMild);
    return '';
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.imageStage}>
        <View className={styles.imagePlaceholder}>
          {report.reportType === 'panoramic' ? (
            <View className={styles.toothGridFull}>
              <View className={styles.gridRow}>
                {upperRow.map(n => (
                  <View key={n} className={getCellClass(n)}>
                  <Text>{n}</Text>
                </View>)}
              </View>
              <View style={{ height: '12rpx' }} />
              <View className={styles.gridRow}>
                {lowerRow.map(n => (
                  <View key={n} className={getCellClass(n)}>
                  <Text>{n}</Text>
                </View>)}
              </View>
            </View>
          ) : (
            <View style={{ textAlign: 'center' }}>
            <Text className={styles.bigEmoji}>
              {report.reportType === 'cbct' ? '📐' : '🔬'}
            </Text>
            <View style={{
              marginTop: '16rpx',
              display: 'inline-flex',
              padding: '8rpx 24rpx',
              borderRadius: '999rpx',
              background: 'rgba(255,107,107,0.25)',
              border: '1rpx solid rgba(255,107,107,0.5)',
              color: '#FF6B6B',
              fontWeight: '700',
              fontSize: '32rpx'
            }}>
              <Text>关注点：{report.affectedTeeth.join(', ')}号牙</Text>
            </View>
            </View>
          )}

          {report.findings.slice(0, 3).map((f, idx) => (
            <View
              key={f.id}
              className={classnames(
                styles.annotationMarker,
                getMarkerClass(f.severity)
              )}
              style={{
                top: `${20 + idx * 20}%,
                left: `${25 + idx * 18}%`
              }}
            >
              <Text>{idx + 1}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.infoPanel}>
        <View className={styles.panelHeader}>
          <View>
            <Text className={styles.panelTitle}>{report.reportTypeLabel}标注说明</Text>
            <Text className={styles.panelSubtitle}>
              {report.clinicName} · {report.doctorName}
            </Text>
          </View>
        </View>

        <View className={styles.legendRow}>
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
        </View>

        <View className={styles.findingList}>
          {report.findings.map((f, idx) => (
            <View key={f.id} className={getItemClass(f.severity)}>
              <View className={getFindingIndexClass(f.severity)}>
                <Text>{idx + 1}</Text>
              </View>
              <View className={styles.findingContent}>
                <Text className={styles.findingTerm}>{f.medicalTerm}</Text>
                <Text className={styles.findingPos}>
                  {f.toothPosition && `${f.toothPosition}号牙`} · {severityLabelMap[f.severity]}
                </Text>
                <Text className={styles.findingExplanation}>
                  💡 {f.plainExplanation}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className={styles.tipBox}>
          <Text className={styles.tipTitle}>📝 阅读说明</Text>
          <Text className={styles.tipText}>
            影像图片中高亮标记的牙位表示需要特别关注。如对结果有疑问，请及时咨询您的主治医生。建议在下次就诊时携带本报告，方便医生了解您的口腔情况。
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ImageViewerPage;
