import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ensureCharacter, saveCharacter } from "../lib/storage";
import { applyEffects } from "../lib/engine";
import QUESTIONS from "../data/fragen.json";

// Seitenspezifische Styles
import "../styles/wahlpflicht.css";

// Hilfsfunktion: stärkstes Attribut bestimmen
function topStat(stats) {
  return Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "math";
}

const MAX_SELECTION = 3;

// Fach-Definitionen mit einmaligen Stat-Effekten
const SUBJECTS = {
  ECON: {
    id: "ECON",
    category: "economics",
    name: "Wirtschaft / BWL",
    desc: "Grundlagen von BWL, Logistik & Märkten. Mehr Wirkung in Kommunikation & Teamarbeit.",
    effects: { stats: { language: 1, social: 1 } },
  },
  LANG: {
    id: "LANG",
    category: "foreign_languages",
    name: "Fremdsprachen",
    desc: "Spanisch/Französisch/Latein – Rätsel, Leseverständnis & Ausdruck.",
    effects: { stats: { language: 2 } },
  },
  KREATIV: {
    id: "KREATIV",
    category: "creative_artists",
    name: "Kreativkünste",
    desc: "Kunst, Handwerk & Musik – praktische Fertigkeiten und Stilgeschichte.",
    effects: { stats: { creativity: 2 } },
  },
  MINT: {
    id: "MINT",
    category: "math",
    name: "Mathematik & Physik",
    desc: "Denksport, Geometrie, Knobelphysik – formales Denken und Problemlösen.",
    effects: { stats: { math: 2, science: 1 } },
  },
};

// Fragen nach Kategorie indexieren (Anzahl, Beispiel, IDs)
function buildCategoryIndex(questions) {
  const map = {};
  for (const q of questions ?? []) {
    const cat = q?.category ?? "misc";
    if (!map[cat]) map[cat] = { count: 0, sample: null, ids: [] };
    map[cat].count++;
    if (!map[cat].sample && q?.question) map[cat].sample = q.question;
    if (q?.id) map[cat].ids.push(q.id);
  }
  return map;
}

// Mehrere Effekte (Stats/Stress/Motivation) zu einer Vorschau zusammenführen
function mergeEffects(effectsList) {
  const out = {
    stats: { math: 0, language: 0, science: 0, creativity: 0, social: 0 },
    stress: 0,
    motivation: 0,
    week: 0,
  };
  for (const e of effectsList) {
    if (e?.stats) {
      for (const [k, v] of Object.entries(e.stats)) {
        out.stats[k] = (out.stats[k] ?? 0) + v;
      }
    }
    out.stress += e?.stress || 0;
    out.motivation += e?.motivation || 0;
    out.week += e?.week || 0;
  }
  return out;
}

