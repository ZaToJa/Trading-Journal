const ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "log", label: "Trade Log" },
  { id: "stats", label: "Statystyki" },
  { id: "account", label: "Account" },
];

// Aktywna strona jest trzymana w App – menu tylko ją pokazuje i zgłasza kliknięcia
export default function SidebarNav({ active, onChange }) {
  return (
    <nav className="nav">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-item ${active === item.id ? "nav-active" : ""}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
