import rawRanking from './ranking.json';
import { normalizeRankingData } from '../lib/ranking';

/**
 * 构建时使用的榜单快照。
 *
 * 线上实时数据由页面在浏览器中从 PUBLIC_RANKING_URL（或本地 /data/ranking.json）
 * 获取；这里的数据用于首屏 HTML 与无 JS 场景。两份数据使用相同 schema。
 */
export const ranking = normalizeRankingData(rawRanking);

export { RANKING_SCORE_COUNT as SCORE_COUNT } from '../lib/ranking';
export type { RankingBoard, RankingEntry, RankingSong } from '../lib/ranking';
