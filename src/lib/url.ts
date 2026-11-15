/** 去掉末尾斜杠的部署子路径，根路径部署时为空字符串。 */
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * 给站内绝对路径补充部署 base，外链、协议相对地址与纯锚点原样返回。
 */
export const withBase = (path: string): string => {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (BASE_PATH && (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`))) return path;
  return `${BASE_PATH}${path}`;
};
