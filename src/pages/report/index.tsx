import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { mockReports } from '@/data/reports';
import { DentalReport, Severity } from '@/types/report';
import SectionCard from '@/components/SectionCard';
import ToothDiagram from '@/components/ToothDiagram';
import ShareModal from '@/components/ShareModal';
import ImageThumbnail from '@/components/ImageThumbnail';
import { addToCalendar, isCalendarEventAdded } from '@/utils/calendar';
import styles from './index.module.scss';

const typeIconMap: Record<string, string> = {
  panoramic: '🦷',
  periapical: '🔬',
  cbct: '📐'
};

const severityLabelMap: Record<Severity, string> = {
  severe: '严重',
  moderate: '中等',
  mild: '轻微',
  normal: '关注'
};

const findingCardStyleMap: Record<Severity, string> = {
  severe: styles.findingCardSevere,
  moderate: styles.findingCardModerate,
  mild: styles.findingCardMild,
  normal: styles.findingCardNormal
};

const severityBadgeStyleMap: Record<Severity, string> = {
  severe: styles.severitySevere,
  moderate: styles.severityModerate,
  mild: styles.severityMild,
  normal: styles.severityNormal
};

const ReportPage: React.FC = () => {
  const [showShare, setShowShare] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);

  const report = useMemo<DentalReport | undefined>(() => {
    const instance = Taro.getCurrentInstance();
    const id = instance.router?.params?.id;
    if (!id) return undefined;
    return mockReports.find(r => r.id === id);
  }, []);

  const severityMap = useMemo(() => {
    const map: Record<string, Severity> = {};
    if (!report) return map;
    report.findings.forEach(f => {
      if (f.toothPosition) {
        f.toothPosition.split(',').forEach(tooth => {
          map[tooth.trim()] = f.severity;
        });
      }
    });
    return map;
  }, [report]);

  React.useEffect(() => {
    if (report) {
      setCalendarAdded(isCalendarEventAdded(report.id));
    }
  }, [report]);

  const handleAddCalendar = async () => {
    if (!report || !report.reminder) return;
    const ok = await addToCalendar(
      report.id,
      report.reminder.type,
      report.reminder.date,
      report.reminder.note,
      report.clinicName,
      report.doctorName
    );
    if (ok) setCalendarAdded(true);
  };

  if (!report) {
    return (
      <View className={styles.notFound}>
        <Text className={styles.notFoundText}>报告不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.typeBanner}>
        <Text className={styles.typeIcon}>{typeIconMap[report.reportType]}</Text>
        <View className={styles.typeInfo}>
          <Text className={styles.typeLabel}>{report.reportTypeLabel}检查报告</Text>
          <Text className={styles.typeDate}>{dayjs(report.reportDate).format('YYYY年MM月DD日')}</Text>
          <View className={styles.examInfoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>诊所</Text>
              <Text className={styles.infoValue}>{report.clinicName}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>医生</Text>
              <Text className={styles.infoValue}>{report.doctorName}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>范围</Text>
              <Text className={styles.infoValue}>{report.examInfo.area}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.imageSection}>
        <View className={styles.imageSectionTitle}>
          <Text className={styles.imageSectionIcon}>🖼️</Text>
          <Text>影像缩略图</Text>
        </View>
        <ImageThumbnail report={report} severityMap={severityMap} />
      </View>

      <SectionCard title="检查信息">
        <Text style={{ fontSize: '28rpx', color: '#7F8C8D', lineHeight: '1.8' }}>
          {report.examInfo.description}
        </Text>
      </SectionCard>

      <SectionCard title="医生结论">
        {report.findings.map(finding => (
          <View
            key={finding.id}
            className={classnames(styles.findingCard, findingCardStyleMap[finding.severity])}
          >
            <View className={styles.findingHeader}>
              <View className={styles.toothBadge}>
                <Text className={styles.toothBadgeText}>
                  {finding.toothPosition ? `${finding.toothPosition}号牙` : '综合'}
                </Text>
              </View>
              <View className={classnames(styles.severityBadge, severityBadgeStyleMap[finding.severity])}>
                <Text>{severityLabelMap[finding.severity]}</Text>
              </View>
            </View>
            <Text className={styles.medicalTerm}>{finding.medicalTerm}</Text>
            <View className={styles.plainExplain}>
              <Text className={styles.explainLabel}>💡 通俗解释</Text>
              <Text className={styles.explainText}>{finding.plainExplanation}</Text>
            </View>
          </View>
        ))}

        <View className={styles.toothDiagramWrap}>
          <ToothDiagram affectedTeeth={report.affectedTeeth} severityMap={severityMap} />
        </View>
      </SectionCard>

      <SectionCard title="就诊建议">
        {report.recommendations.map((rec, idx) => (
          <View key={idx} className={styles.recommendationItem}>
            <View className={styles.recommendationIndex}>
              <Text className={styles.recommendationIndexText}>{idx + 1}</Text>
            </View>
            <Text className={styles.recommendationText}>{rec}</Text>
          </View>
        ))}

        {report.reminder && (
          <View className={styles.reminderCard}>
            <View className={styles.reminderHeader}>
              <Text className={styles.reminderIcon}>📅</Text>
              <Text className={styles.reminderType}>{report.reminder.typeLabel}</Text>
            </View>
            <Text className={styles.reminderDate}>
              {dayjs(report.reminder.date).format('YYYY年MM月DD日')}
            </Text>
            <Text className={styles.reminderNote}>{report.reminder.note}</Text>

            <View
              className={classnames(styles.calendarBtn, calendarAdded && styles.calendarBtnDone)}
              onClick={handleAddCalendar}
            >
              <Text>{calendarAdded ? '✅' : '📆'}</Text>
              <Text className={styles.calendarBtnText}>
                {calendarAdded ? '已添加到日历' : '添加到手机日历'}
              </Text>
            </View>
          </View>
        )}
      </SectionCard>

      <View className={styles.bottomBar}>
        <View className={styles.shareBtn} onClick={() => setShowShare(true)}>
          <Text className={styles.shareBtnText}>分享给家属</Text>
        </View>
        <View className={styles.contactBtn} onClick={() => {
          Taro.makePhoneCall({ phoneNumber: '4001234567' }).catch(err => {
            console.error('[ReportPage] 拨打电话失败', err);
          });
        }}>
          <Text className={styles.contactBtnText}>联系诊所</Text>
        </View>
      </View>

      <ShareModal
        visible={showShare}
        reportId={report.id}
        clinicName={report.clinicName}
        reportTypeLabel={report.reportTypeLabel}
        doctorName={report.doctorName}
        onClose={() => setShowShare(false)}
      />
    </ScrollView>
  );
};

export default ReportPage;
