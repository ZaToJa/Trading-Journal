const ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "log", label: "Trade Log" },
  { id: "stats", label: "Statistics" },
  { id: "account", label: "Account" },
];

// The active page is kept in App – the menu only displays it and reports clicks
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
