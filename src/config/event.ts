/**
 * 赛事信息的唯一维护入口。
 *
 * 带「待」字样或空字符串的字段都是有意保留的占位内容。
 * 在主办方确认前，请不要把占位内容替换成未经核实的日期、场馆或联系方式。
 */

export type StatusTone = 'pending' | 'active' | 'upcoming' | 'done';

export interface EventStage {
  code: string;
  title: string;
  summary: string;
  status: string;
  tone: StatusTone;
}

export interface EventConfig {
  name: string;
  englishName: string;
  edition: string;
  eventCode: string;
  tagline: string;
  summary: string;
  status: {
    label: string;
    phase: string;
    description: string;
    rangeShort: string;
    tone: StatusTone;
  };
  project: {
    name: string;
    englishLabel: string;
    descriptor: string;
    note: string;
  };
  dates: {
    display: string;
    startsAt: string | null;
    endsAt: string | null;
    note: string;
  };
  venue: {
    city: string;
    display: string;
    venueName: string;
    address: string;
    note: string;
  };
  format: {
    display: string;
    online: string;
    onsite: string;
    note: string;
  };
  organizer: {
    name: string;
    contact: string;
  };
  stages: EventStage[];
  stagesNote: string;
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

export const event = {
  name: '合肥「第一」音游祭',
  englishName: 'HEFEI OTOGE FES',
  edition: 'VOL. 01',
  eventCode: 'HF-OTG-01',
  tagline: '「泥安·泥工·妮可」三校音游竞赛',
  summary:
    '一场属于三校的 Arcaea 线下聚会与赛事。线上预选前七名直通正赛，第 8—15 名进入 LCQ，八强正赛采用双败赛制。',
  status: {
    label: '线上预选',
    phase: '进行中',
    description: '2026.11.15—2026.12.15',
    rangeShort: '11.15—12.15',
    tone: 'active',
  },
  project: {
    name: 'Arcaea',
    englishLabel: 'ARCAEA',
    descriptor: '当前比赛项目',
    note: '预选课题为 Judgement [FTR 10]、Infinite Strife, [BYD 10+] 与 chronologia [ETR 10+]。',
  },
  dates: {
    display: '2027.1.1（拟）',
    startsAt: null,
    endsAt: null,
    note: '线下比赛日',
  },
  venue: {
    city: '合肥',
    display: '合肥 · 场馆待公布',
    venueName: '待公布',
    address: '待公布',
    note: '场馆、交通与入场方式将在确认后发布',
  },
  format: {
    display: '线上预选 → LCQ → 双败正赛',
    online: '线上预选',
    onsite: 'LCQ + 八强双败正赛',
    note: '预选前七名直通正赛，第 8—15 名进入 LCQ 决出第 8 号种子',
  },
  organizer: {
    name: '赛事组',
    contact: '在QQ群中询问',
  },
  stages: [
    {
      code: '01',
      title: '报名与登记',
      summary: '三校玩家提交参赛昵称、联系方式、Arcaea ID、学校与曲包情况。',
      status: '已截止',
      tone: 'done',
    },
    {
      code: '02',
      title: '线上预选',
      summary: '11.15—12.15 提交三曲连续游玩成绩与视频，取审核通过的最高整组总分。',
      status: '进行中',
      tone: 'active',
    },
    {
      code: '03',
      title: '成绩审核',
      summary: '核验成绩与视频，公示第 1—7 名直通名单、第 8—15 名 LCQ 名单及候补顺序。',
      status: '待开始',
      tone: 'upcoming',
    },
    {
      code: '04',
      title: 'LCQ 与八强正赛',
      summary: '比赛日拟为 2027.1.1：LCQ 决出第 8 号种子，随后进行九时段八强双败正赛。',
      status: '待开赛',
      tone: 'upcoming',
    },
  ],
  stagesNote: '比赛章程 v3.4 已发布；场地、签到与开赛时刻待统一公告。',
  seo: {
    title: '合肥「第一」音游祭｜Arcaea 线上预选与八强双败正赛',
    description:
      '合肥「第一」音游祭赛事官网：查看 Arcaea 线上预选榜单、正式比赛章程、LCQ 与八强双败现场赛程及最新公告。',
    ogImage: '/og.png',
  },
} satisfies EventConfig;

export type NavItem = {
  href: string;
  label: string;
  english: string;
};

export const navigation: NavItem[] = [
  { href: '/ranking', label: '预选榜单', english: 'Ranking' },
  { href: '/rules', label: '比赛章程', english: 'Charter' },
  { href: '/schedule', label: '现场赛程', english: 'Schedule' },
  { href: '/news', label: '赛事公告', english: 'News' },
];

export const isPlaceholder = (value: string): boolean =>
  !value.trim() || value.includes('待');
