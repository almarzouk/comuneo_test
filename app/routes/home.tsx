// Startseite-Komponente
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="container">
      <h1>Aufgaben-App</h1>
      <p>Willkommen bei der einfachen Aufgaben-App</p>
      <br />
      <Link to="/signup">Neues Konto erstellen</Link>
      <br />
      <br />
      <Link to="/login">Anmelden</Link>
    </div>
  );
}