export default function Wahlpflichtfacherwahl() {
  const navigate = useNavigate();
  const ch = ensureCharacter();

  // Kategorie-Zusammenfassung aus dem Fragenpool
  const catIndex = useMemo(() => buildCategoryIndex(QUESTIONS), []);

  // Nur Fächer anzeigen, zu denen es wirklich Fragen gibt
  const AVAILABLE_SUBJECTS = useMemo(
    () =>
      Object.values(SUBJECTS).filter((s) => catIndex[s.category]?.count > 0),
    [catIndex]
  );

  // Auswahlzustand
  const [selected, setSelected] = useState([]);

  // Empfehlung: Fach erhöht das stärkste Attribut
  const top = topStat(ch.stats);
  const isRecommended = (effects) => (effects?.stats?.[top] ?? 0) > 0;

  // Vorschau berechnen
  const selectedSubjects = AVAILABLE_SUBJECTS.filter((s) =>
    selected.includes(s.id)
  );
  const aggregated = useMemo(
    () => mergeEffects(selectedSubjects.map((s) => s.effects)),
    [selected]
  );
  const preview = useMemo(() => applyEffects(ch, aggregated), [ch, aggregated]);

  // Auswahl toggeln (mit Obergrenze)
  function toggle(id) {
    setSelected((old) => {
      const has = old.includes(id);
      if (has) return old.filter((x) => x !== id);
      if (old.length >= MAX_SELECTION) return old;
      return [...old, id];
    });
  }

  // Auswahl übernehmen: Effekte anwenden & Fragenpräferenzen speichern
  function submit() {
    const next = applyEffects(ch, aggregated);
    const selectedCats = selectedSubjects.map((s) => s.category);
    const questionIds = selectedSubjects.flatMap(
      (s) => catIndex[s.category]?.ids ?? []
    );
    next.electives = selected; // ["MINT","LANG",...]
    next.questionCategories = selectedCats; // ["math","foreign_languages",...]
    next.questionIds = questionIds; // nur IDs aus gewählten Kategorien
    saveCharacter(next);
    navigate("/status");
  }

  return (
    <section className="stack wahl">
      <div className="card stack">
        <h2>Wahlpflichtfächerwahl</h2>
        <p>
          Wähle bis zu {MAX_SELECTION} Fächer. Deine Auswahl erhöht einmalig
          deine Startwerte und legt fest, aus welchen Kategorien die Quiz-Fragen
          bevorzugt kommen.
        </p>
        <small className="help">
          Tipp: <strong>Empfohlen</strong> markierte Fächer passen zu deiner
          aktuellen Stärke (<code>{top}</code>).
        </small>
      </div>

      <div className="grid wahl-grid">
        {AVAILABLE_SUBJECTS.map((s) => {
          const checked = selected.includes(s.id);
          const disabled = !checked && selected.length >= MAX_SELECTION;
          const cat = catIndex[s.category];

          return (
            <div
              key={s.id}
              className={`card stack subject ${disabled ? "is-disabled" : ""}`}
            >
              <div className="row space subject__head">
                <h3 className="subject__title">{s.name}</h3>
                {isRecommended(s.effects) && (
                  <span className="badge badge--recommended">Empfohlen</span>
                )}
              </div>

              <div className="subject__desc">{s.desc}</div>

              <div className="row subject__meta">
                <small className="help">
                  <strong>Fragen im Pool:</strong> {cat?.count ?? 0}
                </small>
                {cat?.sample && (
                  <small className="help" title="Beispiel aus dem Fragenpool">
                    • Beispiel: <em>{cat.sample}</em>
                  </small>
                )}
              </div>

              <div className="row space subject__controls">
                <label className="row">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(s.id)}
                  />
                  <span>Auswählen</span>
                </label>
                <small className="help">
                  Effekte:{" "}
                  {Object.entries(s.effects.stats)
                    .map(([k, v]) => `${k}+${v}`)
                    .join(", ")}
                </small>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card stack">
        <h3>Vorschau deiner Werte</h3>
        <div className="grid">
          <Stat
            label="Mathematik"
            value={preview.stats.math}
            base={ch.stats.math}
          />
          <Stat
            label="Sprache"
            value={preview.stats.language}
            base={ch.stats.language}
          />
          <Stat
            label="Naturwissenschaften"
            value={preview.stats.science}
            base={ch.stats.science}
          />
          <Stat
            label="Kreativität"
            value={preview.stats.creativity}
            base={ch.stats.creativity}
          />
          <Stat
            label="Soziales"
            value={preview.stats.social}
            base={ch.stats.social}
          />
        </div>
        <div className="row">
          <button className="ghost" onClick={() => setSelected([])}>
            Auswahl zurücksetzen
          </button>
          <button disabled={selected.length === 0} onClick={submit}>
            Auswahl übernehmen
          </button>
          <a href="/game">
            <button className="secondary">Zum Spiel</button>
          </a>
        </div>
      </div>
    </section>
  );
}

// Einzelne Stat-Anzeige mit Balken, Breite via CSS-Variable
function Stat({ label, value, base }) {
  const pct = Math.max(0, Math.min(10, value)) * 10;
  return (
    <div className="stat">
      <div className="label">
        {label}{" "}
        <small className="help">
          (Basis {base} → {value})
        </small>
      </div>
      <div className="bar">
        <span style={{ "--pct": `${pct}%` }} />
      </div>
    </div>
  );
}
