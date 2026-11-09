import Panel from "./Panel";
import TodoList from "./TodoList";
import { EquityChart, StreakFlame, WeekBars, WinRing } from "./charts";
import { formatDateTime, money } from "../utils/trades";

const STREAK_TEXT = {
  win: "wins in a row",
  loss: "losses in a row",
};

export default function StatsPanels({ stats }) {
  const maxSymbol = Math.max(1, ...stats.symbolRows.map(([, v]) => Math.abs(v)));

  const { streak, week, weekdays } = stats;
  const maxDay = Math.max(1, ...weekdays.map((d) => Math.abs(d.pnl)));
  const hours = stats.hours;
  const maxHour = Math.max(1, ...hours.map((h) => Math.abs(h.pnl)));
  const traded = hours.filter((h) => h.count > 0);
  const bestHour = traded.length ? traded.reduce((a, b) => (b.pnl > a.pnl ? b : a)) : null;
  const bestDay = weekdays.every((d) => d.count === 0)
    ? null
    : weekdays.reduce((a, b) => (b.pnl > a.pnl ? b : a));

  return (
    <div className="grid">
      {/* ---------- Row 1: week, win rate, streak ---------- */}
      <Panel title="This week" className="span-2">
        <div className="hero">
          <div className={`hero-value ${week.total >= 0 ? "pos" : "neg"}`}>
            {money(week.total)}
          </div>
          <div className="hero-sub">result of the current week</div>
        </div>
        <WeekBars bars={week.bars} />
      </Panel>

      <Panel title="Win rate" className="panel-center">
        <div className="ring-wrap">
          <WinRing rate={stats.winRate} />
          <div className="ring-legend">
            <span className="pos">{stats.wins} wins</span>
            <span className="neg">{stats.losses} losses</span>
          </div>
        </div>
      </Panel>

      <Panel title="Streak" className="panel-center">
        <div className="hero">
          <StreakFlame
            count={streak.count}
            tone={streak.type === "win" ? "pos" : streak.type === "loss" ? "neg" : "idle"}
          />
          <div className="hero-sub">
            {STREAK_TEXT[streak.type] ?? "no active streak"}
          </div>
        </div>
      </Panel>

      {/* ---------- Row 2: recent, equity, best day + to-do ---------- */}
      <Panel title="Recent trades" className="panel-center">
        {stats.recent.length === 0 ? (
          <div className="empty">No trades</div>
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
                  {t.pnl === null ? "open" : money(t.pnl)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Total P&L" aside="all time" className="span-2 panel-grow">
        <div className="hero">
          <div className={`hero-value ${stats.totalPnl >= 0 ? "pos" : "neg"}`}>
            {money(stats.totalPnl)}
          </div>
          <div className="hero-sub">
            {stats.closedCount} closed · {stats.openCount} open
          </div>
        </div>
        <EquityChart data={stats.equity} />
      </Panel>

      <div className="stack">
        <Panel title="Best day">
          {bestDay === null ? (
            <div className="empty">No data</div>
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

        <Panel title="Best hours">
          {bestHour === null ? (
            <div className="empty">No data</div>
          ) : (
            <>
              <div className="day-name">{bestHour.label}</div>
              <div className={`day-value ${bestHour.pnl >= 0 ? "pos" : "neg"}`}>
                {money(bestHour.pnl)}
              </div>
              <div className="day-strip hour-strip">
                {hours.map((h) => (
                  <span
                    key={h.label}
                    title={`${h.label}: ${money(h.pnl)}`}
                    style={{
                      background:
                        h.count === 0
                          ? "var(--surface-2)"
                          : h.pnl >= 0
                            ? `rgba(61, 220, 132, ${0.3 + 0.7 * (h.pnl / maxHour)})`
                            : `rgba(239, 83, 80, ${0.3 + 0.7 * (-h.pnl / maxHour)})`,
                    }}
                  />
                ))}
              </div>
              <div className="hour-labels">
                <span>12am</span>
                <span>6am</span>
                <span>12pm</span>
                <span>6pm</span>
                <span>12am</span>
              </div>
            </>
          )}
        </Panel>
      </div>

      {/* ---------- Row 3: additional statistics ---------- */}
      <div className="span-4 sub-grid">
        <Panel title="Profit factor">
          <div className="big">
            {stats.profitFactor === null ? "—" : stats.profitFactor.toFixed(2)}
          </div>
          <div className="muted-line">gross profit / gross loss</div>
        </Panel>

        <Panel title="Average win">
          <div className="big pos">{money(stats.avgWin)}</div>
          <div className="muted-line">best: {money(stats.best)}</div>
        </Panel>

        <Panel title="Average loss">
          <div className="big neg">{money(-stats.avgLoss)}</div>
          <div className="muted-line">worst: {money(stats.worst)}</div>
        </Panel>
      </div>

      <Panel title="P&L by instrument" className="span-2">
        {stats.symbolRows.length === 0 ? (
          <div className="empty">No data</div>
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

      <Panel title="To do" className="span-2 todo-panel">
        <TodoList />
      </Panel>
    </div>
  );
}
