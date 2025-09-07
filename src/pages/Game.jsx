import { useEffect, useMemo, useState } from "react";
import events from "../data/events.json";
import { ensureCharacter, saveCharacter, resetCharacter } from "../lib/storage";
import { applyEffects, runRequirement } from "../lib/engine";

export default function Game() {
  const [ch, setCh] = useState(() => ensureCharacter());
  const [result, setResult] = useState(null);

  const event = useMemo(() => {
    const idx = (Math.max(1, ch.week) - 1) % events.length;
    return events[idx];
  }, [ch.week]);

  useEffect(() => {
    saveCharacter(ch);
  }, [ch]);

  function choose(choice) {
    setResult(null);
    if (choice.requires) {
      const run = runRequirement(choice.requires, ch);
      if (run.ok) {
        const next = applyEffects(ch, choice.successEffects || { week: 1 });
        setCh(next);
        setResult({
          ok: true,
          text: choice.successText || "Erfolg!",
          details: run.details,
        });
      } else {
        const next = applyEffects(
          ch,
          choice.failEffects || { stress: 1, week: 1 }
        );
        setCh(next);
        setResult({
          ok: false,
          text: choice.failText || "Leider nicht geklappt.",
          details: run.details,
        });
      }
    } else {
      const next = applyEffects(ch, choice.effects || { week: 1 });
      setCh(next);
      setResult({ ok: true, text: "Entscheidung angewandt." });
    }
  }

  return (
    <section className="stack">
      <div className="card stack">
        <h2>Woche {ch.week}</h2>
        <p style={{ marginTop: "-.3rem" }}>
          Ereignis: <strong>{event.title}</strong>
        </p>
        <p>{event.desc}</p>
        <div className="row">
          {event.choices.map((c) => (
            <div key={c.id} className="stack" style={{ minWidth: 220 }}>
              <button onClick={() => choose(c)}>{c.label}</button>
              {c.requires && (
                <small className="help">
                  Erforderlich:{" "}
                  {c.requires.anyOf
                    .map((r, i) =>
                      r.stat
                        ? `${r.stat} ≥ ${r.gte ?? "?"}`
                        : `${r.roll} ≥ ${r.gte ?? "?"}`
                    )
                    .join(" oder ")}
                </small>
              )}
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className={result.ok ? "success" : "alert"}>
          <strong>{result.ok ? "✔ Erfolg:" : "✖ Versuch:"}</strong>{" "}
          {result.text}
        </div>
      )}

      <div className="card stack">
        <h3>Dein Fortschritt</h3>
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
        <div className="row">
          <a href="/status">
            <button className="secondary">Status ansehen</button>
          </a>
          <a href="/final">
            <button className="ghost">Zum Finale</button>
          </a>
          <button
            className="danger"
            onClick={() => {
              resetCharacter();
              setCh(ensureCharacter());
              setResult(null);
            }}
          >
            Neu starten
          </button>
        </div>
        <small className="help">
          Hinweis: „Neu starten“ setzt deinen Charakter und den Spielfortschritt
          zurück.
        </small>
      </div>
    </section>
  );
}
