import { Reminder } from '@/types/reminder';

export const mockReminders: Reminder[] = [
  {
    id: 'RM001',
    reportId: 'RPT001',
    reportTypeLabel: '全景片',
    clinicName: '康美口腔门诊部',
    doctorName: '李明华',
    type: 'one_week',
    typeLabel: '一周内复诊',
    date: '2026-06-25',
    note: '36号牙根管治疗',
    status: 'upcoming'
  },
  {
    id: 'RM002',
    reportId: 'RPT002',
    reportTypeLabel: '根尖片',
    clinicName: '康美口腔门诊部',
    doctorName: '王秀英',
    type: 'one_week',
    typeLabel: '一周内复诊',
    date: '2026-06-22',
    note: '36号牙根管治疗首诊',
    status: 'due_soon'
  },
  {
    id: 'RM003',
    reportId: 'RPT003',
    reportTypeLabel: 'CBCT',
    clinicName: '康美口腔门诊部',
    doctorName: '陈建国',
    type: 'one_week',
    typeLabel: '一周内复诊',
    date: '2026-06-17',
    note: '48号智齿拔除术',
    status: 'overdue'
  },
  {
    id: 'RM004',
    reportId: 'RPT004',
    reportTypeLabel: '全景片',
    clinicName: '康美口腔门诊部',
    doctorName: '李明华',
    type: 'three_months',
    typeLabel: '三个月复查',
    date: '2026-08-20',
    note: '牙周复查',
    status: 'upcoming'
  },
  {
    id: 'RM005',
    reportId: 'RPT005',
    reportTypeLabel: 'CBCT',
    clinicName: '康美口腔门诊部',
    doctorName: '王秀英',
    type: 'pre_implant',
    typeLabel: '种植术前沟通',
    date: '2026-06-10',
    note: '46号牙种植方案沟通',
    status: 'done'
  },
  {
    id: 'RM006',
    reportId: 'RPT007',
    reportTypeLabel: '全景片',
    clinicName: '康美口腔门诊部',
    doctorName: '李明华',
    type: 'three_months',
    typeLabel: '三个月复查',
    date: '2026-07-15',
    note: '正畸评估复查',
    status: 'upcoming'
  },
  {
    id: 'RM007',
    reportId: 'RPT008',
    reportTypeLabel: 'CBCT',
    clinicName: '康美口腔门诊部',
    doctorName: '王秀英',
    type: 'pre_implant',
    typeLabel: '种植术前沟通',
    date: '2026-06-20',
    note: '上颌窦提升+种植方案',
    status: 'due_soon'
  },
  {
    id: 'RM008',
    reportId: 'RPT009',
    reportTypeLabel: '根尖片',
    clinicName: '康美口腔门诊部',
    doctorName: '陈建国',
    type: 'one_week',
    typeLabel: '一周内复诊',
    date: '2026-03-12',
    note: '11号牙根管治疗',
    status: 'done'
  },
  {
    id: 'RM009',
    reportId: 'RPT010',
    reportTypeLabel: '全景片',
    clinicName: '康美口腔门诊部',
    doctorName: '李明华',
    type: 'three_months',
    typeLabel: '三个月复查',
    date: '2026-05-14',
    note: '根分叉病变复查',
    status: 'overdue'
  }
];

export default mockReminders;
