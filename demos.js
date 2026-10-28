/* 技術の「試す」見本。2026-10-28 本人「作ってきた技術は１個ずつ実際に試せる例を表示しよう」。
   ★正本はここ（~/vitruvian/products/gijutsu/demos.js）。/gijutsu と riseisasahara.com の両方が使う。
   gijutsuDemo(id, 入れる箱, {palettes}) で、その技術の見本を箱の中に作る。中身はすべて見本の数字（本物の記録・人の名前・お金は出さない）。
   色は使う側のページの --bg --bg2 --ink --ink2 --line --acc --acc2 を使う。新しい技術を足したら DEMOS に1つ足す */
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
    login(el) {   // 合言葉で入る
      el.innerHTML = '<p class="gd-h">見本の合言葉は「demo」。合っていると中身が開く（本物のサイトは、合言葉から作った鍵をクッキーに置いて、ページごとに確かめている）。</p><div class="row"><input type="password" placeholder="合言葉" aria-label="見本の合言葉"><button class="p">入る</button><span class="m"></span></div><div class="c" hidden style="margin-top:10px"></div>';
      const i = el.querySelector('input'), m = el.querySelector('.m'), c = el.querySelector('.c');
      const go = () => { if (i.value.trim() === 'demo') { m.innerHTML = '<span class="ok">入れた</span>'; c.hidden = false; c.innerHTML = '<div class="mini" style="background:var(--bg2)"><b>今週の目安（見本）</b><div class="row" style="margin-top:6px">歩数 <span class="num">52,300</span> / 56,000</div></div>'; } else { m.innerHTML = '<span class="ng">合言葉が違う</span>'; c.hidden = true; } };
      el.querySelector('button').onclick = go; i.onkeydown = e => { if (e.key === 'Enter') go(); };
    },
    jst(el) {   // アメリカの時刻を日本時間に
      el.innerHTML = '<p class="gd-h">アメリカ東部の試合開始を入れると、日本時間に直す（本物は NBA の日程を毎週自動で取り込んで、全部この形にしている）。夏時間も入る。</p><div class="row"><input type="date" value="2026-11-05"><input type="time" value="19:30"><span>（ニューヨーク）</span></div><p style="margin:10px 0 0">日本時間 <b class="num o" style="font-size:22px"></b></p>';
      const [d, t] = el.querySelectorAll('input'), o = el.querySelector('.o');
      const go = () => { try { const guess = new Date(d.value + 'T' + t.value + ':00Z'); const off = (() => { const s = guess.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'shortOffset' }); const m = s.match(/GMT([+-]\d+)/); return m ? +m[1] : -5; })(); const u = new Date(Date.parse(d.value + 'T' + t.value + ':00Z') - off * 3600e3); o.textContent = u.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { o.textContent = '—'; } };
      d.oninput = t.oninput = go; go();
    },
    game(el) {   // ゲームの画面の形で
      let v = 70;
      el.innerHTML = '<p class="gd-h">体力をゲームのゲージで見せる見本。押すと減ったり増えたりする（数字は見本）。</p><div class="mini" style="background:#16213e;color:#fff;border-color:#16213e"><div class="row" style="justify-content:space-between"><b style="letter-spacing:.1em">たいりょく</b><b class="num v" style="font-size:22px"></b></div><div class="bar" style="margin-top:6px;background:#0d1426;border-color:#2a3a66"><i></i></div></div><div class="row" style="margin-top:10px"><button data-d="-10">ジム −10</button><button data-d="-4">通勤 −4</button><button data-d="3">マッサージチェア +3</button><button data-d="0">元に戻す</button></div>';
      const draw = () => { el.querySelector('.v').textContent = v; const i = el.querySelector('.bar i'); i.style.width = v + '%'; i.style.background = v > 50 ? '#3fb37f' : v > 25 ? '#e0a526' : '#e0344f'; };
      el.querySelectorAll('button').forEach(b => b.onclick = () => { const d = +b.dataset.d; v = d === 0 ? 70 : Math.max(0, Math.min(100, v + d)); draw(); }); draw();
    },
    thumb(el) {   // プレビューを撮る
      el.innerHTML = '<p class="gd-h">左のページを「撮る」と、右に縮小画像ができる（本物は見えないブラウザで全ページを毎日撮っている）。左の文字を書き換えてから撮ってみて。</p><div class="row" style="align-items:flex-start"><div class="mini src" contenteditable="true" style="width:220px;background:var(--bg2)"><b>英単語</b><p style="margin:4px 0">今日 345語</p><div style="height:8px;background:var(--acc);width:70%;border-radius:4px"></div></div><div><button class="p">撮る</button></div><div class="shot" style="width:110px;height:80px;overflow:hidden;border:1px solid var(--line);border-radius:6px;background:var(--bg)"></div></div>';
      el.querySelector('button').onclick = () => { const s = el.querySelector('.shot'); s.innerHTML = ''; const c = el.querySelector('.src').cloneNode(true); c.removeAttribute('contenteditable'); c.style.transform = 'scale(.5)'; c.style.transformOrigin = '0 0'; s.appendChild(c); s.animate([{ opacity: 0 }, { opacity: 1 }], 300); };
    },
    box(el) {   // クォーターごとの表
      el.innerHTML = '<p class="gd-h">クォーターごとの点を入れると、合計と差がすぐ出る（数字は見本）。</p><table><tr><th></th><th>1Q</th><th>2Q</th><th>3Q</th><th>4Q</th><th>合計</th></tr><tr><th>自分</th>' + [24, 21, 26, 22].map(n => '<td><input type="number" value="' + n + '"></td>').join('') + '<td class="num t0"></td></tr><tr><th>相手</th>' + [20, 25, 19, 23].map(n => '<td><input type="number" value="' + n + '"></td>').join('') + '<td class="num t1"></td></tr></table><p class="r" style="margin:8px 0 0"></p>';
      const go = () => { const rs = [...el.querySelectorAll('tr')].slice(1).map(r => [...r.querySelectorAll('input')].reduce((m, i) => m + (+i.value || 0), 0)); el.querySelector('.t0').textContent = rs[0]; el.querySelector('.t1').textContent = rs[1]; const d = rs[0] - rs[1]; el.querySelector('.r').innerHTML = d > 0 ? '<span class="ok">' + d + '点差で勝ち</span>' : d < 0 ? '<span class="ng">' + (-d) + '点差で負け</span>' : '同点'; };
      el.querySelectorAll('input').forEach(i => i.oninput = go); go();
    },
    nbacolor(el, o) {   // 色の組み合わせを切り替える
      const P = o.palettes || [];
      el.innerHTML = '<p class="gd-h">同じカードを、色の組み合わせだけ変えて見比べる。差し色は1色にそろえている。</p><div class="row sel"></div><div class="mini card" style="margin-top:10px"><b style="font-size:16px">今日の試合</b><div class="row" style="margin-top:6px"><span class="num" style="font-size:26px">112</span><span>−</span><span class="num" style="font-size:26px">104</span><span class="tag" style="border-radius:999px;padding:1px 10px;color:#fff;font-size:12px">勝ち</span></div><div class="ln" style="height:3px;margin-top:8px;width:50%"></div></div>';
      const sel = el.querySelector('.sel');
      const use = p => { const c = el.querySelector('.card'); c.style.background = p.light.bg; c.style.color = p.light.ink; c.style.borderColor = p.light.line; el.querySelector('.tag').style.background = p.light.acc; el.querySelector('.ln').style.background = p.light.acc2; sel.querySelectorAll('button').forEach(b => b.classList.toggle('p', b.dataset.id === p.id)); };
      P.forEach(p => { const b = h('button', '', esc(p.name)); b.dataset.id = p.id; b.onclick = () => use(p); sel.appendChild(b); });
      if (P.length) use(P[P.length - 1]);
    },
    calm(el) {   // 子どもっぽい色を使わない
      el.innerHTML = '<p class="gd-h">同じ中身を、原色を並べた色と、落ち着いた土台＋差し色1色で見比べる。</p><div class="row"><button class="p" data-k="0">落ち着いた色</button><button data-k="1">原色を並べた色</button></div><div class="mini m" style="margin-top:10px"><b>今週の練習</b><div class="row" style="margin-top:8px"><span class="t">シュート 120本</span><span class="t">ドリブル 15分</span><span class="t">走る 3km</span></div></div>';
      const C = [['#ffffff', '#121316', ['#1d428a', '#1d428a', '#c8102e']], ['#fff200', '#ff00aa', ['#00c853', '#2962ff', '#ff6d00']]];
      const use = k => { const [bg, ink, ts] = C[k], m = el.querySelector('.m'); m.style.background = bg; m.style.color = ink; m.querySelectorAll('.t').forEach((t, i) => { t.style.cssText = 'padding:3px 10px;border-radius:999px;color:#fff;background:' + ts[i]; }); el.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('p', +b.dataset.k === k)); };
      el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => use(+b.dataset.k)); use(0);
    },
    drag(el) {   // ドラッグで組み立てる
      el.innerHTML = '<p class="gd-h">札をドラッグして、時間の欄に置く。置いた札も上下に動かせる（1目盛り＝30分・見本）。</p><div class="row" style="align-items:flex-start;gap:12px"><div class="slot" style="flex:1;min-width:180px"></div><div class="src" style="display:flex;flex-direction:column;gap:6px"></div></div>';
      const slot = el.querySelector('.slot'), src = el.querySelector('.src');
      [['ジム', '#1d428a'], ['英語', '#c8102e'], ['休憩', '#4f5562']].forEach(([n, c]) => { const k = h('span', 'chip', n); k.style.background = c; src.appendChild(k); hook(k, true); });
      function hook(k, copy) {
        k.addEventListener('pointerdown', e => { e.preventDefault(); let t = k; if (copy) { t = k.cloneNode(true); t.style.position = 'absolute'; t.style.left = '8px'; t.style.width = 'calc(100% - 16px)'; t.style.height = '58px'; slot.appendChild(t); hook(t, false); }
          const r = slot.getBoundingClientRect(); const mv = ev => { let y = ev.clientY - r.top - 29; y = Math.max(0, Math.min(r.height - 60, Math.round(y / 30) * 30)); t.style.top = y + 'px'; }; mv(e);
          const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); }; addEventListener('pointermove', mv); addEventListener('pointerup', up); });
      }
    },
    fit(el) {   // 1画面に収める
      el.innerHTML = '<p class="gd-h">枠の高さは決まっている。行を足していくと、はみ出さないように全体を少しずつ縮める（0.72倍まで）。</p><div class="row"><button class="p" data-a="1">行を足す</button><button data-a="-1">行を減らす</button><span class="z num"></span></div><div class="frame" style="height:160px;border:1px solid var(--line);border-radius:8px;overflow:hidden;margin-top:8px;background:var(--bg2)"><div class="in" style="transform-origin:0 0;padding:8px"></div></div>';
      let n = 4; const fr = el.querySelector('.frame'), inn = el.querySelector('.in');
      const go = () => { inn.style.transform = ''; inn.innerHTML = Array.from({ length: n }, (_, i) => '<div style="padding:5px 8px;margin-bottom:4px;background:var(--bg);border-radius:6px">' + (i + 1) + '行目</div>').join(''); const z = Math.max(0.72, Math.min(1, fr.clientHeight / inn.scrollHeight)); inn.style.transform = 'scale(' + z + ')'; inn.style.width = (100 / z) + '%'; el.querySelector('.z').textContent = Math.round(z * 100) + '%' + (fr.clientHeight / inn.scrollHeight < 0.72 ? '（ここからは中だけスクロール）' : ''); fr.style.overflowY = fr.clientHeight / inn.scrollHeight < 0.72 ? 'auto' : 'hidden'; };
      el.querySelectorAll('button').forEach(b => b.onclick = () => { n = Math.max(1, Math.min(20, n + +b.dataset.a)); go(); }); go();
    },
    bars3d(el) {   // 立体グラフ
      el.innerHTML = '<p class="gd-h">数字を変えると柱の高さが変わる。ドラッグで回す（見本の数字）。</p><div class="row ins"></div><svg style="width:100%;max-width:520px;height:auto;display:block;margin:6px auto 0"></svg>';
      const v = [[40, 25], [55, 30], [35, 45]], rows = ['月', '火', '水'], ins = el.querySelector('.ins'), sv = el.querySelector('svg');
      rows.forEach((r, j) => [0, 1].forEach(i => { const x = h('input'); x.type = 'number'; x.value = v[j][i]; x.style.width = '62px'; x.title = r + (i ? ' 英語' : ' 運動'); x.oninput = () => { v[j][i] = Math.max(0, +x.value || 0); draw(); }; ins.appendChild(h('span', '', r + (i ? '英' : '運'))); ins.appendChild(x); }));
      const draw = () => { if (window.bars3d) window.bars3d(sv, { cols: ['運動', '英語'], rows, v, colors: [css('--acc2') || '#1d428a', css('--acc') || '#c8102e'], max: 60, unit: '分' }); };
      draw();
    },
    photo(el) {   // 写真で入力
      el.innerHTML = '<p class="gd-h">見本の写真を「読む」と、項目ごとの欄に入る。直してから「入れる」で表に1行（本物は撮った写真を AI が読む。ここは見本の動きだけ）。</p><div class="row" style="align-items:flex-start"><svg viewBox="0 0 120 150" style="width:110px;border:1px solid var(--line);border-radius:8px;background:#fff"><rect x="10" y="12" width="100" height="16" rx="3" fill="#2a5bb8"/><text x="60" y="24" text-anchor="middle" font-size="9" fill="#fff">英単語アプリ</text><text x="60" y="62" text-anchor="middle" font-size="10" fill="#555">今日</text><text x="60" y="88" text-anchor="middle" font-size="24" font-weight="700" fill="#111">345</text><text x="60" y="108" text-anchor="middle" font-size="9" fill="#555">10/28（火）</text></svg><div style="flex:1;min-width:180px"><div class="row"><button class="p rd">読む</button><span class="st"></span></div><div class="row" style="margin-top:8px">日付 <input class="d" style="width:110px"> 語数 <input class="n" style="width:70px"></div><div class="row" style="margin-top:8px"><button class="in">入れる</button></div></div></div><table style="margin-top:10px"><tr><th>日付</th><th>語数</th></tr><tbody class="tb"></tbody></table>';
      const st = el.querySelector('.st'), d = el.querySelector('.d'), n = el.querySelector('.n');
      el.querySelector('.rd').onclick = () => { st.textContent = '読んでいる…'; d.value = n.value = ''; setTimeout(() => { d.value = '10/28'; }, 500); setTimeout(() => { n.value = '345'; st.innerHTML = '<span class="ok">読めた</span>'; }, 900); };
      el.querySelector('.in').onclick = () => { if (!d.value || !n.value) { st.innerHTML = '<span class="ng">先に読む</span>'; return; } el.querySelector('.tb').insertAdjacentHTML('afterbegin', '<tr><td>' + esc(d.value) + '</td><td class="num">' + esc(n.value) + '</td></tr>'); st.innerHTML = '<span class="ok">1行入れた</span>'; };
    },
    swatch(el) {   // 本物に近い色見本
      const S = [['白', '#f7f7f5'], ['オフホワイト', '#eee9dd'], ['ベージュ', '#d8c3a5'], ['キャメル', '#b5835a'], ['ブラウン', '#5c4033'], ['カーキ', '#7d7a55'], ['オリーブ', '#5b5e35'], ['ネイビー', '#1f2a44'], ['デニム', '#3b5b84'], ['グレー', '#8d8f92'], ['チャコール', '#3a3b3d'], ['黒', '#141414'], ['ボルドー', '#6d1f2f'], ['くすみピンク', '#c9a2a0']];
      el.innerHTML = '<p class="gd-h">よくある服の色を、本物に近い色見本で。押すと選べる。</p><div class="row ws"></div><p style="margin:10px 0 0">選んだ色：<b class="o">—</b></p>';
      const ws = el.querySelector('.ws');
      S.forEach(([n, c]) => { const b = h('button', 'sw'); b.style.background = c; b.title = n; b.setAttribute('aria-label', n); b.onclick = () => { ws.querySelectorAll('.sw').forEach(x => x.classList.remove('on')); b.classList.add('on'); el.querySelector('.o').textContent = n + '（' + c + '）'; }; ws.appendChild(b); });
    },
    patrol(el) {   // 見回り
      el.innerHTML = '<p class="gd-h">わざと崩した見本のカード。「見回る」で、枠からはみ出した文字を赤で囲む。「直す」で形を整える。</p><div class="row"><button class="p ck">見回る</button><button class="fx">直す</button><button class="rs">崩す</button><span class="r"></span></div><div class="row cards" style="margin-top:10px;align-items:flex-start"></div>';
      const bad = () => { el.querySelector('.cards').innerHTML = ['<b>英単語</b><div class="num" style="font-size:30px;white-space:nowrap">12,345,678語</div>', '<b>練習</b><div>今週 3回</div>'].map(x => '<div class="mini c" style="width:130px;height:70px;background:var(--bg2)">' + x + '</div>').join(''); el.querySelector('.r').textContent = ''; };
      el.querySelector('.ck').onclick = () => { let n = 0; el.querySelectorAll('.c').forEach(c => { const C = c.getBoundingClientRect(); c.querySelectorAll('*').forEach(k => { const K = k.getBoundingClientRect(); const out = K.right > C.right + 2 || K.bottom > C.bottom + 2; k.style.outline = out ? '2px solid var(--acc)' : ''; if (out) n++; }); }); el.querySelector('.r').innerHTML = n ? '<span class="ng">' + n + 'か所 はみ出している</span>' : '<span class="ok">崩れなし</span>'; };
      el.querySelector('.fx').onclick = () => { el.querySelectorAll('.c').forEach(c => { c.style.height = 'auto'; c.querySelectorAll('.num').forEach(x => { let f = 30; x.style.fontSize = f + 'px'; while (x.scrollWidth > c.clientWidth - 24 && f > 10) { f--; x.style.fontSize = f + 'px'; } }); c.querySelectorAll('*').forEach(k => k.style.outline = ''); }); el.querySelector('.r').innerHTML = '<span class="ok">直した（字を小さくして1行に・高さをそろえた）</span>'; const hs = [...el.querySelectorAll('.c')].map(c => c.offsetHeight), mx = Math.max(...hs); el.querySelectorAll('.c').forEach(c => c.style.height = mx + 'px'); };
      el.querySelector('.rs').onclick = bad; bad();
    },
    pv(el) {   // 開いた回数
      const K = 'gd.pv', P = ['今日の予定', '英単語', '練習の記録', 'お金'];
      let c = {}; try { c = JSON.parse(localStorage.getItem(K) || '{}'); } catch (e) {}
      el.innerHTML = '<p class="gd-h">見本のページを押すと、開いた回数が増えて、よく開く順に並び替わる（この端末にだけ覚える）。</p><div class="row bt"></div><ol class="rk" style="margin:10px 0 0;padding-left:20px"></ol><button class="rs" style="margin-top:6px">数をゼロにする</button>';
      const draw = () => { el.querySelector('.rk').innerHTML = P.slice().sort((a, b) => (c[b] || 0) - (c[a] || 0)).map(p => '<li>' + esc(p) + ' <b class="num">' + (c[p] || 0) + '</b>回</li>').join(''); try { localStorage.setItem(K, JSON.stringify(c)); } catch (e) {} };
      P.forEach(p => { const b = h('button', '', esc(p)); b.onclick = () => { c[p] = (c[p] || 0) + 1; draw(); }; el.querySelector('.bt').appendChild(b); });
      el.querySelector('.rs').onclick = () => { c = {}; draw(); }; draw();
    },
    autohp(el, o) {   // 記録の新しいものでホームページが変わる
      const P = (o.palettes || []).slice().sort((a, b) => a.date.localeCompare(b.date));
      el.innerHTML = '<p class="gd-h">技術の記録に色の組み合わせが足されると、次の朝のホームページはその色になる。下の日付を選ぶと、その日の時点のホームページになる。</p><div class="row sel"></div><div class="mini pg" style="margin-top:10px"><div style="font-size:11px;opacity:.7">riseisasahara.com</div><div style="font-weight:900;font-size:24px;margin-top:4px">笹原 <span class="e" style="font-weight:400">理成</span></div><div class="row" style="margin-top:6px"><span class="a" style="border:1px solid;border-radius:999px;padding:0 9px;font-size:11px">NEWS</span><span class="b" style="border:1px solid;border-radius:999px;padding:0 9px;font-size:11px">技術</span></div></div>';
      const use = p => { const L = p.light, g = el.querySelector('.pg'); g.style.background = L.bg; g.style.color = L.ink; g.style.borderColor = L.line; g.style.borderLeft = '4px solid ' + L.acc; el.querySelector('.e').style.color = L.ink2; el.querySelector('.a').style.color = L.acc; el.querySelector('.b').style.color = L.acc2; el.querySelectorAll('.sel button').forEach(b => b.classList.toggle('p', b.dataset.id === p.id)); };
      P.forEach(p => { const b = h('button', '', (+p.date.slice(5, 7)) + '/' + (+p.date.slice(8)) + ' ' + esc(p.name)); b.dataset.id = p.id; b.onclick = () => use(p); el.querySelector('.sel').appendChild(b); });
      if (P.length) use(P[P.length - 1]);
    }
  };
  window.gijutsuDemo = function (id, box, o) {
    const f = DEMOS[id]; if (!f) return false;
    const el = h('div', 'gd'); box.appendChild(el);
    try { f(el, o || {}); } catch (e) { el.textContent = 'この見本は開けなかった'; }
    return true;
  };
  window.gijutsuHasDemo = id => !!DEMOS[id];
})();
