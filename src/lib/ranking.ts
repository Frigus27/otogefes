import type { StatusTone } from '../config/event';

export const RANKING_SCORE_COUNT = 3;
export const RANKING_MAX_SCORE = 10_002_228;
/** 直通线之后进入 LCQ 的名额数：第 8—15 名，依据章程。 */
export const RANKING_LCQ_SLOTS = 8;

export type RankingEntryStatus = 'advance' | 'lcq' | 'review' | 'out';

export interface RankingSong {
  id: string;
  title: string;
}

export interface RankingSourceEntry {
  playerId: string;
  playerName: string;
  recordedAt: string;
  videoUrl: string;
  scores: number[];
  review?: boolean;
  note?: string;
}

export interface RankingEntry extends RankingSourceEntry {
  scores: number[];
  total: number;
  rank: number;
  status: RankingEntryStatus;
}

export interface RankingBoard {
  schemaVersion: 1;
  project: string;
  statusLabel: string;
  statusTone: StatusTone;
  cutoff: number;
  /** 直通线之后进入 LCQ 的最后一名，默认由 cutoff + RANKING_LCQ_SLOTS 推导。 */
  lcqCutoff: number;
  notice: string;
  rulesHref: string;
  updatedAt: string;
  songs: RankingSong[];
  entries: RankingEntry[];
}

