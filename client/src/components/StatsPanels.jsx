import Panel from "./Panel";
import TodoList from "./TodoList";
import { EquityChart, WeekBars, WinRing } from "./charts";
import { formatDateTime, money } from "../utils/trades";

const STREAK_TEXT = {
  win: "wygranych z rzędu",
  loss: "przegranych z rzędu",
};

export default function StatsPanels({ stats }) {
  const maxSymbol = Math.max(1, ...stats.symbolRows.map(([, v]) => Math.abs(v)));

  const { streak, week, weekdays } = stats;
  const maxDay = Math.max(1, ...weekdays.map((d) => Math.abs(d.pnl)));
  const bestDay = weekdays.every((d) => d.count === 0)
    ? null
    : weekdays.reduce((a, b) => (b.pnl > a.pnl ? b : a));

  return (
    <div className="grid">
      {/* ---------- Rząd 1: tydzień, win rate, streak ---------- */}
      <Panel title="Ten tydzień" className="span-2">
        <div className="hero">
          <div className={`hero-value ${week.total >= 0 ? "pos" : "neg"}`}>
            {money(week.total)}
          </div>
          <div className="hero-sub">wynik bieżącego tygodnia</div>
        </div>
        <WeekBars bars={week.bars} />
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

      <Panel title="Streak">
        <div className="hero">
          <div
            className={`hero-value ${
              streak.type === "win" ? "pos" : streak.type === "loss" ? "neg" : ""
            }`}
          >
            {streak.count}
          </div>
          <div className="hero-sub">
            {STREAK_TEXT[streak.type] ?? "brak aktywnej serii"}
          </div>
        </div>
      </Panel>

      {/* ---------- Rząd 2: ostatnie, equity, best days + todo ---------- */}
      <Panel title="Ostatnie transakcje">
        {stats.recent.length === 0 ? (
          <div className="empty">Brak transakcji</div>
        ) : (
          <ul className="recent-list">
            {stats.recent.map((t) => (
              <li key={t.id} className="recent-row">
                <div>
                  <div className="strong">{t.symbol}</div>
                  <div className="muted-line">{formatDateTime(t.entryTime)}</div>
                </div>
                <span
                  className={
                    t.pnl === null ? "" : t.pnl >= 0 ? "pos strong" : "neg strong"
                  }
                >
                  {t.pnl === null ? "otwarta" : money(t.pnl)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

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

      <div className="stack">
        <Panel title="Najlepszy dzień">
          {bestDay === null ? (
            <div className="empty">Brak danych</div>
          ) : (
            <>
              <div className="day-name">{bestDay.name}</div>
              <div className={`day-value ${bestDay.pnl >= 0 ? "pos" : "neg"}`}>
                {money(bestDay.pnl)}
              </div>
              <div className="day-strip">
                {weekdays.map((d) => (
                  <span
                    key={d.name}
                    title={`${d.name}: ${money(d.pnl)}`}
                    style={{
                      background:
                        d.count === 0
                          ? "var(--surface-2)"
                          : d.pnl >= 0
                            ? `rgba(61, 220, 132, ${0.3 + 0.7 * (d.pnl / maxDay)})`
                            : `rgba(239, 83, 80, ${0.3 + 0.7 * (-d.pnl / maxDay)})`,
                    }}
                  />
                ))}
              </div>
              <div className="day-labels">
                {weekdays.map((d) => (
                  <span key={d.name}>{d.name.slice(0, 2)}</span>
                ))}
              </div>
            </>
          )}
        </Panel>

        <Panel title="Do zrobienia">
          <TodoList />
        </Panel>
      </div>

      {/* ---------- Rząd 3: dodatkowe statystyki ---------- */}
      <div className="span-4 sub-grid">
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
      </div>

      <Panel title="P&L wg instrumentu" className="span-4">
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
