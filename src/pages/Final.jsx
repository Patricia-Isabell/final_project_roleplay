import { ensureCharacter } from "../lib/storage";
import { bestKey } from "../lib/gameHelper";

export default function Final() {
  const ch = ensureCharacter();
  const recs = bestKey(ch.stats);

  return (
    <section className="card stack">
      <h2>Abschluss-Empfehlung</h2>
      <p>Nach {ch.week - 1} Wochen Spielzeit empfehlen wir dir besonders:</p>
      <ol>
        {recs.map((r, i) => (
          <li key={i}>
            <strong>{r}</strong>
          </li>
        ))}
      </ol>
      <blockquote>
        Dies ist eine Empfehlung basierend auf deinen Entscheidungen und Werten
        – du kannst jederzeit neu starten und andere Wege ausprobieren.
      </blockquote>
      <div className="row">
        <a href="/character">
          <button className="ghost">Neuen Charakter anlegen</button>
        </a>
        <a href="/game">
          <button>Noch eine Runde</button>
        </a>
      </div>
      <small className="help">
        Hinweis: Ein Neustart ändert oft die Ereignisreihenfolge und Ergebnisse.
      </small>
    </section>
  );
}
