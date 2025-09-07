import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) => (isActive ? "active" : "");

export default function Header() {
  return (
    <header className="site">
      <div className="header-inner container">
        <div className="brand">Wähle Deine Eigene Entscheidung</div>
        <nav className="nav">
          <NavLink to="/" end className={linkClass}>
            Start
          </NavLink>

          <NavLink to="/character" className={linkClass}>
            Charakter
          </NavLink>
          <NavLink to="/game" className={linkClass}>
            Spiel
          </NavLink>
          <NavLink to="/wahlpflichtfacherwahl" end className={linkClass}>
            Wahlpflichtfächerwahl
          </NavLink>
          <NavLink to="/status" className={linkClass}>
            Status
          </NavLink>
          <NavLink to="/final" className={linkClass}>
            Finale
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
