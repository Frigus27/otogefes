import type { APIRoute } from 'astro';
import rawRanking from '../../data/ranking.json';

/**
 * 本地开发与静态构建时的榜单快照。
 *
 * 生产环境如果配置了 PUBLIC_RANKING_URL，浏览器会改读外部可写数据源；
 * 这个文件仍然作为接口不可用时的静态兜底。
 */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(rawRanking), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
