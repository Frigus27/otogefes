import type { ScheduleData } from "../data/schedule";

const fail = (source: string, messages: string[]): never => {
  throw new Error(`[${source}] 数据校验失败：\n- ${messages.join("\n- ")}`);
};

/**
 * 赛程数据需要保持稳定的 id，供后续接入对阵信息、结果和锚点使用。
 */
export const validateScheduleData = (data: ScheduleData): void => {
  const errors: string[] = [];
  const ids = new Set<string>();
  const codes = new Set<string>();

  data.items.forEach((item, index) => {
    const row = index + 1;
    if (!item.id.trim()) errors.push(`第 ${row} 个赛程项缺少 id。`);
    if (ids.has(item.id)) errors.push(`赛程项 id 重复：${item.id}。`);
    ids.add(item.id);

    if (!item.code.trim()) errors.push(`赛程项 ${item.id} 缺少 code。`);
    if (codes.has(item.code)) errors.push(`赛程项 code 重复：${item.code}。`);
    codes.add(item.code);

    if (!item.title.trim()) errors.push(`赛程项 ${item.id} 缺少 title。`);
    if (!item.time.trim()) errors.push(`赛程项 ${item.id} 缺少 time。`);
  });

  const slotIndexes = new Set<string>();
  data.slots.forEach((slot, index) => {
    const row = index + 1;
    if (!slot.index.trim()) errors.push(`第 ${row} 个时段缺少 index。`);
    if (slotIndexes.has(slot.index)) errors.push(`时段 index 重复：${slot.index}。`);
    slotIndexes.add(slot.index);

    if (!slot.main.trim()) errors.push(`第 ${row} 个时段缺少主舞台场次。`);
    if (!slot.side.trim()) errors.push(`第 ${row} 个时段缺少副舞台信息。`);
  });

  if (errors.length) fail("schedule", errors);
};
