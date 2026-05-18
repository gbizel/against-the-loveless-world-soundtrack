// Tumbling-blocks (isometric cubes) SVG pattern generator.
// Inspired by the book cover.

(function () {
  // Hex math: pointy-top hexagon with point-radius r.
  // Three rhombuses meeting at the center create the 3D cube illusion.

  const PALETTES = {
    book: [
      // [top, right, left]
      ['#ecc940', '#e0541f', '#c4b89e'], // yellow / orange / gray
      ['#f1e7cf', '#d4a017', '#b5ab95'], // cream / mustard / cool gray
      ['#e0541f', '#d4a017', '#8a8233'], // orange / mustard / olive
      ['#ecc940', '#c4b89e', '#8a8233'], // yellow / gray / olive
      ['#f1e7cf', '#ecc940', '#d4a017'], // cream / yellow / mustard
      ['#d4a017', '#e0541f', '#8a8233'], // mustard / orange / olive
      ['#c4b89e', '#8a8233', '#5d5a25'], // grays
      ['#e0541f', '#ecc940', '#c4b89e'], // orange / yellow / gray
    ],
    night: [
      ['#1f4f2e', '#0e2c19', '#143820'],
      ['#ecc940', '#1f4f2e', '#0e2c19'],
      ['#e0541f', '#1f4f2e', '#0e2c19'],
      ['#d4a017', '#143820', '#0e2c19'],
      ['#1f4f2e', '#143820', '#0e2c19'],
      ['#ecc940', '#e0541f', '#1f4f2e'],
    ],
    monochrome: [
      ['#f1e7cf', '#c4b89e', '#8a8233'],
      ['#ecc940', '#d4a017', '#8a8233'],
      ['#c4b89e', '#8a8233', '#5d5a25'],
      ['#f1e7cf', '#ecc940', '#d4a017'],
    ],
    ember: [
      ['#ecc940', '#e0541f', '#8a2812'],
      ['#e87a45', '#e0541f', '#8a2812'],
      ['#d4a017', '#e0541f', '#8a2812'],
      ['#f1e7cf', '#ecc940', '#e0541f'],
      ['#e0541f', '#8a2812', '#3d1408'],
    ],
  };

  // Seedable pseudo-random so layouts stay stable when regenerated.
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hex(cx, cy, r, colors) {
    const sx = (Math.sqrt(3) / 2) * r;
    // Vertices (pointy-top):
    // V0 top, V1 upper-right, V2 lower-right, V3 bottom, V4 lower-left, V5 upper-left
    const v0 = [cx, cy - r];
    const v1 = [cx + sx, cy - r / 2];
    const v2 = [cx + sx, cy + r / 2];
    const v3 = [cx, cy + r];
    const v4 = [cx - sx, cy + r / 2];
    const v5 = [cx - sx, cy - r / 2];
    const c = [cx, cy];
    const top = `${v5[0]},${v5[1]} ${v0[0]},${v0[1]} ${v1[0]},${v1[1]} ${c[0]},${c[1]}`;
    const right = `${v1[0]},${v1[1]} ${v2[0]},${v2[1]} ${v3[0]},${v3[1]} ${c[0]},${c[1]}`;
    const left = `${v3[0]},${v3[1]} ${v4[0]},${v4[1]} ${v5[0]},${v5[1]} ${c[0]},${c[1]}`;
    return (
      `<polygon points="${top}" fill="${colors[0]}" />` +
      `<polygon points="${right}" fill="${colors[1]}" />` +
      `<polygon points="${left}" fill="${colors[2]}" />`
    );
  }

  function tumblingBlocks({ width, height, r = 60, palette = 'book', seed = 7, strokeOpacity = 0.06 }) {
    const colors = PALETTES[palette] || PALETTES.book;
    const rand = mulberry32(seed);
    const dx = Math.sqrt(3) * r;
    const dy = 1.5 * r;
    const cols = Math.ceil(width / dx) + 2;
    const rows = Math.ceil(height / dy) + 2;

    let body = '';
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * dx + (row % 2 ? dx / 2 : 0);
        const cy = row * dy;
        const c = colors[Math.floor(rand() * colors.length)];
        body += hex(cx, cy, r, c);
      }
    }

    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">` +
      `<g shape-rendering="geometricPrecision" stroke="rgba(21,20,15,${strokeOpacity})" stroke-width="0.6">` +
      body +
      `</g></svg>`
    );
  }

  // Small standalone cube marker (for chapter numbers, etc.)
  function singleCube({ size = 36, palette = 'book', seed = 1 } = {}) {
    const colors = (PALETTES[palette] || PALETTES.book)[seed % (PALETTES[palette] || PALETTES.book).length];
    const r = size / 2;
    const cx = size / 2;
    const cy = size / 2;
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
      `<g shape-rendering="geometricPrecision">${hex(cx, cy, r * 0.95, colors)}</g></svg>`
    );
  }

  window.TumblingBlocks = { tumblingBlocks, singleCube, PALETTES };
})();
