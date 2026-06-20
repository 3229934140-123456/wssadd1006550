import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { DentalReport, Severity } from '@/types/report';
import styles from './index.module.scss';

interface ImageThumbnailProps {
  report: DentalReport;
  severityMap: Record<string, Severity>;
}

const panoramicLayout = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28', '48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

const getCellClass = (toothNum: string, report: DentalReport, severityMap: Record<string, Severity>) => {
  if (!report.affectedTeeth.includes(toothNum)) return styles.gridCell;
  const sev = severityMap[toothNum];
  if (sev === 'severe') return classnames(styles.gridCell, styles.gridCellAffected);
  if (sev === 'moderate') return classnames(styles.gridCell, styles.gridCellModerate);
  if (sev === 'mild') return classnames(styles.gridCell, styles.gridCellMild);
  return classnames(styles.gridCell, styles.gridCellMild);
};

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ report, severityMap }) => {
  const handleView = () => {
    Taro.navigateTo({
      url: `/pages/image-viewer/index?id=${report.id}`
    });
  };

  const mainFinding = report.findings[0];
  const labelMap: Record<string, string> = {
    panoramic: '全口影像',
    periapical: '根尖片',
    cbct: 'CBCT断层'
  };

  return (
    <View className={styles.container} onClick={handleView}>
      <View className={styles.previewWrap}>
        <Text className={styles.previewBg}>
          {report.reportType === 'panoramic' ? '🦷' : report.reportType === 'cbct' ? '📐' : '🔬'}
        </Text>

        {report.reportType === 'panoramic' && (
          <View className={styles.previewGrid}>
            {panoramicLayout.map(num => (
              <View key={num} className={getCellClass(num, report, severityMap)}>
                <Text>{num}</Text>
              </View>
            ))}
          </View>
        )}

        {report.reportType !== 'panoramic' && report.affectedTeeth.length > 0 && (
          <View style={{
            position: 'absolute',
            width: '80%',
            height: '60%',
            top: '20%',
            left: '10%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,107,107,0.08)',
            borderRadius: '12rpx',
            border: '2rpx dashed rgba(255,107,107,0.4)'
          }}>
            <Text style={{
              fontSize: '36rpx',
              fontWeight: '700',
              color: '#FF6B6B'
            }}>
              {report.affectedTeeth.join(', ')}号牙
            </Text>
          </View>
        )}

        <View className={styles.previewLabel}>
          <Text className={styles.previewLabelText}>{labelMap[report.reportType]}</Text>
        </View>

        <View className={styles.previewBadge}>
          <Text className={styles.previewBadgeText}>点击查看大图</Text>
        </View>

        {mainFinding && (
          <View className={styles.annotationArea}>
            <View className={styles.annotationDot} />
            <Text className={styles.annotationText}>
              {mainFinding.toothPosition && `${mainFinding.toothPosition}号牙：`}
              {mainFinding.medicalTerm}
            </Text>
          </View>
        )}
      </View>

      <View className={styles.infoBar}>
        <View className={styles.infoLeft}>
          <Text className={styles.infoTitle}>{report.examInfo.area} · {report.reportTypeLabel}</Text>
          <Text className={styles.infoDesc}>共 {report.findings.length} 项发现，点击查看标注详情</Text>
        </View>
        <View className={styles.viewBtn}>
          <Text className={styles.viewBtnText}>查看大图</Text>
        </View>
      </View>
    </View>
  );
};

export default ImageThumbnail;
