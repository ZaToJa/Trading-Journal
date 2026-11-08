import { useState } from "react";
import "./styles/App.css";
import "./styles/Sidebar.css";
import "./styles/Stats.css";
import Calendar from "./components/Calendar";
import SidebarNav from "./components/SidebarNav";
import TradeForm from "./components/TradeForm";
import Dashboard from "./pages/Dashboard";
import Placeholder from "./pages/Placeholder";
import TradeLog from "./pages/TradeLog";
import { useTrades } from "./hooks/useTrades";
import { computeStats } from "./utils/trades";

function App() {
  const { trades, saveTrade, deleteTrade } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);
  const [page, setPage] = useState("dashboard");

  const stats = computeStats(trades);

  async function handleSave(trade) {
    const ok = await saveTrade(trade, editingTrade ? editingTrade.id : null);
    if (ok) setEditingTrade(null);
    return ok;
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" />
          <span className="brand-name">Trading Journal</span>
        </div>
        <span className="nav-title">Overview</span>
        <SidebarNav active={page} onChange={setPage} />

        <span className="nav-title">Trade Form</span>
        <TradeForm
          key={editingTrade ? editingTrade.id : "new"}
          editingTrade={editingTrade}
          onSave={handleSave}
          onCancel={() => setEditingTrade(null)}
        />

        <span className="nav-title">Calendar</span>
        <Calendar trades={trades} />
      </aside>

      <main className="main">
        {page === "dashboard" && <Dashboard stats={stats} />}
        {page === "log" && (
          <TradeLog
            trades={trades}
            onEdit={setEditingTrade}
            onDelete={deleteTrade}
          />
        )}
        {page === "stats" && <Placeholder title="Statystyki" />}
        {page === "account" && <Placeholder title="Account" />}
      </main>
    </div>
  );
}

export default App;
