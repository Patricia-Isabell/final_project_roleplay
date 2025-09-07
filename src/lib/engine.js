export function applyEffects(ch, effects = {}) {
  const next = structuredClone(ch);
  const { stats = {}, stress = 0, motivation = 0, week = 0 } = effects;
  for (const [k, v] of Object.entries(stats))
    next.stats[k] = Math.max(0, Math.min(10, (next.stats[k] ?? 0) + v));
  next.stress = Math.max(0, next.stress + (stress || 0));
  next.motivation = Math.max(0, next.motivation + (motivation || 0));
  next.week = Math.max(1, next.week + (week || 0));
  return next;
}
export function roll(dice = "1d6") {
  const m = /^\s*(\d+)d(\d+)([+-]\d+)?\s*$/i.exec(String(dice));
  if (!m) return 0;
  const [, cStr, sStr, modStr] = m;
  const count = parseInt(cStr, 10);
  const sides = parseInt(sStr, 10);
  const mod = modStr ? parseInt(modStr, 10) : 0;
  let sum = 0;
  for (let i = 0; i < count; i++) sum += Math.floor(Math.random() * sides) + 1;
  return sum + mod;
}
export function runRequirement(requires, ch) {
  if (
    !requires ||
    !Array.isArray(requires.anyOf) ||
    requires.anyOf.length === 0
  )
    return { ok: true, details: [] };
  const details = [];
  let ok = false;
  for (const cond of requires.anyOf) {
    if (cond.stat) {
      const value = ch.stats[cond.stat] ?? 0;
      const passed =
        (cond.gte != null && value >= cond.gte) ||
        (cond.gt != null && value > cond.gt) ||
        (cond.lte != null && value <= cond.lte) ||
        (cond.lt != null && value < cond.lt);
      details.push({ type: "stat", key: cond.stat, value, passed });
      if (passed) ok = true;
    } else if (cond.roll) {
      const result = roll(cond.roll);
      const passed =
        (cond.gte != null && result >= cond.gte) ||
        (cond.gt != null && result > cond.gt) ||
        (cond.lte != null && result <= cond.lte) ||
        (cond.lt != null && result < cond.lt);
      details.push({ type: "roll", key: cond.roll, value: result, passed });
      if (passed) ok = true;
    }
  }
  return { ok, details };
}
