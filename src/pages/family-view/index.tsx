import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { mockReports } from '@/data/reports';
import { getShareRecord, markShareAsRead } from '@/data/share-records';
import { Severity } from '@/types/report';
import ToothDiagram from '@/components/ToothDiagram';
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

const severityBadgeStyleMap: Record<Severity, string> = {
  severe: styles.severitySevere,
  moderate: styles.severityModerate,
  mild: styles.severityMild,
  normal: styles.severityNormal
};

const FamilyViewPage: React.FC = () => {
  const { report, status, shareRecord, token } = useMemo(() => {
    const instance = Taro.getCurrentInstance();
    const tok = instance.router?.params?.token;

    if (!tok) {
      return { report: null, status: 'invalid', shareRecord: null, token: '' };
    }

    const rec = getShareRecord(tok);

    if (!rec) {
      return { report: null, status: 'not_found', shareRecord: null, token: tok };
    }

    if (rec.status === 'expired') {
      return { report: null, status: 'expired', shareRecord: rec, token: tok };
    }

    const rep = mockReports.find(r => r.id === rec.reportId);
    return { report: rep || null, status: 'ok', shareRecord: rec, token: tok };
  }, []);

  const [hasRead, setHasRead] = useState<boolean>(!!shareRecord?.readAt);
  const [readAtText, setReadAtText] = useState<string>(
    shareRecord?.readAt ? dayjs(shareRecord.readAt).format('MM月DD日 HH:mm') : ''
  );

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

  const handleConfirmRead = () => {
    if (hasRead || !token) return;
    const ok = markShareAsRead(token, '家属');
    if (ok) {
      const nowStr = dayjs().format('MM月DD日 HH:mm');
      setHasRead(true);
      setReadAtText(nowStr);
      Taro.showToast({ title: '已确认查看', icon: 'success' });
    }
  };

  if (!report) {
    let icon = '⏰';
    let title = '链接已失效';
    let desc = '该分享链接已超过有效期\n请联系患者或诊所重新获取';

    if (status === 'invalid') {
      icon = '🔗';
      title = '链接无效';
      desc = '未找到分享标识\n请检查链接是否完整';
    } else if (status === 'not_found') {
      icon = '❓';
      title = '链接不存在';
      desc = '该分享链接不存在或已被撤销\n请联系患者重新生成分享链接';
    }

    return (
      <ScrollView scrollY className={styles.container}>
        <View className={styles.expiredPage}>
          <Text className={styles.expiredIcon}>{icon}</Text>
          <Text className={styles.expiredTitle}>{title}</Text>
          <Text className={styles.expiredDesc}>{desc}</Text>

          <View className={styles.tipBox}>
            <Text className={styles.tipTitle}>💡 温馨提示</Text>
            <Text className={styles.tipText}>
              为保护患者隐私，分享链接默认 3 天内有效。如果您是家属，请联系患者重新生成分享链接。如您有疑问，可直接联系康美口腔门诊部获取协助。
            </Text>
          </View>

          <View className={styles.tipBox}>
            <Text className={styles.tipTitle}>🏥 诊所信息</Text>
            <Text className={styles.tipText}>
              康美口腔门诊部{'\n'}
              服务电话：400-123-4567{'\n'}
              地址：健康路 168 号
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.familyHeader}>
        <Text className={styles.familyTitle}>您的家属分享了检查报告</Text>
        <Text className={styles.familySubtitle}>请参考医生建议，与患者共同沟通治疗方案</Text>
      </View>

      <View className={styles.contentWrap}>
        <View className={styles.infoBanner}>
          <Text className={styles.typeIcon}>{typeIconMap[report.reportType]}</Text>
          <View className={styles.typeInfo}>
            <Text className={styles.typeLabel}>{report.reportTypeLabel}检查报告</Text>
            <Text className={styles.typeMeta}>
              {report.clinicName} · {report.doctorName} · {dayjs(report.reportDate).format('YYYY年MM月DD日')}
            </Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <View className={styles.sectionIcon} />
            <Text>检查信息</Text>
          </View>
          <Text style={{ fontSize: '28rpx', color: '#7F8C8D', lineHeight: '1.8' }}>
            {report.examInfo.description}
          </Text>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <View className={styles.sectionIcon} />
            <Text>医生结论</Text>
          </View>
          {report.findings.map(finding => (
            <View key={finding.id} className={styles.findingCard}>
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
              <View className={styles.explainBox}>
                <Text className={styles.explainLabel}>💡 通俗解释</Text>
                <Text className={styles.explainText}>{finding.plainExplanation}</Text>
              </View>
            </View>
          ))}
          <View style={{ marginTop: '24rpx' }}>
            <ToothDiagram affectedTeeth={report.affectedTeeth} severityMap={severityMap} />
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <View className={styles.sectionIcon} />
            <Text>就诊建议</Text>
          </View>
          {report.recommendations.map((rec, idx) => (
            <View key={idx} className={styles.recommendationItem}>
              <View className={styles.recIndex}>
                <Text className={styles.recIndexText}>{idx + 1}</Text>
              </View>
              <Text className={styles.recText}>{rec}</Text>
            </View>
          ))}

          {report.reminder && (
            <View className={styles.reminderBox}>
              <View className={styles.reminderHeader}>
                <Text className={styles.reminderIcon}>📅</Text>
                <Text className={styles.reminderType}>{report.reminder.typeLabel}</Text>
              </View>
              <Text className={styles.reminderDate}>
                {dayjs(report.reminder.date).format('YYYY年MM月DD日')}
              </Text>
              <Text className={styles.reminderNote}>{report.reminder.note}</Text>
            </View>
          )}
        </View>

        <View className={classnames(styles.confirmBox, hasRead && styles.confirmBoxDone)}>
          {hasRead ? (
            <View className={styles.confirmDoneRow}>
              <Text className={styles.confirmIcon}>✅</Text>
              <Text className={styles.confirmDoneText}>
                已确认查看 · {readAtText}
              </Text>
            </View>
          ) : (
            <>
              <Text className={styles.confirmDesc}>
                如您已完整阅读报告，请点击下方按钮确认，患者端将收到您的已读记录
              </Text>
              <View className={styles.confirmBtn} onClick={handleConfirmRead}>
                <Text className={styles.confirmBtnText}>我已查看并了解报告内容</Text>
              </View>
            </>
          )}
        </View>

        <View className={styles.privacyFooter}>
          <Text className={styles.privacyText}>🔒 本页面仅展示本次分享报告，不包含患者其他诊疗记录</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default FamilyViewPage;
