const TIME_ZONE = 'Asia/Shanghai';

const dateParts = (date: Date) =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TIME_ZONE,
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((parts, part) => {
      if (part.type !== 'literal') parts[part.type] = part.value;
      return parts;
    }, {});

export const formatDate = (date: Date): string => {
  const parts = dateParts(date);
  return `${parts.year}.${parts.month}.${parts.day}`;
};

export const formatDateLong = (date: Date): string => {
  const parts = dateParts(date);
  return `${parts.year} 年 ${Number(parts.month)} 月 ${Number(parts.day)} 日`;
};

export const formatDateTime = (date: Date): string => {
  const time = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: TIME_ZONE,
  }).format(date);
  return `${formatDate(date)} ${time}`;
};

export const formatRankingTime = (date: Date | string): string => {
  const value = typeof date === 'string' ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: TIME_ZONE,
  })
    .formatToParts(value)
    .reduce<Record<string, string>>((all, part) => {
      if (part.type !== 'literal') all[part.type] = part.value;
      return all;
    }, {});

  const pad = (part: string) => (parts[part] ?? '').padStart(2, '0');
  return `${pad('month')}-${pad('day')} ${pad('hour')}:${pad('minute')}:${pad('second')}`;
};

export const formatScore = (score: number): string =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(score);


export const padNumber = (value: number, length = 2): string =>
  String(value).padStart(length, '0');

export const readingTime = (body = ''): string => {
  const cjkCharacters = (body.match(/[\u3400-\u9fff]/g) ?? []).length;
  const latinWords = (body.match(/[a-zA-Z0-9]+/g) ?? []).length;
  const minutes = Math.max(1, Math.ceil(cjkCharacters / 350 + latinWords / 220));
  return `${minutes} 分钟阅读`;
};
