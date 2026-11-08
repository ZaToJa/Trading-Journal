import Panel from "./Panel";
import { EquityChart, TradeBars, WinRing } from "./charts";
import { money } from "../utils/trades";

export default function StatsPanels({ stats }) {
  const maxSymbol = Math.max(1, ...stats.symbolRows.map(([, v]) => Math.abs(v)));

  return (
    <div className="grid">
      <Panel title="Łączny P&L" aside="all time" className="span-2">
        <div className="hero">
          <div className={`hero-value ${stats.totalPnl >= 0 ? "pos" : "neg"}`}>
            {money(stats.totalPnl)}
          </div>
          <div className="hero-sub">
            {stats.closedCount} zamkniętych · {stats.openCount} otwartych
          </div>
        </div>
        <EquityChart data={stats.equity} />
      </Panel>

      <Panel title="Win rate">
        <div className="ring-wrap">
          <WinRing rate={stats.winRate} />
          <div className="ring-legend">
            <span className="pos">{stats.wins} wygranych</span>
            <span className="neg">{stats.losses} przegranych</span>
          </div>
        </div>
      </Panel>

      <Panel title="Ostatnie transakcje" aside="P&L">
        <TradeBars pnls={stats.pnls} />
      </Panel>

      <Panel title="Profit factor">
        <div className="big">
          {stats.profitFactor === null ? "—" : stats.profitFactor.toFixed(2)}
        </div>
        <div className="muted-line">zysk brutto / strata brutto</div>
      </Panel>

      <Panel title="Średnia wygrana">
        <div className="big pos">{money(stats.avgWin)}</div>
        <div className="muted-line">najlepsza: {money(stats.best)}</div>
      </Panel>

      <Panel title="Średnia strata">
        <div className="big neg">{money(-stats.avgLoss)}</div>
        <div className="muted-line">najgorsza: {money(stats.worst)}</div>
      </Panel>

      <Panel title="P&L wg instrumentu" className="span-3">
        {stats.symbolRows.length === 0 ? (
          <div className="empty">Brak danych</div>
        ) : (
          <div className="sym-list">
            {stats.symbolRows.map(([sym, v]) => (
              <div key={sym} className="sym-row">
                <span className="sym-name">{sym}</span>
                <div className="sym-track">
                  <div
                    className={`sym-fill ${v >= 0 ? "bar-pos" : "bar-neg"}`}
                    style={{ width: `${(Math.abs(v) / maxSymbol) * 100}%` }}
                  />
                </div>
                <span className={`sym-val ${v >= 0 ? "pos" : "neg"}`}>
                  {money(v)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
