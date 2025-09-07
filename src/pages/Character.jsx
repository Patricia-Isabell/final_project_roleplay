import { useEffect, useState } from "react";
import { ensureCharacter, saveCharacter, resetCharacter } from "../lib/storage";

export default function Character() {
  const [ch, setCh] = useState(() => ensureCharacter());
  useEffect(() => {
    saveCharacter(ch);
  }, [ch]);

  function setStat(key, value) {
    const v = Math.max(0, Math.min(10, Number(value) || 0));
    setCh((prev) => ({ ...prev, stats: { ...prev.stats, [key]: v } }));
  }

  return (
    <section className="card stack">
      <h2>Charakter erstellen</h2>
      <p>
        Verteile deine Startwerte (0–10). Höhere Werte erleichtern passende
        Entscheidungen.
      </p>
      <div className="row">
        <label>
          <small className="help">Name</small>
          <br />
          <input
            type="text"
            placeholder="Dein Name"
            value={ch.name}
            onChange={(e) => setCh({ ...ch, name: e.target.value })}
          />
        </label>
        <button
          className="ghost"
          onClick={() => {
            resetCharacter();
            setCh(ensureCharacter());
          }}
        >
          Zurücksetzen
        </button>
      </div>

      <div className="grid">
        <Stat
          label="Mathematik"
          value={ch.stats.math}
          onChange={(v) => setStat("math", v)}
        />
        <Stat
          label="Sprache"
          value={ch.stats.language}
          onChange={(v) => setStat("language", v)}
        />
        <Stat
          label="Naturwissenschaften"
          value={ch.stats.science}
          onChange={(v) => setStat("science", v)}
        />
        <Stat
          label="Kreativität"
          value={ch.stats.creativity}
          onChange={(v) => setStat("creativity", v)}
        />
        <Stat
          label="Sozial"
          value={ch.stats.social}
          onChange={(v) => setStat("social", v)}
        />
      </div>

      <small className="help">
        Tipp: Motivation wirkt sich positiv auf Erfolge aus; hoher Stress kann
        dir Steine in den Weg legen.
      </small>

      <div className="row">
        <a href="/game">
          <button>Weiter zum Spiel</button>
        </a>
        <a href="/status">
          <button className="secondary">Status ansehen</button>
        </a>
      </div>
    </section>
  );
}

function Stat({ label, value, onChange }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="bar">
        <span style={{ width: value * 10 + "%" }}></span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <small className="help">Wert: {value}/10</small>
    </div>
  );
}
