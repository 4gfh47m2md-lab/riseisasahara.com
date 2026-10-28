/* 立体の棒グラフ（/2kfree の立体グラフを、どのデータでも使える形にしたもの）。2026-10-28。
   ★正本はここ（~/vitruvian/products/gijutsu/bars3d.js）。/gijutsu と riseisasahara.com の両方がこれを使う。
   bars3d(svg, {cols:['L','R'], rows:['2023.4', …], v:[[365,355], …], colors:['#1d428a','#c8102e'], max:495, unit:'点', view:{th:-28, ph:34}})
   ドラッグで回す（横＝360度・縦＝見下ろす角度）・ダブルクリックで元の向き */
function bars3d(sv, o) {
  const W = 560, H = 400, nC = o.cols.length, nR = o.rows.length, sp = 2.1, bw = 0.5;
  const mx = o.max || Math.max(1, ...o.v.flat()), Hz = 6.5;
  let VW = Object.assign({ th: -58, ph: 26 }, o.view || {});
  const hex = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const shade = (c, k) => 'rgb(' + hex(c).map(x => Math.round(Math.min(255, x * k))).join(',') + ')';
  const cx = (nC - 1) * sp / 2, cy = (nR - 1) * sp / 2;
  function draw() {
    const th = VW.th * Math.PI / 180, ph = VW.ph * Math.PI / 180, ct = Math.cos(th), st = Math.sin(th);
    const span = Math.max(nC, nR) * sp, S = 380 / (span + 2);
    const R = (x, y) => { const X = x - cx, Y = y - cy; return [X * ct - Y * st, X * st + Y * ct]; };
    const P = (x, y, z = 0) => { const [u, v] = R(x, y); return [W / 2 + u * S, H * 0.62 + v * S * Math.sin(ph) - z * S * Math.cos(ph)]; };
    const pt = a => a.map(q => P(...q).map(v => v.toFixed(1)).join(',')).join(' ');
    const dep = (x, y) => R(x, y)[1];
    let g = `<polygon points="${pt([[-0.8, -0.8], [cx * 2 + 0.8, -0.8], [cx * 2 + 0.8, cy * 2 + 0.8], [-0.8, cy * 2 + 0.8]])}" fill="var(--b3-floor,#eef1f6)" stroke="var(--b3-line,#d9dee8)"/>`;
    for (let k = 1; k <= 4; k++) { const z = Hz * k / 4; g += `<polyline points="${pt([[-0.8, -0.8, z], [cx * 2 + 0.8, -0.8, z]])}" fill="none" stroke="var(--b3-line,#d9dee8)" stroke-dasharray="2 3"/>`; }
    const T = [], B = [];
    o.rows.forEach((r, j) => o.cols.forEach((c, i) => B.push({ i, j, x: i * sp, y: j * sp, n: o.v[j][i] })));
    B.sort((a, b) => dep(a.x, a.y) - dep(b.x, b.y)).forEach(b => {
      const h = b.n == null ? 0 : Math.max(0.05, b.n / mx * Hz), col = o.colors[b.i % o.colors.length], w = bw;
      const C = [[b.x - w, b.y - w], [b.x + w, b.y - w], [b.x + w, b.y + w], [b.x - w, b.y + w]];
      const F = [0, 1, 2, 3].map(q => { const A = C[q], Bq = C[(q + 1) % 4], mx2 = (A[0] + Bq[0]) / 2, my2 = (A[1] + Bq[1]) / 2; return { A, B: Bq, d: dep(mx2, my2), lit: (Math.cos(Math.atan2(my2 - b.y, mx2 - b.x) - th - 0.6) + 1) / 2 }; }).sort((p, q) => p.d - q.d);
      g += `<g><title>${o.rows[b.j]} ${o.cols[b.i]}：${b.n == null ? '—' : b.n}${o.unit || ''}</title>`;
      F.forEach(f => { g += `<polygon points="${pt([[...f.A, 0], [...f.B, 0], [...f.B, h], [...f.A, h]])}" fill="${shade(col, 0.55 + f.lit * 0.35)}"/>`; });
      g += `<polygon points="${pt(C.map(q => [...q, h]))}" fill="${col}"/></g>`;
      if (b.n != null) { const [lx, ly] = P(b.x, b.y, h); T.push(`<text x="${lx}" y="${ly - 8}" text-anchor="middle" font-family="var(--num,Oswald),sans-serif" font-size="15" font-weight="700" fill="var(--b3-ink,#121316)" stroke="var(--b3-halo,#fff)" stroke-width="4" paint-order="stroke">${b.n}</text>`); }
    });
    o.rows.forEach((r, j) => { const [lx, ly] = P(-1.4, j * sp); T.push(`<text x="${lx}" y="${ly + 4}" text-anchor="end" font-size="11" fill="var(--b3-mute,#6b707a)">${r}</text>`); });
    o.cols.forEach((c, i) => { const [lx, ly] = P(i * sp, cy * 2 + 1.5); T.push(`<text x="${lx}" y="${ly + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="${o.colors[i % o.colors.length]}">${c}</text>`); });
    sv.innerHTML = g + T.join('');
  }
  let D = null;
  sv.style.cursor = 'grab'; sv.style.touchAction = 'none'; sv.style.userSelect = 'none'; sv.setAttribute('viewBox', `0 0 ${W} ${H}`);
  sv.addEventListener('pointerdown', e => { D = [e.clientX, e.clientY]; sv.setPointerCapture(e.pointerId); sv.style.cursor = 'grabbing'; });
  sv.addEventListener('pointermove', e => { if (!D) return; VW.th = (VW.th + (e.clientX - D[0]) * 0.6) % 360; VW.ph = Math.max(8, Math.min(88, VW.ph + (e.clientY - D[1]) * 0.35)); D = [e.clientX, e.clientY]; draw(); });
  const up = () => { D = null; sv.style.cursor = 'grab'; };
  sv.addEventListener('pointerup', up); sv.addEventListener('pointercancel', up);
  sv.addEventListener('dblclick', () => { VW = Object.assign({ th: -58, ph: 26 }, o.view || {}); draw(); });
  draw();
  return { redraw: draw };
}
