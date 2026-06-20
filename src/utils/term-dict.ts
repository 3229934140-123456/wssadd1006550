import { TermEntry } from '@/types/term';

const termDict: TermEntry[] = [
  {
    medicalTerm: '根尖周低密度影',
    plainExplanation: '牙根尖周围出现了阴影区域，提示可能有炎症或感染，需要进一步检查确认',
    category: '根尖病变'
  },
  {
    medicalTerm: '牙槽骨水平吸收',
    plainExplanation: '牙床骨整体高度降低，就像水土流失一样，牙齿的支撑力量变弱了',
    category: '牙周病变'
  },
  {
    medicalTerm: '埋伏阻生',
    plainExplanation: '牙齿长在骨头里面出不来，可能压迫旁边的牙齿，通常需要手术处理',
    category: '阻生齿'
  },
  {
    medicalTerm: '根尖周炎',
    plainExplanation: '牙根尖周围组织发炎，通常是因为蛀牙细菌深入到了牙根，需要根管治疗',
    category: '根尖病变'
  },
  {
    medicalTerm: '龋齿',
    plainExplanation: '俗称蛀牙，是牙齿被细菌侵蚀后形成的洞，早发现可以简单补牙',
    category: '龋病'
  },
  {
    medicalTerm: '牙周炎',
    plainExplanation: '牙龈和牙床骨的慢性发炎，时间长了牙齿会松动，需要定期洗牙和维护',
    category: '牙周病变'
  },
  {
    medicalTerm: '根管治疗术后',
    plainExplanation: '已经完成了牙神经的治疗，这颗牙比较脆弱，需要后续做牙冠保护它',
    category: '治疗后'
  },
  {
    medicalTerm: '缺牙区',
    plainExplanation: '这里牙齿已经缺失，需要考虑种植牙或镶牙来恢复咀嚼功能',
    category: '缺牙'
  },
  {
    medicalTerm: '阻生智齿',
    plainExplanation: '智齿没有正常长出来，可能顶到前面的牙齿，建议尽早拔除',
    category: '阻生齿'
  },
  {
    medicalTerm: '牙周袋加深',
    plainExplanation: '牙龈和牙齿之间的缝隙变深了，容易藏细菌，需要专业清洁',
    category: '牙周病变'
  },
  {
    medicalTerm: '根分叉病变',
    plainExplanation: '多根牙的牙根分叉处出现了骨头破坏，需要特殊清洁和定期维护',
    category: '牙周病变'
  },
  {
    medicalTerm: '牙髓炎',
    plainExplanation: '牙神经发炎了，会引起剧烈疼痛，需要做根管治疗来缓解',
    category: '牙髓病变'
  },
  {
    medicalTerm: '颌骨囊肿',
    plainExplanation: '颌骨内出现了含液体的囊腔，大多为良性，但需手术摘除',
    category: '囊肿'
  },
  {
    medicalTerm: '牙列缺损',
    plainExplanation: '多颗牙齿缺失，影响咀嚼和美观，建议修复治疗',
    category: '缺牙'
  },
  {
    medicalTerm: '咬合创伤',
    plainExplanation: '咬合力量过大或方向不对，导致牙齿或牙周组织受损，需要调整咬合',
    category: '咬合'
  }
];

export function getPlainExplanation(medicalTerm: string): string {
  const entry = termDict.find(t => medicalTerm.includes(t.medicalTerm));
  if (entry) return entry.plainExplanation;
  return `${medicalTerm}：建议咨询医生了解详细情况`;
}

export function getAllTerms(): TermEntry[] {
  return termDict;
}

export default termDict;
