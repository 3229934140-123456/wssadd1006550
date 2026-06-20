import React, { useMemo, useState } from 'react';
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
    const rep = id ? mockReports.find(r => r.id === id) : undefined;
    if (!rep) return { report: undefined, severityMap: {} };
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

  const [activeFindingIdx, setActiveFindingIdx] = useState<number | null>(null);

  const getCellClass = (num: string) => {
    if (!report || !report.affectedTeeth.includes(num)) return styles.gridCell;
    const activeFinding = activeFindingIdx !== null ? report.findings[activeFindingIdx] : null;
    const isHighlighted = !!(activeFinding?.toothPosition?.split(',').map(s => s.trim()).includes(num));
    const s = severityMap[num];
    let base = styles.gridCell;
    if (s === 'severe') base = classnames(styles.gridCell, styles.gridCellHighlight);
    else if (s === 'moderate') base = classnames(styles.gridCell, styles.gridCellMod);
    else if (s === 'mild') base = classnames(styles.gridCell, styles.gridCellMild);
    else base = classnames(styles.gridCell, styles.gridCellMild);
    return classnames(base, isHighlighted && styles.gridCellFocus);
  };

  const getFindingIndexClass = (sev: Severity, idx: number) => {
    const base =
      sev === 'severe' ? classnames(styles.findingIndex, styles.findingIndexSevere) :
      sev === 'moderate' ? classnames(styles.findingIndex, styles.findingIndexModerate) :
      sev === 'mild' ? classnames(styles.findingIndex, styles.findingIndexMild) :
      styles.findingIndex;
    return classnames(base, activeFindingIdx === idx && styles.findingIndexActive);
  };

  const getItemClass = (sev: Severity, idx: number) => {
    const base =
      sev === 'severe' ? classnames(styles.findingItem, styles.findingItemSevere) :
      sev === 'moderate' ? classnames(styles.findingItem, styles.findingItemModerate) :
      sev === 'mild' ? classnames(styles.findingItem, styles.findingItemMild) :
      styles.findingItem;
    return classnames(base, activeFindingIdx === idx && styles.findingItemActive);
  };

  const getMarkerClass = (sev: Severity, idx: number) => {
    const base =
      sev === 'moderate' ? styles.annotationMarkerMod :
      sev === 'mild' ? styles.annotationMarkerMild :
      '';
    return classnames(base, activeFindingIdx === idx && styles.annotationMarkerActive);
  };

  const handleFindingClick = (idx: number) => {
    setActiveFindingIdx(activeFindingIdx === idx ? null : idx);
  };

  if (!report) {
    return (
      <View className={styles.container}>
        <View style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '24rpx'
        }}>
          <Text style={{ fontSize: '64rpx' }}>🖼️</Text>
          <Text style={{ fontSize: '32rpx', color: '#BDC3C7' }}>暂无影像信息</Text>
        </View>
      </View>
    );
  }

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
                getMarkerClass(f.severity, idx)
              )}
              style={{
                top: `${20 + idx * 20}%`,
                left: `${25 + idx * 18}%`
              }}
              onClick={() => handleFindingClick(idx)}
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

        <View className={styles.tipSmall}>
          <Text className={styles.tipSmallText}>💡 点击下方标注，可在影像上定位</Text>
        </View>

        <View className={styles.findingList}>
          {report.findings.map((f, idx) => (
            <View
              key={f.id}
              className={getItemClass(f.severity, idx)}
              onClick={() => handleFindingClick(idx)}
            >
              <View className={getFindingIndexClass(f.severity, idx)}>
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
