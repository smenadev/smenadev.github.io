/* Articulated industrial robot arm for the Services object-scan sequence.
   Procedural illustration; no captured 3DGS dataset is implied. */
(() => {
  const positions = [];
  const normals = [];
  const materials = [];
  const parts = [];
  const indices = [];
  const vertex = (position, normal, material, part = 0) => {
    const index = positions.length / 3;
    positions.push(...position);
    normals.push(...normal);
    materials.push(material);
    parts.push(part);
    return index;
  };
  const cylinder = (cx, cz, bottom, top, lowerRadius, upperRadius,
    material, segments = 48, capBottom = true, capTop = true) => {
    const rings = [[], []];
    const slope = (lowerRadius - upperRadius) / (top - bottom);
    const normalLength = Math.hypot(1, slope);
    for (let row = 0; row < 2; row++) {
      const y = row ? top : bottom;
      const radius = row ? upperRadius : lowerRadius;
      for (let i = 0; i <= segments; i++) {
        const angle = i * Math.PI * 2 / segments;
        const c = Math.cos(angle), s = Math.sin(angle);
        rings[row].push(vertex([cx + radius * c, y, cz + radius * s],
          [c / normalLength, slope / normalLength, s / normalLength], material));
      }
    }
    for (let i = 0; i < segments; i++) {
      const a = rings[0][i], b = rings[0][i + 1];
      const c = rings[1][i], d = rings[1][i + 1];
      indices.push(a, b, d, a, d, c);
    }
    if (capBottom) {
      const middle = vertex([cx, bottom, cz], [0, -1, 0], material);
      const cap = [];
      for (let i = 0; i <= segments; i++) {
        const angle = i * Math.PI * 2 / segments;
        cap.push(vertex([cx + lowerRadius * Math.cos(angle), bottom,
          cz + lowerRadius * Math.sin(angle)], [0, -1, 0], material));
      }
      for (let i = 0; i < segments; i++) indices.push(middle, cap[i + 1], cap[i]);
    }
    if (capTop) {
      const middle = vertex([cx, top, cz], [0, 1, 0], material);
      const cap = [];
      for (let i = 0; i <= segments; i++) {
        const angle = i * Math.PI * 2 / segments;
        cap.push(vertex([cx + upperRadius * Math.cos(angle), top,
          cz + upperRadius * Math.sin(angle)], [0, 1, 0], material));
      }
      for (let i = 0; i < segments; i++) indices.push(middle, cap[i], cap[i + 1]);
    }
    return rings;
  };
  const rod = (from, to, radius, material, segments = 20, part = 0) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const length = Math.hypot(dx, dy) || 1;
    const normal = [-dy / length, dx / length];
    const rings = [[], []];
    for (let row = 0; row < 2; row++) {
      const center = row ? to : from;
      for (let i = 0; i <= segments; i++) {
        const angle = i * Math.PI * 2 / segments;
        const c = Math.cos(angle), s = Math.sin(angle);
        rings[row].push(vertex([center[0] + normal[0] * c * radius,
          center[1] + normal[1] * c * radius, center[2] + s * radius],
        [normal[0] * c, normal[1] * c, s], material, part));
      }
    }
    for (let i = 0; i < segments; i++) {
      const a = rings[0][i], b = rings[0][i + 1];
      const c = rings[1][i], d = rings[1][i + 1];
      indices.push(a, b, d, a, d, c);
    }
  };
  const sphere = (cx, cy, cz, radius, material, slices = 20, stacks = 12, part = 0) => {
    const rows = [];
    for (let j = 0; j <= stacks; j++) {
      const latitude = -Math.PI / 2 + j * Math.PI / stacks;
      const row = [];
      for (let i = 0; i <= slices; i++) {
        const longitude = i * Math.PI * 2 / slices;
        const nx = Math.cos(latitude) * Math.cos(longitude);
        const ny = Math.sin(latitude);
        const nz = Math.cos(latitude) * Math.sin(longitude);
        row.push(vertex([cx + nx * radius, cy + ny * radius, cz + nz * radius],
          [nx, ny, nz], material, part));
      }
      rows.push(row);
    }
    for (let j = 0; j < stacks; j++) {
      for (let i = 0; i < slices; i++) {
        const a = rows[j][i], b = rows[j][i + 1];
        const c = rows[j + 1][i], d = rows[j + 1][i + 1];
        indices.push(a, b, d, a, d, c);
      }
    }
  };

  // Rotating pedestal, two articulated links, wrist and open parallel gripper.
  cylinder(-.35, 0, -.86, -.78, .31, .285, 0, 56);
  cylinder(-.35, 0, -.78, -.72, .205, .18, 0, 40);
  cylinder(-.35, 0, -.72, -.46, .15, .13, 0, 36);
  sphere(-.35, -.45, 0, .148, 0, 28, 16);
  sphere(-.35, -.45, .105, .068, 1);
  sphere(-.35, -.45, -.105, .068, 1);
  rod([-.35, -.44, 0], [-.055, .17, 0], .09, 1, 28);
  rod([-.33, -.42, .082], [-.065, .16, .082], .021, 0, 16);
  sphere(-.055, .17, 0, .12, 0, 28, 16);
  sphere(-.055, .17, .09, .057, 1);
  sphere(-.055, .17, -.09, .057, 1);
  rod([-.055, .17, 0], [.42, .365, 0], .077, 1, 28, 3);
  rod([-.04, .18, .067], [.4, .36, .067], .018, 0, 16, 3);
  sphere(.42, .365, 0, .087, 0, 20, 12, 3);
  sphere(.42, .365, .074, .032, 1, 16, 10, 3);
  sphere(.42, .365, -.074, .032, 1, 16, 10, 3);
  rod([.42, .365, 0], [.59, .29, 0], .054, 0, 24, 3);
  sphere(.59, .29, 0, .061, 1, 20, 12, 3);
  rod([.59, .29, 0], [.67, .29, 0], .056, 0, 20, 3);
  sphere(.665, .29, 0, .051, 0, 20, 12, 3);
  rod([.665, .29, 0], [.742, .385, 0], .027, 1, 16, 1);
  rod([.742, .385, 0], [.84, .365, 0], .024, 1, 16, 1);
  rod([.665, .29, 0], [.742, .195, 0], .027, 1, 16, 2);
  rod([.742, .195, 0], [.84, .215, 0], .024, 1, 16, 2);
  // Exposed drive linkage and slim tool pads make the end effector legible.
  rod([-.31, -.39, -.102], [-.065, .13, -.102], .013, 0, 12);
  rod([-.065, .13, -.102], [.38, .33, -.078], .011, 0, 12, 3);
  rod([.8, .373, 0], [.86, .368, 0], .017, 0, 12, 1);
  rod([.8, .207, 0], [.86, .212, 0], .017, 0, 12, 2);

  // A sparse reconstruction cage follows the joints, links and open gripper.
  const wirePositions = [];
  const wire = (a, b) => wirePositions.push(...a, ...b);
  const ring = (cx, y, radius, segments = 14) => Array.from({ length: segments }, (_, i) => {
    const angle = i * Math.PI * 2 / segments;
    return [cx + radius * Math.cos(angle), y, radius * Math.sin(angle)];
  });
  const connectRings = (lower, upper, diagonals = false) => {
    for (let i = 0; i < lower.length; i++) {
      const next = (i + 1) % lower.length;
      wire(lower[i], lower[next]);
      wire(upper[i], upper[next]);
      wire(lower[i], upper[i]);
      if (diagonals) wire(lower[i], upper[next]);
    }
  };
  const wireRod = (from, to, radius, segments = 8) => {
    const dx = to[0] - from[0], dy = to[1] - from[1];
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length, ny = dx / length;
    const section = (center) => Array.from({ length: segments }, (_, i) => {
      const angle = i * Math.PI * 2 / segments;
      return [center[0] + nx * Math.cos(angle) * radius,
        center[1] + ny * Math.cos(angle) * radius,
        center[2] + Math.sin(angle) * radius];
    });
    connectRings(section(from), section(to), true);
  };
  const jointWire = (cx, cy, radius) => {
    for (const z of [-radius * .64, radius * .64]) {
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6, b = (i + 1) * Math.PI / 6;
        wire([cx + radius * Math.cos(a), cy + radius * Math.sin(a), z],
          [cx + radius * Math.cos(b), cy + radius * Math.sin(b), z]);
      }
    }
  };
  const baseBottom = ring(-.35, -.86, .31);
  const baseTop = ring(-.35, -.78, .285);
  connectRings(baseBottom, baseTop, true);
  connectRings(ring(-.35, -.72, .15, 10), ring(-.35, -.46, .13, 10));
  jointWire(-.35, -.45, .148);
  wireRod([-.35, -.44, 0], [-.055, .17, 0], .09);
  jointWire(-.055, .17, .12);
  wireRod([-.055, .17, 0], [.42, .365, 0], .077);
  jointWire(.42, .365, .087);
  wireRod([.42, .365, 0], [.67, .29, 0], .054);
  wireRod([.665, .29, 0], [.742, .385, 0], .027, 6);
  wireRod([.742, .385, 0], [.84, .365, 0], .024, 6);
  wireRod([.665, .29, 0], [.742, .195, 0], .027, 6);
  wireRod([.742, .195, 0], [.84, .215, 0], .024, 6);

  // Slightly enlarge the finished silhouette within the card's cropped canvas.
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] *= 1.17;
    positions[i + 1] *= 1.17;
    positions[i + 2] *= 1.17;
  }
  for (let i = 0; i < wirePositions.length; i++) wirePositions[i] *= 1.17;
  window.SMN_SCAN_OBJECT_MODEL = { positions, normals, materials, parts, indices,
    wirePositions };
})();
