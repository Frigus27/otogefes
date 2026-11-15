import { RANKING_ENDPOINT } from '../config/ranking';
import { normalizeRankingData, type RankingBoard } from './ranking';

/**
 * 浏览器端拉取实时榜单。
 *
 * 使用时间戳绕过 CDN / 浏览器缓存，确保 bot 更新 ranking.json 后页面能拿到新版本。
 */
export const loadRankingBoard = async (
  endpoint: string = RANKING_ENDPOINT,
): Promise<RankingBoard> => {
  const url = new URL(endpoint, window.location.href);
  url.searchParams.set('_', String(Date.now()));

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`榜单接口返回 ${response.status}`);
    }

    return normalizeRankingData(await response.json());
  } finally {
    window.clearTimeout(timeout);
  }
};
