import { useState } from "react";

const ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "log", label: "Trade Log" },
  { id: "stats", label: "Statystyki" },
  { id: "account", label: "Account" },
];

// Na razie same przyciski (bez routingu) – aktywny element tylko się podświetla
export default function SidebarNav() {
  const [active, setActive] = useState("dashboard");

  return (
    <nav className="nav">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-item ${active === item.id ? "nav-active" : ""}`}
          onClick={() => setActive(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
