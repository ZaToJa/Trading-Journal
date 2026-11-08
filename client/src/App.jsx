import { useState } from "react";
import "./styles/App.css";
import "./styles/Sidebar.css";
import "./styles/Stats.css";
import Calendar from "./components/Calendar";
import SidebarNav from "./components/SidebarNav";
import TradeForm from "./components/TradeForm";
import StatsPanels from "./components/StatsPanels";
import TradesTable from "./components/TradesTable";
import { useTrades } from "./hooks/useTrades";
import { computeStats } from "./utils/trades";

function App() {
  const { trades, saveTrade, deleteTrade } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);

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
        <SidebarNav />

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
        <div className="page-head">
          <h1>Dashboard</h1>
          <p>Podsumowanie Twoich transakcji</p>
        </div>

        <StatsPanels stats={stats} />
        <TradesTable
          trades={trades}
          onEdit={setEditingTrade}
          onDelete={deleteTrade}
        />
      </main>
    </div>
  );
}

export default App;
