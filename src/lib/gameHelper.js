export function bestKey(stats) {
  const entries = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  const top = entries[0]?.[0] ?? "math";
  const map = {
    math: [
      "Mathematik (M1)",
      "Physik (P1)",
      "Chemie (C1)",
      "Technisches Zeichnen (D1)",
    ],
    science: ["Biologie (Bio1)", "NaWi-Projekt", "Informatik Grundlagen (IT1)"],
    language: [
      "Deutsch Rhetorik (D2)",
      "Englisch Praesentation (E2)",
      "Kreatives Schreiben (KS2)",
    ],
    creativity: ["Kunst (K3B)", "Musik (M3B)", "Werken (W3B)"],
    social: [
      "Sozialkunde (Soz)",
      "Kommunikationstraining (Komm)",
      "Teamprojekt (TP)",
    ],
  };
  return map[top] || ["Allgemeine Vertiefung"];
}
