import { DentalReport } from '@/types/report';

export const mockReports: DentalReport[] = [
  {
    id: 'RPT001',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '李明华',
    reportDate: '2026-06-18',
    reportType: 'panoramic',
    reportTypeLabel: '全景片',
    examInfo: {
      type: 'panoramic',
      typeLabel: '全景片',
      area: '全口',
      description: '全口曲面体层摄影，评估全口牙齿及颌骨情况'
    },
    findings: [
      {
        id: 'F001',
        toothPosition: '36',
        medicalTerm: '根尖周低密度影',
        plainExplanation: '牙根尖周围出现了阴影区域，提示可能有炎症或感染，需要进一步检查确认',
        severity: 'moderate'
      },
      {
        id: 'F002',
        toothPosition: '16,26',
        medicalTerm: '牙槽骨水平吸收',
        plainExplanation: '牙床骨整体高度降低，就像水土流失一样，牙齿的支撑力量变弱了',
        severity: 'mild'
      },
      {
        id: 'F003',
        toothPosition: '18,28,38,48',
        medicalTerm: '阻生智齿',
        plainExplanation: '智齿没有正常长出来，可能顶到前面的牙齿，建议尽早拔除',
        severity: 'moderate'
      }
    ],
    recommendations: [
      '36号牙建议尽快进行根管治疗，避免炎症进一步扩散',
      '16、26号牙需定期牙周维护，建议每3-6个月洗牙一次',
      '四颗智齿建议择期拔除，优先处理38、48号'
    ],
    reminder: {
      type: 'one_week',
      typeLabel: '一周内复诊',
      date: '2026-06-25',
      note: '36号牙根管治疗'
    },
    affectedTeeth: ['16', '26', '36', '18', '28', '38', '48'],
    status: 'published'
  },
  {
    id: 'RPT002',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '王秀英',
    reportDate: '2026-06-15',
    reportType: 'periapical',
    reportTypeLabel: '根尖片',
    examInfo: {
      type: 'periapical',
      typeLabel: '根尖片',
      area: '36号牙区',
      description: '36号牙根尖片，评估根尖及根管治疗情况'
    },
    findings: [
      {
        id: 'F004',
        toothPosition: '36',
        medicalTerm: '根尖周炎',
        plainExplanation: '牙根尖周围组织发炎，通常是因为蛀牙细菌深入到了牙根，需要根管治疗',
        severity: 'moderate'
      },
      {
        id: 'F005',
        toothPosition: '36',
        medicalTerm: '龋齿',
        plainExplanation: '俗称蛀牙，是牙齿被细菌侵蚀后形成的洞，早发现可以简单补牙',
        severity: 'mild'
      }
    ],
    recommendations: [
      '36号牙需进行根管治疗',
      '治疗后建议做全冠修复保护患牙'
    ],
    reminder: {
      type: 'one_week',
      typeLabel: '一周内复诊',
      date: '2026-06-22',
      note: '36号牙根管治疗首诊'
    },
    affectedTeeth: ['36'],
    status: 'viewed'
  },
  {
    id: 'RPT003',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '陈建国',
    reportDate: '2026-06-10',
    reportType: 'cbct',
    reportTypeLabel: 'CBCT',
    examInfo: {
      type: 'cbct',
      typeLabel: 'CBCT',
      area: '下颌骨',
      description: '下颌骨锥形束CT扫描，评估阻生智齿与下牙槽神经关系'
    },
    findings: [
      {
        id: 'F006',
        toothPosition: '48',
        medicalTerm: '埋伏阻生',
        plainExplanation: '牙齿长在骨头里面出不来，可能压迫旁边的牙齿，通常需要手术处理',
        severity: 'severe'
      },
      {
        id: 'F007',
        toothPosition: '48',
        medicalTerm: '阻生智齿',
        plainExplanation: '智齿没有正常长出来，可能顶到前面的牙齿，建议尽早拔除',
        severity: 'severe'
      }
    ],
    recommendations: [
      '48号阻生智齿距离下牙槽神经较近，建议到口腔外科拔除',
      '拔牙前需签署手术知情同意书',
      '术后注意冰敷和软食'
    ],
    reminder: {
      type: 'one_week',
      typeLabel: '一周内复诊',
      date: '2026-06-17',
      note: '48号智齿拔除术'
    },
    affectedTeeth: ['48'],
    status: 'viewed'
  },
  {
    id: 'RPT004',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '李明华',
    reportDate: '2026-05-20',
    reportType: 'panoramic',
    reportTypeLabel: '全景片',
    examInfo: {
      type: 'panoramic',
      typeLabel: '全景片',
      area: '全口',
      description: '常规口腔全景检查'
    },
    findings: [
      {
        id: 'F008',
        toothPosition: '14,15,24,25',
        medicalTerm: '龋齿',
        plainExplanation: '俗称蛀牙，是牙齿被细菌侵蚀后形成的洞，早发现可以简单补牙',
        severity: 'mild'
      },
      {
        id: 'F009',
        toothPosition: '16,26',
        medicalTerm: '牙周袋加深',
        plainExplanation: '牙龈和牙齿之间的缝隙变深了，容易藏细菌，需要专业清洁',
        severity: 'mild'
      }
    ],
    recommendations: [
      '14、15、24、25号牙龋齿建议尽快补牙',
      '16、26号牙建议牙周刮治'
    ],
    reminder: {
      type: 'three_months',
      typeLabel: '三个月复查',
      date: '2026-08-20',
      note: '牙周复查'
    },
    affectedTeeth: ['14', '15', '16', '24', '25', '26'],
    status: 'viewed'
  },
  {
    id: 'RPT005',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '王秀英',
    reportDate: '2026-05-10',
    reportType: 'cbct',
    reportTypeLabel: 'CBCT',
    examInfo: {
      type: 'cbct',
      typeLabel: 'CBCT',
      area: '46号牙区',
      description: '种植术前CBCT评估骨量'
    },
    findings: [
      {
        id: 'F010',
        toothPosition: '46',
        medicalTerm: '缺牙区',
        plainExplanation: '这里牙齿已经缺失，需要考虑种植牙或镶牙来恢复咀嚼功能',
        severity: 'moderate'
      }
    ],
    recommendations: [
      '46号牙缺失区骨量充足，适合种植修复',
      '建议择期行种植手术',
      '术前需完善血常规检查'
    ],
    reminder: {
      type: 'pre_implant',
      typeLabel: '种植术前沟通',
      date: '2026-06-10',
      note: '46号牙种植方案沟通'
    },
    affectedTeeth: ['46'],
    status: 'viewed'
  },
  {
    id: 'RPT006',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '陈建国',
    reportDate: '2026-04-28',
    reportType: 'periapical',
    reportTypeLabel: '根尖片',
    examInfo: {
      type: 'periapical',
      typeLabel: '根尖片',
      area: '22号牙区',
      description: '22号牙根管治疗术后复查'
    },
    findings: [
      {
        id: 'F011',
        toothPosition: '22',
        medicalTerm: '根管治疗术后',
        plainExplanation: '已经完成了牙神经的治疗，这颗牙比较脆弱，需要后续做牙冠保护它',
        severity: 'normal'
      }
    ],
    recommendations: [
      '22号牙根管治疗愈合良好',
      '建议尽快完成全冠修复'
    ],
    affectedTeeth: ['22'],
    status: 'viewed'
  },
  {
    id: 'RPT007',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '李明华',
    reportDate: '2026-04-15',
    reportType: 'panoramic',
    reportTypeLabel: '全景片',
    examInfo: {
      type: 'panoramic',
      typeLabel: '全景片',
      area: '全口',
      description: '正畸前全口评估'
    },
    findings: [
      {
        id: 'F012',
        toothPosition: '13,23',
        medicalTerm: '埋伏阻生',
        plainExplanation: '牙齿长在骨头里面出不来，可能压迫旁边的牙齿，通常需要手术处理',
        severity: 'moderate'
      },
      {
        id: 'F013',
        toothPosition: '12,22',
        medicalTerm: '牙列缺损',
        plainExplanation: '多颗牙齿缺失，影响咀嚼和美观，建议修复治疗',
        severity: 'mild'
      }
    ],
    recommendations: [
      '13、23号埋伏尖牙建议正畸牵引',
      '正畸治疗前需拔除18、28、38、48号智齿'
    ],
    reminder: {
      type: 'three_months',
      typeLabel: '三个月复查',
      date: '2026-07-15',
      note: '正畸评估复查'
    },
    affectedTeeth: ['13', '23', '12', '22'],
    status: 'viewed'
  },
  {
    id: 'RPT008',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '王秀英',
    reportDate: '2026-03-20',
    reportType: 'cbct',
    reportTypeLabel: 'CBCT',
    examInfo: {
      type: 'cbct',
      typeLabel: 'CBCT',
      area: '上颌窦区',
      description: '上颌窦提升术前评估'
    },
    findings: [
      {
        id: 'F014',
        toothPosition: '16,17',
        medicalTerm: '缺牙区',
        plainExplanation: '这里牙齿已经缺失，需要考虑种植牙或镶牙来恢复咀嚼功能',
        severity: 'moderate'
      },
      {
        id: 'F015',
        toothPosition: '16',
        medicalTerm: '颌骨囊肿',
        plainExplanation: '颌骨内出现了含液体的囊腔，大多为良性，但需手术摘除',
        severity: 'severe'
      }
    ],
    recommendations: [
      '16号牙区囊肿需手术摘除',
      '囊肿摘除后3-6个月评估种植条件',
      '17号牙区可同期或分期种植'
    ],
    reminder: {
      type: 'pre_implant',
      typeLabel: '种植术前沟通',
      date: '2026-06-20',
      note: '上颌窦提升+种植方案'
    },
    affectedTeeth: ['16', '17'],
    status: 'viewed'
  },
  {
    id: 'RPT009',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '陈建国',
    reportDate: '2026-03-05',
    reportType: 'periapical',
    reportTypeLabel: '根尖片',
    examInfo: {
      type: 'periapical',
      typeLabel: '根尖片',
      area: '11,21号牙区',
      description: '前牙区根尖片检查'
    },
    findings: [
      {
        id: 'F016',
        toothPosition: '11',
        medicalTerm: '牙髓炎',
        plainExplanation: '牙神经发炎了，会引起剧烈疼痛，需要做根管治疗来缓解',
        severity: 'severe'
      }
    ],
    recommendations: [
      '11号牙需紧急根管治疗缓解疼痛',
      '根管治疗后建议全瓷冠修复'
    ],
    reminder: {
      type: 'one_week',
      typeLabel: '一周内复诊',
      date: '2026-03-12',
      note: '11号牙根管治疗'
    },
    affectedTeeth: ['11'],
    status: 'viewed'
  },
  {
    id: 'RPT010',
    patientName: '张小明',
    patientAge: 35,
    patientGender: 'male',
    clinicName: '康美口腔门诊部',
    doctorName: '李明华',
    reportDate: '2026-02-14',
    reportType: 'panoramic',
    reportTypeLabel: '全景片',
    examInfo: {
      type: 'panoramic',
      typeLabel: '全景片',
      area: '全口',
      description: '年度口腔健康体检'
    },
    findings: [
      {
        id: 'F017',
        toothPosition: '46',
        medicalTerm: '咬合创伤',
        plainExplanation: '咬合力量过大或方向不对，导致牙齿或牙周组织受损，需要调整咬合',
        severity: 'mild'
      },
      {
        id: 'F018',
        toothPosition: '36,46',
        medicalTerm: '根分叉病变',
        plainExplanation: '多根牙的牙根分叉处出现了骨头破坏，需要特殊清洁和定期维护',
        severity: 'mild'
      }
    ],
    recommendations: [
      '建议调整36、46号牙咬合',
      '根分叉病变需使用特殊牙刷清洁',
      '建议每3个月复查一次'
    ],
    reminder: {
      type: 'three_months',
      typeLabel: '三个月复查',
      date: '2026-05-14',
      note: '根分叉病变复查'
    },
    affectedTeeth: ['36', '46'],
    status: 'viewed'
  }
];

export default mockReports;
