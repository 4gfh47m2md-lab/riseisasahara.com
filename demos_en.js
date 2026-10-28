/* Technologyの「試す」見本。2026-10-28 本人「作ってきたTechnologyは１個ずつ実際に試せる例を表示しよう」。
   ★正本はここ（~/vitruvian/products/gijutsu/demos.js）。/gijutsu と riseisasahara.com の両方が使う。
   gijutsuDemo(id, Add箱, {palettes}) で、そのTechnologyの見本を箱の中に作る。中身はすべて見本の数字（本物の記録・人の名前・Moneyは出さない）。
   色は使う側のページの --bg --bg2 --ink --ink2 --line --acc --acc2 を使う。新しいTechnologyを足したら DEMOS に1つ足す */
(function () {
  if (!document.getElementById('gd-style')) {
    const st = document.createElement('style'); st.id = 'gd-style';
    st.textContent = `.gd{border:1px solid var(--line);border-radius:12px;background:var(--bg);padding:14px;margin:10px 0 4px;font-size:13.5px;color:var(--ink)}
.gd .gd-h{font-size:11.5px;color:var(--ink2);margin:0 0 10px}
.gd button{font:inherit;font-size:12.5px;border:1px solid var(--line);background:var(--bg2);color:var(--ink);border-radius:999px;padding:4px 12px;cursor:pointer}
.gd button.p{background:var(--acc);border-color:var(--acc);color:#fff}
.gd input,.gd select{font:inherit;font-size:13px;border:1px solid var(--line);border-radius:8px;padding:5px 8px;background:var(--bg);color:var(--ink);min-width:0}
.gd .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.gd .ok{color:#2e7d4f;font-weight:700}.gd .ng{color:var(--acc);font-weight:700}
.gd table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}.gd td,.gd th{border-bottom:1px solid var(--line);padding:5px 6px;text-align:center}
.gd th{font-size:11.5px;color:var(--ink2);font-weight:600}.gd td input{width:52px;text-align:center}
.gd .num{font-family:var(--num,Oswald),sans-serif;font-weight:700}
.gd .bar{height:14px;border-radius:7px;background:var(--bg2);overflow:hidden;border:1px solid var(--line)}.gd .bar i{display:block;height:100%;transition:width .3s}
.gd .slot{position:relative;height:150px;border:1px solid var(--line);border-radius:8px;background:repeating-linear-gradient(var(--bg) 0 29px,var(--line) 29px 30px)}
.gd .chip{display:inline-block;padding:4px 10px;border-radius:8px;color:#fff;cursor:grab;touch-action:none;user-select:none;font-size:12px}
.gd .sw{width:30px;height:30px;border-radius:7px;border:2px solid transparent;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}.gd .sw.on{border-color:var(--ink)}
.gd .mini{border:1px solid var(--line);border-radius:10px;padding:12px;transition:background .3s,color .3s}
@media (max-width:600px){.gd td input{width:40px}}`;
    document.head.appendChild(st);
  }
  const h = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.innerHTML = x; return e; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const DEMOS = {
    login(el) {   // PassphraseでEnter
      el.innerHTML = '<p class="gd-h">The sample passphrase is “demo”. If it matches, the content opens (the real site stores a key made from the passphrase in a cookie and checks it on every page).</p><div class="row"><input type="password" placeholder="Passphrase" aria-label="sample passphrase"><button class="p">Enter</button><span class="m"></span></div><div class="c" hidden style="margin-top:10px"></div>';
      const i = el.querySelector('input'), m = el.querySelector('.m'), c = el.querySelector('.c');
      const go = () => { if (i.value.trim() === 'demo') { m.innerHTML = '<span class="ok">Unlocked</span>'; c.hidden = false; c.innerHTML = '<div class="mini" style="background:var(--bg2)"><b>This week’s targets (sample)</b><div class="row" style="margin-top:6px">Steps <span class="num">52,300</span> / 56,000</div></div>'; } else { m.innerHTML = '<span class="ng">Wrong passphrase</span>'; c.hidden = true; } };
      el.querySelector('button').onclick = go; i.onkeydown = e => { if (e.key === 'Enter') go(); };
    },
    jst(el) {   // アメリカの時刻をJapan timeに
      el.innerHTML = '<p class="gd-h">Enter a US Eastern tip-off time and it converts to Japan time (the real one pulls the NBA schedule every week and converts all of it). Daylight saving included.</p><div class="row"><input type="date" value="2026-11-05"><input type="time" value="19:30"><span> (New York)</span></div><p style="margin:10px 0 0">Japan time <b class="num o" style="font-size:22px"></b></p>';
      const [d, t] = el.querySelectorAll('input'), o = el.querySelector('.o');
      const go = () => { try { const guess = new Date(d.value + 'T' + t.value + ':00Z'); const off = (() => { const s = guess.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'shortOffset' }); const m = s.match(/GMT([+-]\d+)/); return m ? +m[1] : -5; })(); const u = new Date(Date.parse(d.value + 'T' + t.value + ':00Z') - off * 3600e3); o.textContent = u.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { o.textContent = '—'; } };
      d.oninput = t.oninput = go; go();
    },
    game(el) {   // ゲームの画面の形で
      let v = 70;
      el.innerHTML = '<p class="gd-h">A sample showing stamina as a game gauge. Press to lower or raise it (sample numbers).</p><div class="mini" style="background:#16213e;color:#fff;border-color:#16213e"><div class="row" style="justify-content:space-between"><b style="letter-spacing:.1em">STAMINA</b><b class="num v" style="font-size:22px"></b></div><div class="bar" style="margin-top:6px;background:#0d1426;border-color:#2a3a66"><i></i></div></div><div class="row" style="margin-top:10px"><button data-d="-10">Gym −10</button><button data-d="-4">Commute −4</button><button data-d="3">Massage chair +3</button><button data-d="0">Reset</button></div>';
      const draw = () => { el.querySelector('.v').textContent = v; const i = el.querySelector('.bar i'); i.style.width = v + '%'; i.style.background = v > 50 ? '#3fb37f' : v > 25 ? '#e0a526' : '#e0344f'; };
      el.querySelectorAll('button').forEach(b => b.onclick = () => { const d = +b.dataset.d; v = d === 0 ? 70 : Math.max(0, Math.min(100, v + d)); draw(); }); draw();
    },
    thumb(el) {   // プレビューをCapture
      el.innerHTML = '<p class="gd-h">“Capture” the page on the left and a thumbnail appears on the right (the real one captures every page daily with a headless browser). Try editing the text on the left first.</p><div class="row" style="align-items:flex-start"><div class="mini src" contenteditable="true" style="width:220px;background:var(--bg2)"><b>Vocabulary</b><p style="margin:4px 0">Today 345 words</p><div style="height:8px;background:var(--acc);width:70%;border-radius:4px"></div></div><div><button class="p">Capture</button></div><div class="shot" style="width:110px;height:80px;overflow:hidden;border:1px solid var(--line);border-radius:6px;background:var(--bg)"></div></div>';
      el.querySelector('button').onclick = () => { const s = el.querySelector('.shot'); s.innerHTML = ''; const c = el.querySelector('.src').cloneNode(true); c.removeAttribute('contenteditable'); c.style.transform = 'scale(.5)'; c.style.transformOrigin = '0 0'; s.appendChild(c); s.animate([{ opacity: 0 }, { opacity: 1 }], 300); };
    },
    box(el) {   // クォーターごとの表
      el.innerHTML = '<p class="gd-h">Enter points per quarter and the total and margin appear instantly (sample numbers).</p><table><tr><th></th><th>1Q</th><th>2Q</th><th>3Q</th><th>4Q</th><th>Total</th></tr><tr><th>Me</th>' + [24, 21, 26, 22].map(n => '<td><input type="number" value="' + n + '"></td>').join('') + '<td class="num t0"></td></tr><tr><th>Opp</th>' + [20, 25, 19, 23].map(n => '<td><input type="number" value="' + n + '"></td>').join('') + '<td class="num t1"></td></tr></table><p class="r" style="margin:8px 0 0"></p>';
      const go = () => { const rs = [...el.querySelectorAll('tr')].slice(1).map(r => [...r.querySelectorAll('input')].reduce((m, i) => m + (+i.value || 0), 0)); el.querySelector('.t0').textContent = rs[0]; el.querySelector('.t1').textContent = rs[1]; const d = rs[0] - rs[1]; el.querySelector('.r').innerHTML = d > 0 ? '<span class="ok">' + d + '-point win</span>' : d < 0 ? '<span class="ng">' + (-d) + '-point loss</span>' : 'Tied'; };
      el.querySelectorAll('input').forEach(i => i.oninput = go); go();
    },
    nbacolor(el, o) {   // 色の組み合わせを切り替える
      const P = o.palettes || [];
      el.innerHTML = '<p class="gd-h">Compare the same card with different color sets. One accent color.</p><div class="row sel"></div><div class="mini card" style="margin-top:10px"><b style="font-size:16px">Today’s game</b><div class="row" style="margin-top:6px"><span class="num" style="font-size:26px">112</span><span>−</span><span class="num" style="font-size:26px">104</span><span class="tag" style="border-radius:999px;padding:1px 10px;color:#fff;font-size:12px">Win</span></div><div class="ln" style="height:3px;margin-top:8px;width:50%"></div></div>';
      const sel = el.querySelector('.sel');
      const use = p => { const c = el.querySelector('.card'); c.style.background = p.light.bg; c.style.color = p.light.ink; c.style.borderColor = p.light.line; el.querySelector('.tag').style.background = p.light.acc; el.querySelector('.ln').style.background = p.light.acc2; sel.querySelectorAll('button').forEach(b => b.classList.toggle('p', b.dataset.id === p.id)); };
      P.forEach(p => { const b = h('button', '', esc(p.name)); b.dataset.id = p.id; b.onclick = () => use(p); sel.appendChild(b); });
      if (P.length) use(P[P.length - 1]);
    },
    calm(el) {   // 子どもっぽい色を使わない
      el.innerHTML = '<p class="gd-h">Compare the same content in primary colors vs. a calm base with one accent.</p><div class="row"><button class="p" data-k="0">Calm colors</button><button data-k="1">Primary colors</button></div><div class="mini m" style="margin-top:10px"><b>This week’s practice</b><div class="row" style="margin-top:8px"><span class="t">Shots 120</span><span class="t">Dribbling 15 min</span><span class="t">Run 3 km</span></div></div>';
      const C = [['#ffffff', '#121316', ['#1d428a', '#1d428a', '#c8102e']], ['#fff200', '#ff00aa', ['#00c853', '#2962ff', '#ff6d00']]];
      const use = k => { const [bg, ink, ts] = C[k], m = el.querySelector('.m'); m.style.background = bg; m.style.color = ink; m.querySelectorAll('.t').forEach((t, i) => { t.style.cssText = 'padding:3px 10px;border-radius:999px;color:#fff;background:' + ts[i]; }); el.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('p', +b.dataset.k === k)); };
      el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => use(+b.dataset.k)); use(0);
    },
    drag(el) {   // ドラッグで組み立てる
      el.innerHTML = '<p class="gd-h">Drag cards onto the time column. Placed cards can be moved up and down (1 step = 30 min, sample).</p><div class="row" style="align-items:flex-start;gap:12px"><div class="slot" style="flex:1;min-width:180px"></div><div class="src" style="display:flex;flex-direction:column;gap:6px"></div></div>';
      const slot = el.querySelector('.slot'), src = el.querySelector('.src');
      [['Gym', '#1d428a'], ['English', '#c8102e'], ['Break', '#4f5562']].forEach(([n, c]) => { const k = h('span', 'chip', n); k.style.background = c; src.appendChild(k); hook(k, true); });
      function hook(k, copy) {
        k.addEventListener('pointerdown', e => { e.preventDefault(); let t = k; if (copy) { t = k.cloneNode(true); t.style.position = 'absolute'; t.style.left = '8px'; t.style.width = 'calc(100% - 16px)'; t.style.height = '58px'; slot.appendChild(t); hook(t, false); }
          const r = slot.getBoundingClientRect(); const mv = ev => { let y = ev.clientY - r.top - 29; y = Math.max(0, Math.min(r.height - 60, Math.round(y / 30) * 30)); t.style.top = y + 'px'; }; mv(e);
          const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); }; addEventListener('pointermove', mv); addEventListener('pointerup', up); });
      }
    },
    fit(el) {   // 1画面に収める
      el.innerHTML = '<p class="gd-h">The frame height is fixed. As rows are added, everything shrinks a little so nothing overflows (down to 0.72×).</p><div class="row"><button class="p" data-a="1">Add a row</button><button data-a="-1">Remove a row</button><span class="z num"></span></div><div class="frame" style="height:160px;border:1px solid var(--line);border-radius:8px;overflow:hidden;margin-top:8px;background:var(--bg2)"><div class="in" style="transform-origin:0 0;padding:8px"></div></div>';
      let n = 4; const fr = el.querySelector('.frame'), inn = el.querySelector('.in');
      const go = () => { inn.style.transform = ''; inn.innerHTML = Array.from({ length: n }, (_, i) => '<div style="padding:5px 8px;margin-bottom:4px;background:var(--bg);border-radius:6px">' + (i + 1) + '</div>').join(''); const z = Math.max(0.72, Math.min(1, fr.clientHeight / inn.scrollHeight)); inn.style.transform = 'scale(' + z + ')'; inn.style.width = (100 / z) + '%'; el.querySelector('.z').textContent = Math.round(z * 100) + '%' + (fr.clientHeight / inn.scrollHeight < 0.72 ? '(from here only the inside scrolls)' : ''); fr.style.overflowY = fr.clientHeight / inn.scrollHeight < 0.72 ? 'auto' : 'hidden'; };
      el.querySelectorAll('button').forEach(b => b.onclick = () => { n = Math.max(1, Math.min(20, n + +b.dataset.a)); go(); }); go();
    },
    bars3d(el) {   // 立体グラフ
      el.innerHTML = '<p class="gd-h">Change the numbers to change the bar heights. Drag to rotate (sample numbers).</p><div class="row ins"></div><svg style="width:100%;max-width:520px;height:auto;display:block;margin:6px auto 0"></svg>';
      const v = [[40, 25], [55, 30], [35, 45]], rows = ['Mon', 'Tue', 'Wed'], ins = el.querySelector('.ins'), sv = el.querySelector('svg');
      rows.forEach((r, j) => [0, 1].forEach(i => { const x = h('input'); x.type = 'number'; x.value = v[j][i]; x.style.width = '62px'; x.title = r + (i ? ' English' : ' Exercise'); x.oninput = () => { v[j][i] = Math.max(0, +x.value || 0); draw(); }; ins.appendChild(h('span', '', r + (i ? 'En' : 'Ex'))); ins.appendChild(x); }));
      const draw = () => { if (window.bars3d) window.bars3d(sv, { cols: ['Exercise', 'English'], rows, v, colors: [css('--acc2') || '#1d428a', css('--acc') || '#c8102e'], max: 60, unit: ' min' }); };
      draw();
    },
    photo(el) {   // 写真で入力
      el.innerHTML = '<p class="gd-h">“Read” the sample photo and each field is filled in. Review, then “Add” puts one row in the table (the real one has AI read your photo; this only shows the motion).</p><div class="row" style="align-items:flex-start"><svg viewBox="0 0 120 150" style="width:110px;border:1px solid var(--line);border-radius:8px;background:#fff"><rect x="10" y="12" width="100" height="16" rx="3" fill="#2a5bb8"/><text x="60" y="24" text-anchor="middle" font-size="9" fill="#fff">Vocab app</text><text x="60" y="62" text-anchor="middle" font-size="10" fill="#555">Today</text><text x="60" y="88" text-anchor="middle" font-size="24" font-weight="700" fill="#111">345</text><text x="60" y="108" text-anchor="middle" font-size="9" fill="#555">10/28 (Tue)</text></svg><div style="flex:1;min-width:180px"><div class="row"><button class="p rd">Read</button><span class="st"></span></div><div class="row" style="margin-top:8px">Date <input class="d" style="width:110px"> Words <input class="n" style="width:70px"></div><div class="row" style="margin-top:8px"><button class="in">Add</button></div></div></div><table style="margin-top:10px"><tr><th>Date</th><th>Words</th></tr><tbody class="tb"></tbody></table>';
      const st = el.querySelector('.st'), d = el.querySelector('.d'), n = el.querySelector('.n');
      el.querySelector('.rd').onclick = () => { st.textContent = 'Reading…'; d.value = n.value = ''; setTimeout(() => { d.value = '10/28'; }, 500); setTimeout(() => { n.value = '345'; st.innerHTML = '<span class="ok">Read</span>'; }, 900); };
      el.querySelector('.in').onclick = () => { if (!d.value || !n.value) { st.innerHTML = '<span class="ng">Read first</span>'; return; } el.querySelector('.tb').insertAdjacentHTML('afterbegin', '<tr><td>' + esc(d.value) + '</td><td class="num">' + esc(n.value) + '</td></tr>'); st.innerHTML = '<span class="ok">Added 1 row</span>'; };
    },
    swatch(el) {   // 本物に近い色見本
      const S = [['White', '#f7f7f5'], ['Off-white', '#eee9dd'], ['Beige', '#d8c3a5'], ['Camel', '#b5835a'], ['Brown', '#5c4033'], ['Khaki', '#7d7a55'], ['Olive', '#5b5e35'], ['Navy', '#1f2a44'], ['Denim', '#3b5b84'], ['Gray', '#8d8f92'], ['Charcoal', '#3a3b3d'], ['Black', '#141414'], ['Bordeaux', '#6d1f2f'], ['Dusty pink', '#c9a2a0']];
      el.innerHTML = '<p class="gd-h">Common clothing colors as realistic swatches. Tap to choose.</p><div class="row ws"></div><p style="margin:10px 0 0">Chosen: <b class="o">—</b></p>';
      const ws = el.querySelector('.ws');
      S.forEach(([n, c]) => { const b = h('button', 'sw'); b.style.background = c; b.title = n; b.setAttribute('aria-label', n); b.onclick = () => { ws.querySelectorAll('.sw').forEach(x => x.classList.remove('on')); b.classList.add('on'); el.querySelector('.o').textContent = n + '（' + c + '）'; }; ws.appendChild(b); });
    },
    patrol(el) {   // 見回り
      el.innerHTML = '<p class="gd-h">A deliberately broken sample card. “Check” outlines overflowing text in red. “Fix” tidies it up.</p><div class="row"><button class="p ck">Check</button><button class="fx">Fix</button><button class="rs">Break</button><span class="r"></span></div><div class="row cards" style="margin-top:10px;align-items:flex-start"></div>';
      const bad = () => { el.querySelector('.cards').innerHTML = ['<b>Vocabulary</b><div class="num" style="font-size:30px;white-space:nowrap">12,345,678 words</div>', '<b>Practice</b><div>3 times this week</div>'].map(x => '<div class="mini c" style="width:130px;height:70px;background:var(--bg2)">' + x + '</div>').join(''); el.querySelector('.r').textContent = ''; };
      el.querySelector('.ck').onclick = () => { let n = 0; el.querySelectorAll('.c').forEach(c => { const C = c.getBoundingClientRect(); c.querySelectorAll('*').forEach(k => { const K = k.getBoundingClientRect(); const out = K.right > C.right + 2 || K.bottom > C.bottom + 2; k.style.outline = out ? '2px solid var(--acc)' : ''; if (out) n++; }); }); el.querySelector('.r').innerHTML = n ? '<span class="ng">' + n + ' spots overflow</span>' : '<span class="ok">No issues</span>'; };
      el.querySelector('.fx').onclick = () => { el.querySelectorAll('.c').forEach(c => { c.style.height = 'auto'; c.querySelectorAll('.num').forEach(x => { let f = 30; x.style.fontSize = f + 'px'; while (x.scrollWidth > c.clientWidth - 24 && f > 10) { f--; x.style.fontSize = f + 'px'; } }); c.querySelectorAll('*').forEach(k => k.style.outline = ''); }); el.querySelector('.r').innerHTML = '<span class="ok">Fixed (smaller text on one line, heights aligned)</span>'; const hs = [...el.querySelectorAll('.c')].map(c => c.offsetHeight), mx = Math.max(...hs); el.querySelectorAll('.c').forEach(c => c.style.height = mx + 'px'); };
      el.querySelector('.rs').onclick = bad; bad();
    },
    pv(el) {   // 開いた回数
      const K = 'gd.pv', P = ['Today’s schedule', 'Vocabulary', 'Practice log', 'Money'];
      let c = {}; try { c = JSON.parse(localStorage.getItem(K) || '{}'); } catch (e) {}
      el.innerHTML = '<p class="gd-h">Tap a sample page to add a view; they re-sort by most opened (saved only on this device).</p><div class="row bt"></div><ol class="rk" style="margin:10px 0 0;padding-left:20px"></ol><button class="rs" style="margin-top:6px">Reset counts</button>';
      const draw = () => { el.querySelector('.rk').innerHTML = P.slice().sort((a, b) => (c[b] || 0) - (c[a] || 0)).map(p => '<li>' + esc(p) + ' <b class="num">' + (c[p] || 0) + ' views</b></li>').join(''); try { localStorage.setItem(K, JSON.stringify(c)); } catch (e) {} };
      P.forEach(p => { const b = h('button', '', esc(p)); b.onclick = () => { c[p] = (c[p] || 0) + 1; draw(); }; el.querySelector('.bt').appendChild(b); });
      el.querySelector('.rs').onclick = () => { c = {}; draw(); }; draw();
    },
    autohp(el, o) {   // 記録の新しいものでホームページが変わる
      const P = (o.palettes || []).slice().sort((a, b) => a.date.localeCompare(b.date));
      el.innerHTML = '<p class="gd-h">When a color set is added to the tech log, the next morning’s homepage uses it. Pick a date below to see the homepage as of that day.</p><div class="row sel"></div><div class="mini pg" style="margin-top:10px"><div style="font-size:11px;opacity:.7">riseisasahara.com</div><div style="font-weight:900;font-size:24px;margin-top:4px">Risei <span class="e" style="font-weight:400">Sasahara</span></div><div class="row" style="margin-top:6px"><span class="a" style="border:1px solid;border-radius:999px;padding:0 9px;font-size:11px">NEWS</span><span class="b" style="border:1px solid;border-radius:999px;padding:0 9px;font-size:11px">Technology</span></div></div>';
      const use = p => { const L = p.light, g = el.querySelector('.pg'); g.style.background = L.bg; g.style.color = L.ink; g.style.borderColor = L.line; g.style.borderLeft = '4px solid ' + L.acc; el.querySelector('.e').style.color = L.ink2; el.querySelector('.a').style.color = L.acc; el.querySelector('.b').style.color = L.acc2; el.querySelectorAll('.sel button').forEach(b => b.classList.toggle('p', b.dataset.id === p.id)); };
      P.forEach(p => { const b = h('button', '', (+p.date.slice(5, 7)) + '/' + (+p.date.slice(8)) + ' ' + esc(p.name)); b.dataset.id = p.id; b.onclick = () => use(p); el.querySelector('.sel').appendChild(b); });
      if (P.length) use(P[P.length - 1]);
    }
  };
  window.gijutsuDemo = function (id, box, o) {
    const f = DEMOS[id]; if (!f) return false;
    const el = h('div', 'gd'); box.appendChild(el);
    try { f(el, o || {}); } catch (e) { el.textContent = 'This sample could not open'; }
    return true;
  };
  window.gijutsuHasDemo = id => !!DEMOS[id];
})();
