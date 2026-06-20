import React, { useMemo, useState, useCallback, useEffect } from 'react';
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

const severityBadge: Record<Severity, string> = {
  severe: styles.severityBadgeSevere,
  moderate: styles.severityBadgeModerate,
  mild: styles.severityBadgeMild,
  normal: styles.severityBadgeNormal
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
  const [scrollIntoId, setScrollIntoId] = useState<string>('');

  const handleFindingClick = useCallback((idx: number) => {
    const nextIdx = activeFindingIdx === idx ? null : idx;
    setActiveFindingIdx(nextIdx);
    if (nextIdx !== null) {
      const targetId = `iv-marker-${nextIdx}`;
      setScrollIntoId('');
      Taro.nextTick(() => {
        setScrollIntoId(targetId);
      });
    }
  }, [activeFindingIdx]);

  const handleMarkerClick = useCallback((idx: number) => {
    setActiveFindingIdx(activeFindingIdx === idx ? null : idx);
  }, [activeFindingIdx]);

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

  const getToothFocusClass = (tooth: string, idx: number) => {
    if (activeFindingIdx !== idx) return '';
    const finding = report?.findings[idx];
    if (!finding?.toothPosition) return '';
    const list = finding.toothPosition.split(',').map(s => s.trim());
    return list.includes(tooth) ? styles.gridCellFocus : '';
  };

  useEffect(() => {
    if (scrollIntoId) {
      const timer = setTimeout(() => setScrollIntoId(''), 600);
      return () => clearTimeout(timer);
    }
  }, [scrollIntoId]);

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

  const maxFindings = Math.min(3, report.findings.length);

  return (
    <ScrollView
      scrollY
      className={styles.container}
      scrollIntoView={scrollIntoId}
      scrollWithAnimation
    >
      <View id="iv-stage" className={styles.imageStage}>
        <View className={styles.imagePlaceholder}>
          {report.reportType === 'panoramic' ? (
            <View className={styles.toothGridFull}>
              <View className={styles.gridRow}>
                {upperRow.map(n => (
                  <View
                    key={n}
                    className={getCellClass(n)}
                    id={`iv-cell-${n}`}
                  >
                    <Text>{n}</Text>
                  </View>
                ))}
              </View>
              <View style={{ height: '12rpx' }} />
              <View className={styles.gridRow}>
                {lowerRow.map(n => (
                  <View
                    key={n}
                    className={getCellClass(n)}
                    id={`iv-cell-${n}`}
                  >
                    <Text>{n}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={{ textAlign: 'center' }}>
              <Text className={styles.bigEmoji}>
                {report.reportType === 'cbct' ? '📐' : '🔬'}
              </Text>
              <View className={styles.focusBadge}>
                <Text>关注点：{report.affectedTeeth.join(', ')}号牙</Text>
              </View>
            </View>
          )}

          {report.findings.slice(0, maxFindings).map((f, idx) => (
            <View
              key={f.id}
              id={`iv-marker-${idx}`}
              className={classnames(
                styles.annotationMarker,
                getMarkerClass(f.severity, idx)
              )}
              style={{
                top: `${20 + idx * 20}%`,
                left: `${25 + idx * 18}%`
              }}
              onClick={() => handleMarkerClick(idx)}
            >
              <Text>{idx + 1}</Text>
            </View>
          ))}

          {activeFindingIdx !== null && report.findings[activeFindingIdx]?.toothPosition && (
            <View className={styles.activeCallout}>
              <View className={classnames(styles.activeCalloutBadge,
                severityBadge[report.findings[activeFindingIdx].severity])}>
                <Text>{activeFindingIdx + 1}</Text>
              </View>
              <Text className={styles.activeCalloutText}>
                {report.findings[activeFindingIdx].toothPosition.split(',').map((t, i) => (
                  <Text key={t} className={classnames(styles.activeCalloutTooth,
                    getToothFocusClass(t.trim(), activeFindingIdx) ? styles.activeCalloutToothFocus : '')}>
                    {t.trim()}号牙{ i < report.findings[activeFindingIdx].toothPosition!.split(',').length - 1 ? '、' : '' }
                  </Text>
                ))}
                <Text> · {severityLabelMap[report.findings[activeFindingIdx].severity]}</Text>
              </Text>
            </View>
          )}
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
          <Text className={styles.tipSmallText}>💡 点击下方标注，可在影像上定位高亮</Text>
        </View>

        <View className={styles.findingList}>
          {report.findings.map((f, idx) => (
            <View
              key={f.id}
              id={`iv-finding-${idx}`}
              className={getItemClass(f.severity, idx)}
              onClick={() => handleFindingClick(idx)}
            >
              <View className={getFindingIndexClass(f.severity, idx)}>
                <Text>{idx + 1}</Text>
              </View>
              <View className={styles.findingContent}>
                <View className={styles.findingTitleRow}>
                  <Text className={styles.findingTerm}>{f.medicalTerm}</Text>
                  <View className={classnames(styles.findingSeverityMini,
                    severityBadge[f.severity])}>
                    <Text className={styles.findingSeverityMiniText}>
                      {severityLabelMap[f.severity]}
                    </Text>
                  </View>
                </View>
                <Text className={styles.findingPos}>
                  {f.toothPosition && `牙位：${f.toothPosition}号牙`}
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