const STATUS_TONES: StatusTone[] = ['pending', 'active', 'upcoming', 'done'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isValidDate = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(new Date(value).getTime());

const isHttpUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const fail = (messages: string[]): never => {
  throw new Error(`[ranking] 数据校验失败：\n- ${messages.join('\n- ')}`);
};

/**
 * 将 bot / 外部数据源写入的原始 JSON 规范化为页面可直接消费的排名。
 *
 * 规则：
 * - 总分 = 三曲成绩之和；
 * - 总分降序；
 * - 总分相同时，收录时间更晚的在前；
 * - 仍相同的话，用 playerId 升序保证构建与刷新结果稳定；
 * - 第 1—cutoff 名标记为晋级区，随后 RANKING_LCQ_SLOTS 名为 LCQ 资格区；
 * - review 为 true 时优先显示审核中。
 *
 * rank、total、status 都是推导值，不写入 JSON，避免手工维护不一致。
 */
export const normalizeRankingData = (raw: unknown): RankingBoard => {
  const errors: string[] = [];

  if (!isRecord(raw)) fail(['根节点必须是 JSON 对象。']);

  const data = raw as Record<string, unknown>;

  if (data.schemaVersion !== 1) errors.push('schemaVersion 必须为 1。');
  if (!isNonEmptyString(data.project)) errors.push('project 不能为空。');
  if (!isNonEmptyString(data.statusLabel)) errors.push('statusLabel 不能为空。');
  if (!STATUS_TONES.includes(data.statusTone as StatusTone)) {
    errors.push(`statusTone 必须是 ${STATUS_TONES.join(' / ')} 之一。`);
  }
  if (!Number.isInteger(data.cutoff) || (data.cutoff as number) < 1) {
    errors.push('cutoff 必须是大于 0 的整数。');
  }
  if (!isNonEmptyString(data.notice)) errors.push('notice 不能为空。');
  if (!isNonEmptyString(data.rulesHref)) errors.push('rulesHref 不能为空。');
  if (!isValidDate(data.updatedAt)) errors.push('updatedAt 必须是有效日期时间。');

  if (!Array.isArray(data.songs) || data.songs.length !== RANKING_SCORE_COUNT) {
    errors.push(`songs 必须包含 ${RANKING_SCORE_COUNT} 首曲目。`);
  }

  const songs: RankingSong[] = [];
  if (Array.isArray(data.songs)) {
    data.songs.forEach((song, index) => {
      if (!isRecord(song)) {
        errors.push(`第 ${index + 1} 首曲目必须是对象。`);
        return;
      }
      if (!isNonEmptyString(song.id)) errors.push(`第 ${index + 1} 首曲目的 id 不能为空。`);
      if (!isNonEmptyString(song.title)) errors.push(`第 ${index + 1} 首曲目的 title 不能为空。`);
      songs.push({ id: String(song.id ?? ''), title: String(song.title ?? '') });
    });
  }

  if (!Array.isArray(data.entries)) {
    fail([...errors, 'entries 必须是数组。']);
  }

  const playerIds = new Set<string>();
  const entries: Array<RankingEntry> = [];

  (data.entries as unknown[]).forEach((entry, index) => {
    const row = index + 1;

    if (!isRecord(entry)) {
      errors.push(`第 ${row} 条成绩必须是对象。`);
      return;
    }

    if (!isNonEmptyString(entry.playerId)) {
      errors.push(`第 ${row} 条缺少 playerId。`);
    } else if (playerIds.has(entry.playerId)) {
      errors.push(`playerId 重复：${entry.playerId}。`);
    } else {
      playerIds.add(entry.playerId);
    }

    if (!isNonEmptyString(entry.playerName)) errors.push(`第 ${row} 条缺少 playerName。`);
    if (!isValidDate(entry.recordedAt)) errors.push(`第 ${row} 条的 recordedAt 不是有效时间。`);
    if (!isHttpUrl(entry.videoUrl)) errors.push(`第 ${row} 条的 videoUrl 必须是 http/https 链接。`);

    if (entry.review !== undefined && typeof entry.review !== 'boolean') {
      errors.push(`第 ${row} 条的 review 必须是布尔值。`);
    }
    if (entry.note !== undefined && typeof entry.note !== 'string') {
      errors.push(`第 ${row} 条的 note 必须是字符串。`);
    }

    if (!Array.isArray(entry.scores) || entry.scores.length !== RANKING_SCORE_COUNT) {
      errors.push(`第 ${row} 条必须包含 ${RANKING_SCORE_COUNT} 个曲目成绩。`);
      return;
    }

    const scores = entry.scores.map((score) => {
      if (!Number.isInteger(score) || (score as number) < 0 || (score as number) > RANKING_MAX_SCORE) {
        errors.push(
          `第 ${row} 条的成绩必须是 0 到 ${RANKING_MAX_SCORE.toLocaleString('en-US')} 之间的整数。`,
        );
      }
      return Number(score);
    });

    if (
      !isNonEmptyString(entry.playerId) ||
      !isNonEmptyString(entry.playerName) ||
      !isValidDate(entry.recordedAt) ||
      !isHttpUrl(entry.videoUrl) ||
      scores.some((score) => !Number.isFinite(score))
    ) {
      return;
    }

    entries.push({
      playerId: entry.playerId,
      playerName: entry.playerName,
      recordedAt: entry.recordedAt,
      videoUrl: entry.videoUrl,
      scores,
      review: entry.review === true,
      note: typeof entry.note === 'string' ? entry.note : '',
      total: scores.reduce((sum, score) => sum + score, 0),
      rank: 0,
      status: 'out',
    });
  });

  if (errors.length) fail(errors);

  const cutoff = data.cutoff as number;
  const lcqCutoff = cutoff + RANKING_LCQ_SLOTS;

  const sorted = entries
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      const timeDiff = new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
      if (timeDiff !== 0) return timeDiff;
      return a.playerId.localeCompare(b.playerId, 'en');
    })
    .map((entry, index) => {
      const rank = index + 1;
      let status: RankingEntryStatus = 'out';

      if (entry.review) {
        status = 'review';
      } else if (rank <= cutoff) {
        status = 'advance';
      } else if (rank <= lcqCutoff) {
        status = 'lcq';
      }

      return { ...entry, rank, status };
    });

  return {
    schemaVersion: 1,
    project: data.project as string,
    statusLabel: data.statusLabel as string,
    statusTone: data.statusTone as StatusTone,
    cutoff,
    lcqCutoff,
    notice: data.notice as string,
    rulesHref: data.rulesHref as string,
    updatedAt: data.updatedAt as string,
    songs,
    entries: sorted,
  };
};

export const statusLabel: Record<RankingEntryStatus, string> = {
  advance: '晋级区',
  lcq: 'LCQ 资格区',
  review: '审核中',
  out: '未晋级',
};

export const statusTone: Record<RankingEntryStatus, string> = {
  advance: 'advance',
  lcq: 'lcq',
  review: 'review',
  out: 'out',
};


/**
 * 用于浏览器判断榜单是否真的发生了变化。
 * 即使 bot 忘记更新 updatedAt，只要任意成绩、时间、状态或曲名变化，也会触发重绘。
 */
export const rankingSignature = (board: RankingBoard): string =>
  JSON.stringify({
    updatedAt: board.updatedAt,
    cutoff: board.cutoff,
    statusLabel: board.statusLabel,
    statusTone: board.statusTone,
    lcqCutoff: board.lcqCutoff,
    notice: board.notice,
    rulesHref: board.rulesHref,
    songs: board.songs,
    entries: board.entries.map((entry) => [
      entry.playerId,
      entry.playerName,
      entry.recordedAt,
      entry.scores,
      entry.review,
      entry.note,
      entry.status,
    ]),
  });
