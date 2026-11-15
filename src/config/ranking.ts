/**
 * 线上实时榜单地址。
 *
 * 本地开发时留空即可，会读取站点自己的 /data/ranking.json。
 * 正式环境可指向对象存储、KV、独立数据服务等可被 bot 原子覆盖的 URL。
 * 该地址必须允许站点跨域读取，并返回 application/json。
 */
const publicEndpoint = (import.meta.env.PUBLIC_RANKING_URL as string | undefined)?.trim();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export const RANKING_ENDPOINT = publicEndpoint || `${basePath}/data/ranking.json`;

/**
 * 榜单页曲绘横幅开关。
 *
 * 默认关闭。确认官方素材授权后，构建时设置
 * PUBLIC_RANKING_BANNER=true 才会输出横幅及其曲绘资源。
 */
const bannerFlag = (import.meta.env.PUBLIC_RANKING_BANNER as string | undefined)
  ?.trim()
  .toLowerCase();

export const SHOW_RANKING_BANNER = ['true', '1', 'on', 'yes'].includes(bannerFlag ?? '');

/** 页面打开期间每隔 30 秒检查一次新榜单。 */
export const RANKING_REFRESH_MS = 30_000;
