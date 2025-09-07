import { ensureCharacter } from "../lib/storage";
import { bestKey } from "../lib/gameHelper";

export default function Status() {
  const ch = ensureCharacter();
  const recs = bestKey(ch.stats);

  return (
    <section className="stack">
      <div className="card stack">
        <h2>Status</h2>
        <p>
          <strong>Name:</strong> {ch.name || "Unbenannt"}
        </p>
        <div className="grid">
          <Stat label="Mathematik" value={ch.stats.math} />
          <Stat label="Sprache" value={ch.stats.language} />
          <Stat label="Naturwissenschaften" value={ch.stats.science} />
          <Stat label="Kreativität" value={ch.stats.creativity} />
          <Stat label="Sozial" value={ch.stats.social} />
        </div>
        <div className="row">
          <div className="kpi">
            <span className="badge">Stress</span> {ch.stress}
          </div>
          <div className="kpi">
            <span className="badge">Motivation</span> {ch.motivation}
          </div>
          <div className="kpi">
            <span className="badge">Woche</span> {ch.week}
          </div>
        </div>
      </div>

      <div className="card stack">
        <h3>Empfohlene Fächer</h3>
        <ul>
          {recs.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <small className="help">
          Tipp: Empfehlungen richten sich nach deinen höchsten Werten.
        </small>
        <div className="row">
          <a href="/game">
            <button>Weiter spielen</button>
          </a>
          <a href="/final">
            <button className="secondary">Zum Finale</button>
          </a>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="bar">
        <span style={{ width: value * 10 + "%" }}></span>
      </div>
      <div style={{ marginTop: ".3rem", fontSize: ".9rem", opacity: 0.8 }}>
        Wert: {value}/10
      </div>
    </div>
  );
}
