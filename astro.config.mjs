import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { satteri } from '@astrojs/markdown-satteri';

// 正式站点地址：canonical、Open Graph 与站内链接都以此为准。
const SITE_ORIGIN = 'https://frigussum.com';
const BASE_PATH = '/otogefes';

// 榜单横幅默认关闭；只有显式设置 PUBLIC_RANKING_BANNER=true 才随构建输出。
const env = loadEnv(process.env.NODE_ENV === 'development' ? 'development' : 'production', process.cwd(), '');
const rankingBannerEnabled = ['true', '1', 'on', 'yes'].includes(
  (env.PUBLIC_RANKING_BANNER ?? '').trim().toLowerCase(),
);

const prefixPath = (value) => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
  if (value === BASE_PATH || value.startsWith(`${BASE_PATH}/`)) return value;
  return value === '/' ? `${BASE_PATH}/` : `${BASE_PATH}${value}`;
};

const prefixHtmlAttributes = (html) =>
  html.replace(/\b(href|src)="\/(?!\/)/g, (_, attribute) => `${attribute}="${BASE_PATH}/`);

/**
 * Markdown 中的站内绝对路径不会自动带上部署 base，
 * 这里统一为 a[href] / img[src] 补前缀，包括正文里的原始 HTML。
 */
const basePathPlugin = {
  name: 'base-path',
  element: {
    filter: ['a', 'img'],
    visit(node, ctx) {
      const key = node.tagName === 'a' ? 'href' : 'src';
      const value = node.properties?.[key];
      const prefixed = prefixPath(value);
      if (prefixed !== value) ctx.setProperty(node, key, prefixed);
    },
  },
  raw(node, ctx) {
    const next = prefixHtmlAttributes(node.value);
    if (next !== node.value) ctx.replaceNode(node, { type: 'raw', value: next });
  },
};

/** 关闭横幅时同时从产物中移除曲绘资源，避免素材继续随站点分发。 */
const rankingBannerGuard = {
  name: 'ranking-banner-guard',
  generateBundle(_options, bundle) {
    if (rankingBannerEnabled) return;
    for (const fileName of Object.keys(bundle)) {
      if (fileName.includes('banner-ranking-songs')) delete bundle[fileName];
    }
  },
};

export default defineConfig({
  site: SITE_ORIGIN,
  base: BASE_PATH,
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [rankingBannerGuard],
  },
  markdown: {
    processor: satteri({
      hastPlugins: [basePathPlugin],
    }),
  },
  devToolbar: {
    enabled: false,
  },
});
