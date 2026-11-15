import type { StatusTone } from '../config/event';

export type ScheduleItemStatus = 'tba' | 'pending' | 'confirmed';

export interface ScheduleItem {
  id: string;
  code: string;
  time: string;
  title: string;
  description: string;
  status: string;
  statusTone: StatusTone;
  note?: string;
}

export interface ScheduleSlot {
  index: string;
  label?: string;
  main: string;
  side: string;
  note?: string;
}

export interface ScheduleData {
  statusLabel: string;
  statusTone: StatusTone;
  dateLabel: string;
  venueName: string;
  venueAddress: string;
  venueNote: string;
  overview: Array<{
    label: string;
    value: string;
    tone: StatusTone;
  }>;
  items: ScheduleItem[];
  slots: ScheduleSlot[];
  qualifiers: {
    published: boolean;
    emptyText: string;
  };
  bracket: {
    published: boolean;
    emptyText: string;
  };
  results: {
    published: boolean;
    emptyText: string;
  };
  isPlaceholder: boolean;
  notice: string;
}

/**
 * 现场赛程数据，依据《比赛章程 v3.4》整理。
 *
 * 比赛日为拟定的 2027 年 1 月 1 日，具体场地、签到与开赛时刻仍待公布。
 * items 描述比赛日的阶段结构，slots 对应章程 6.6 的双舞台九时段排程。
 */
export const schedule: ScheduleData = {
  statusLabel: '现场时刻待公布',
  statusTone: 'pending',
  dateLabel: '2027.1.1（拟）',
  venueName: '场馆待公布',
  venueAddress: '合肥 · 地址待公布',
  venueNote:
    '现场安排待议：场地、签到与开赛时间、主副舞台设备及人员、调试时长、最低休息时长与迟到宽限，确定后统一公布现场时间表。',
  overview: [
    { label: '线上预选', value: '11.15—12.15', tone: 'active' },
    { label: 'LCQ 最后机会', value: '比赛日 · 正赛前', tone: 'upcoming' },
    { label: '八强双败正赛', value: '9 时段 · 双舞台', tone: 'upcoming' },
  ],
  items: [
    {
      id: 'check-in',
      code: '01',
      time: '开赛前',
      title: '签到与设备确认',
      description:
        '选手按公告签到，完成设备、音频、录制或投屏检查，并获得相同的赛前调试与热身机会。',
      status: '时刻待公布',
      statusTone: 'pending',
      note: '签到时间、迟到宽限与最低休息时长将在现场时间表中公布。',
    },
    {
      id: 'lcq-group',
      code: '02',
      time: '正赛前',
      title: 'LCQ 分组轮 · 八进二',
      description:
        'A 组为预选第 8、11、12、15 名，B 组为第 9、10、13、14 名。两组使用同一组两首随机课题，组内总分第一进入决胜轮。',
      status: '赛制已定',
      statusTone: 'upcoming',
    },
    {
      id: 'lcq-final',
      code: '03',
      time: '正赛前',
      title: 'LCQ 决胜轮 · 二进一',
      description:
        '两名小组第一进行三曲总分制对赛，胜者成为第 8 号种子，与预选前七名组成正赛八强。',
      status: '赛制已定',
      statusTone: 'upcoming',
    },
    {
      id: 'bracket-early',
      code: '04',
      time: '时段 1—5',
      title: '八强正赛 · 双舞台并行',
      description:
        'U1—U6 与 L1—L4 在主、副舞台并行推进，每场均为三曲总分制；L3、L4 完成后副舞台停止并行。',
      status: '赛制已定',
      statusTone: 'upcoming',
    },
    {
      id: 'bracket-final',
      code: '05',
      time: '时段 6—9',
      title: '单线决胜 · L5 至总决赛',
      description:
        'L5 四进三、U7 胜者组决赛、L6 决出季军依次进行，最后由胜者组冠军与败者组冠军进行五曲总决赛。',
      status: '赛制已定',
      statusTone: 'upcoming',
    },
    {
      id: 'awards',
      code: '06',
      time: '决赛后',
      title: '结果公布与颁奖',
      description: '公布冠军、亚军、季军并完成颁奖。具体奖品与流程以正式公告为准。',
      status: '待公布',
      statusTone: 'pending',
    },
  ],
  slots: [
    { index: '1', label: '八强首轮 · 前两场', main: 'U1', side: 'U2' },
    { index: '2', label: '八强首轮 · 后两场', main: 'U3', side: 'U4' },
    { index: '3', label: '败者组首轮', main: 'L1', side: 'L2' },
    { index: '4', label: '胜者组半决赛', main: 'U5', side: 'U6' },
    { index: '5', label: '败者组第二轮', main: 'L3', side: 'L4' },
    { index: '6', main: 'L5 败者组半决赛', side: '停止并行', note: '四进三' },
    { index: '7', main: 'U7 胜者组决赛', side: '停止并行', note: '胜者进 GF' },
    { index: '8', main: 'L6 败者组决赛', side: '停止并行', note: '决出季军' },
    { index: '9', main: 'GF 总决赛', side: '停止并行', note: '五曲总分制' },
  ],
  qualifiers: {
    published: false,
    emptyText: '预选结束后公布第 1—7 名直通名单、第 8—15 名 LCQ 名单及候补顺序。',
  },
  bracket: {
    published: false,
    emptyText:
      '抽签后固定整张赛程。第 1—4 号与第 5—8 号种子公开抽签形成 U1—U4 对阵，随后公布完整双败对阵。',
  },
  results: {
    published: false,
    emptyText: '比赛结束后公布冠军、亚军、季军及各场比分记录。',
  },
  isPlaceholder: false,
  notice: '现场时间表尚未公布。以上为章程规定的比赛日结构；签到、开赛时刻与场馆以赛前统一公告为准。',
};
