import{a as e,c as t,i as n,l as r,n as i,o as a,r as o,s,t as c,u as l}from"./format.DBbzazFC.js";var u=e=>e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`),d=(e,t)=>`
  <th scope="col" class="col-score">
    <span class="song-head">
      <span class="song-head__code">曲 ${t+1}</span>
      <span class="song-head__title" title="${u(e)}">${u(e)}</span>
    </span>
  </th>`,f=(e,t,n)=>`
  <td data-label="曲 ${n+1}" data-song-index="${n+1}" class="score-cell">
    <span class="score-mobile-label">
      <span>曲 ${n+1}</span>
      <span class="score-mobile-title" title="${u(t)}">${u(t)}</span>
    </span>
    <span class="score-number">${o(e)}</span>
  </td>`,p=(e,r)=>{let a=`查看 ${e.playerName} 的手元或屏元`,c=e.scores.map((e,t)=>f(e,r.songs[t]?.title??``,t)).join(``);return`
    <tr class="ranking-row${e.rank<=3?` is-podium`:``}">
      <td data-label="名次" class="rank-cell">
        <span class="rank-number">
          <span class="rank-number__hash" aria-hidden="true">#</span>
          ${n(e.rank)}
        </span>
      </td>
      <td data-label="名称 / id" class="player-cell">
        <span class="player-name">${u(e.playerName)}</span>
        <span class="player-id">${u(e.playerId)}</span>
        ${e.note?`<span class="player-note">${u(e.note)}</span>`:``}
      </td>
      <td data-label="总分" class="total-cell">
        <span class="total-score">${o(e.total)}</span>
      </td>
      ${c}
      <td data-label="手元或屏元" class="video-cell">
        <a
          class="video-link"
          href="${u(e.videoUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${u(a)}"
        >视频 <span aria-hidden="true">↗</span></a>
      </td>
      <td data-label="时间" class="time-cell">
        <time datetime="${u(e.recordedAt)}">${i(e.recordedAt)}</time>
      </td>
      <td data-label="状态" class="status-cell">
        <span class="rank-status rank-status--${t[e.status]}">
          ${s[e.status]}
        </span>
      </td>
    </tr>`},m=(e,t,r)=>`
  <tr class="ranking-cutline">
    <td colspan="9">
      <div class="ranking-cutline__inner">
        <span class="mono">${e} / TOP ${n(r)}</span>
        <span>${t}</span>
        <span class="ranking-cutline__line" aria-hidden="true"></span>
      </div>
    </td>
  </tr>`,h=(e,t)=>{if(e.entries.length===0)return`
      <div class="ranking-empty">
        <span class="ranking-empty__mark mono">NO DATA / 00</span>
        <p class="ranking-empty__title">榜单尚未生成</p>
        <p class="ranking-empty__text">${u(t)}</p>
        <p class="ranking-empty__hint mono">成绩提交与审核功能不在第一阶段范围内</p>
      </div>`;let n=e.songs.map((e,t)=>d(e.title,t)).join(``),r=``,i=!1,a=!1;return e.entries.forEach(t=>{!i&&t.rank>e.cutoff&&(r+=m(`CUT LINE`,`直通线 · 第 1—${e.cutoff} 名直通正赛`,e.cutoff),i=!0),!a&&t.rank>e.lcqCutoff&&(r+=m(`LCQ LINE`,`LCQ 资格线 · 第 ${e.cutoff+1}—${e.lcqCutoff} 名进入 LCQ`,e.lcqCutoff),a=!0),r+=p(t,e)}),`
    <table class="ranking-table">
      <caption class="sr-only">
        预选榜单，包含名次、选手名称与 id、手元或屏元链接、总分、三曲成绩、收录时间与晋级状态。
      </caption>
      <thead>
        <tr>
          <th scope="col" class="col-rank">名次</th>
          <th scope="col" class="col-player">名称 / id</th>
          <th scope="col" class="col-total">总分</th>
          ${n}
          <th scope="col" class="col-video">手元或屏元</th>
          <th scope="col" class="col-time">时间</th>
          <th scope="col" class="col-status">状态</th>
        </tr>
      </thead>
      <tbody>${r}</tbody>
    </table>`},g=`/otogefes`.replace(/\/$/,``),_=e=>!e.startsWith(`/`)||e.startsWith(`//`)||g&&(e===g||e.startsWith(`${g}/`))?e:`${g}${e}`,v=document.querySelector(`[data-ranking-live]`);if(v){let t=v.dataset.rankingEndpoint||r,o=document.querySelector(`[data-ranking-table]`),s=document.querySelector(`[data-live-sync]`),u=document.querySelector(`[data-live-updated]`),d=document.querySelector(`[data-live-count]`),f=document.querySelector(`[data-live-cutoff]`),p=document.querySelector(`[data-live-cutoff-meta]`),m=document.querySelector(`[data-live-notice]`),g=document.querySelector(`[data-live-rules]`),y=document.querySelectorAll(`.page-hero .status, .ranking-bar .status`),b=``,x=!1,S=``,C=(e,t=!1)=>{s&&e!==S&&(S=e,s.textContent=e,s.classList.toggle(`is-error`,t))},w=e=>{y.forEach(t=>{t.className=`status status--${e.statusTone}`,t.textContent=e.statusLabel})},T=e=>{w(e),u&&(u.dateTime=e.updatedAt,u.textContent=c(new Date(e.updatedAt))),d&&(d.textContent=`${n(e.entries.length)} / 正式`),f&&(f.textContent=`直通 TOP ${n(e.cutoff)} · LCQ ${n(e.lcqCutoff)}`),p&&(p.textContent=`CUT / TOP ${n(e.cutoff)} · LCQ ${n(e.lcqCutoff)}`),m&&(m.textContent=e.notice),g&&(g.href=_(e.rulesHref))},E=async()=>{if(!(x||document.hidden)){x=!0;try{let n=await e(t),r=a(n);r!==b&&o&&(o.innerHTML=h(n,`线上预选尚未产生有效成绩。正式榜单开放后，这里会自动展示名次、选手、三曲成绩、时间与晋级状态。`),b=r,v.dataset.rankingVersion=n.updatedAt),T(n),C(`已同步 ${i(n.updatedAt)}`)}catch(e){C(`实时数据不可用 · 显示构建快照`,!0),console.warn(`[ranking] 实时榜单加载失败：`,e)}finally{x=!1}}};E(),window.setInterval(()=>{E()},l),document.addEventListener(`visibilitychange`,()=>{document.hidden||E()}),window.addEventListener(`pageshow`,()=>{E()})}