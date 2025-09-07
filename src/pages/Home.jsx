import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="card stack">
      <h2>Willkommen zum Schulabenteuer 🎓</h2>
      <p>
        Triff Entscheidungen, verbessere deine Werte und erhalte am Ende eine
        passende Empfehlung.
      </p>
      <small className="help">
        Hinweis: Du kannst jederzeit zum Charakter zurückkehren und deine
        Startwerte anpassen.
      </small>
      <div className="row">
        <Link to="/character">
          <button>Charakter erstellen</button>
        </Link>
        <Link to="/wahlpflichtfacherwahl">
          <button className="secondary">Wahlpflichtfächer wählen</button>
        </Link>
        <Link to="/game">
          <button className="secondary">Spiel starten / fortsetzen</button>
        </Link>
        <Link to="/status">
          <button className="ghost">Status ansehen</button>
        </Link>
      </div>
    </section>
  );
}
