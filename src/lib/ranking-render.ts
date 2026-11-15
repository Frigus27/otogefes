import { formatRankingTime, formatScore, padNumber } from './format';
import {
  statusLabel,
  statusTone,
  type RankingBoard,
  type RankingEntry,
} from './ranking';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderScoreHeader = (title: string, index: number): string => `
  <th scope="col" class="col-score">
    <span class="song-head">
      <span class="song-head__code">曲 ${index + 1}</span>
      <span class="song-head__title" title="${escapeHtml(title)}">${escapeHtml(title)}</span>
    </span>
  </th>`;

const renderScoreCell = (score: number, title: string, index: number): string => `
  <td data-label="曲 ${index + 1}" data-song-index="${index + 1}" class="score-cell">
    <span class="score-mobile-label">
      <span>曲 ${index + 1}</span>
      <span class="score-mobile-title" title="${escapeHtml(title)}">${escapeHtml(title)}</span>
    </span>
    <span class="score-number">${formatScore(score)}</span>
  </td>`;

const renderEntry = (entry: RankingEntry, board: RankingBoard): string => {
  const videoLabel = `查看 ${entry.playerName} 的手元或屏元`;
  const scores = entry.scores
    .map((score, index) => renderScoreCell(score, board.songs[index]?.title ?? '', index))
    .join('');

  return `
    <tr class="ranking-row${entry.rank <= 3 ? ' is-podium' : ''}">
      <td data-label="名次" class="rank-cell">
        <span class="rank-number">
          <span class="rank-number__hash" aria-hidden="true">#</span>
          ${padNumber(entry.rank)}
        </span>
      </td>
      <td data-label="名称 / id" class="player-cell">
        <span class="player-name">${escapeHtml(entry.playerName)}</span>
        <span class="player-id">${escapeHtml(entry.playerId)}</span>
        ${entry.note ? `<span class="player-note">${escapeHtml(entry.note)}</span>` : ''}
      </td>
      <td data-label="总分" class="total-cell">
        <span class="total-score">${formatScore(entry.total)}</span>
      </td>
      ${scores}
      <td data-label="手元或屏元" class="video-cell">
        <a
          class="video-link"
          href="${escapeHtml(entry.videoUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${escapeHtml(videoLabel)}"
        >视频 <span aria-hidden="true">↗</span></a>
      </td>
      <td data-label="时间" class="time-cell">
        <time datetime="${escapeHtml(entry.recordedAt)}">${formatRankingTime(entry.recordedAt)}</time>
      </td>
      <td data-label="状态" class="status-cell">
        <span class="rank-status rank-status--${statusTone[entry.status]}">
          ${statusLabel[entry.status]}
        </span>
      </td>
    </tr>`;
};

const renderCutline = (label: string, note: string, cutoff: number): string => `
  <tr class="ranking-cutline">
    <td colspan="9">
      <div class="ranking-cutline__inner">
        <span class="mono">${label} / TOP ${padNumber(cutoff)}</span>
        <span>${note}</span>
        <span class="ranking-cutline__line" aria-hidden="true"></span>
      </div>
    </td>
  </tr>`;

/**
 * 同时用于 Astro 首屏渲染和浏览器实时刷新。
 * 返回纯 HTML 字符串，必须对所有外部文本做转义。
 */
export const renderRankingTable = (board: RankingBoard, emptyText: string): string => {
  if (board.entries.length === 0) {
    return `
      <div class="ranking-empty">
        <span class="ranking-empty__mark mono">NO DATA / 00</span>
        <p class="ranking-empty__title">榜单尚未生成</p>
        <p class="ranking-empty__text">${escapeHtml(emptyText)}</p>
        <p class="ranking-empty__hint mono">成绩提交与审核功能不在第一阶段范围内</p>
      </div>`;
  }

  const scoreHeaders = board.songs
    .map((song, index) => renderScoreHeader(song.title, index))
    .join('');

  let rows = '';
  let advanceLineInserted = false;
  let lcqLineInserted = false;

  board.entries.forEach((entry) => {
    if (!advanceLineInserted && entry.rank > board.cutoff) {
      rows += renderCutline(
        'CUT LINE',
        `直通线 · 第 1—${board.cutoff} 名直通正赛`,
        board.cutoff,
      );
      advanceLineInserted = true;
    }

    if (!lcqLineInserted && entry.rank > board.lcqCutoff) {
      rows += renderCutline(
        'LCQ LINE',
        `LCQ 资格线 · 第 ${board.cutoff + 1}—${board.lcqCutoff} 名进入 LCQ`,
        board.lcqCutoff,
      );
      lcqLineInserted = true;
    }

    rows += renderEntry(entry, board);
  });

  return `
    <table class="ranking-table">
      <caption class="sr-only">
        预选榜单，包含名次、选手名称与 id、手元或屏元链接、总分、三曲成绩、收录时间与晋级状态。
      </caption>
      <thead>
        <tr>
          <th scope="col" class="col-rank">名次</th>
          <th scope="col" class="col-player">名称 / id</th>
          <th scope="col" class="col-total">总分</th>
          ${scoreHeaders}
          <th scope="col" class="col-video">手元或屏元</th>
          <th scope="col" class="col-time">时间</th>
          <th scope="col" class="col-status">状态</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
};
