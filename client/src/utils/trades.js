export function calcPnl(trade) {
  // Otwarta pozycja nie ma jeszcze wyniku
  if (trade.exitPrice === undefined || trade.exitPrice === null) {
    return null;
  }

  const diff =
    trade.side === "long"
      ? trade.exitPrice - trade.entryPrice
      : trade.entryPrice - trade.exitPrice;

  return diff * trade.quantity;
}

export function money(n) {
  return (
    (n < 0 ? "-" : "") +
    "$" +
    Math.abs(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

const pad = (n) => String(n).padStart(2, "0");

export function toISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Aktualna data i godzina w formacie YYYY-MM-DDTHH:MM
export function nowDateTime() {
  const d = new Date();
  return `${toISO(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Dzień transakcji (YYYY-MM-DD) wzięty z daty wejścia
export function tradeDay(trade) {
  return trade.entryTime ? trade.entryTime.slice(0, 10) : null;
}

// "2026-11-07T09:30" → "2026-11-07 09:30"
export function formatDateTime(value) {
  return value ? value.replace("T", " ") : "—";
}

// Wszystkie statystyki liczone w jednym miejscu
export function computeStats(trades) {
  const closed = trades
    .map((t) => ({ trade: t, pnl: calcPnl(t) }))
    .filter((x) => x.pnl !== null)
    .sort((a, b) => (a.trade.entryTime ?? "").localeCompare(b.trade.entryTime ?? ""));

  const pnls = closed.map((x) => x.pnl);
  const totalPnl = pnls.reduce((s, p) => s + p, 0);
  const wins = pnls.filter((p) => p > 0).length;
  const losses = pnls.filter((p) => p < 0).length;
  const grossWin = pnls.filter((p) => p > 0).reduce((s, p) => s + p, 0);
  const grossLoss = Math.abs(
    pnls.filter((p) => p < 0).reduce((s, p) => s + p, 0),
  );

  const equity = pnls.reduce((acc, p) => {
    acc.push((acc.length ? acc[acc.length - 1] : 0) + p);
    return acc;
  }, []);

  const bySymbol = {};
  closed.forEach(({ trade, pnl }) => {
    bySymbol[trade.symbol] = (bySymbol[trade.symbol] ?? 0) + pnl;
  });

  return {
    pnls,
    equity,
    totalPnl,
    wins,
    losses,
    closedCount: pnls.length,
    openCount: trades.length - pnls.length,
    winRate: pnls.length > 0 ? (wins / pnls.length) * 100 : 0,
    avgWin: wins > 0 ? grossWin / wins : 0,
    avgLoss: losses > 0 ? grossLoss / losses : 0,
    profitFactor: grossLoss > 0 ? grossWin / grossLoss : null,
    best: pnls.length ? Math.max(...pnls) : 0,
    worst: pnls.length ? Math.min(...pnls) : 0,
    symbolRows: Object.entries(bySymbol).sort((a, b) => b[1] - a[1]),
    streak: streakInfo(pnls),
    week: weekSummary(trades),
    weekdays: weekdayTotals(closed),
    recent: recentTrades(trades),
  };
}

// P&L zsumowany per dzień: { "2026-11-03": 200, ... }
export function pnlByDay(trades) {
  const days = {};
  trades.forEach((t) => {
    const pnl = calcPnl(t);
    const day = tradeDay(t);
    if (pnl === null || !day) return;
    days[day] = (days[day] ?? 0) + pnl;
  });
  return days;
}

// Seria z rzędu na końcu listy: { count, type: "win" | "loss" | null }
function streakInfo(pnls) {
  if (pnls.length === 0) return { count: 0, type: null };
  const last = pnls[pnls.length - 1];
  const type = last > 0 ? "win" : last < 0 ? "loss" : null;
  if (type === null) return { count: 0, type: null };

  let count = 0;
  for (let i = pnls.length - 1; i >= 0; i--) {
    const same = type === "win" ? pnls[i] > 0 : pnls[i] < 0;
    if (!same) break;
    count++;
  }
  return { count, type };
}

// Bieżący tydzień (pon–pt jako słupki + suma całego tygodnia)
const WEEK_LABELS = ["Pn", "Wt", "Śr", "Cz", "Pt"];

export function weekSummary(trades, now = new Date()) {
  const days = pnlByDay(trades);
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ((now.getDay() + 6) % 7),
  );

  let total = 0;
  const bars = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const pnl = days[toISO(d)] ?? null;
    total += pnl ?? 0;
    if (i < 5) bars.push({ label: WEEK_LABELS[i], pnl });
  }
  return { bars, total };
}

// P&L zsumowany po dniu tygodnia (pon–pt) dla wszystkich transakcji
const WEEKDAY_NAMES = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

function weekdayTotals(closed) {
  const totals = WEEKDAY_NAMES.map((name) => ({ name, pnl: 0, count: 0 }));
  closed.forEach(({ trade, pnl }) => {
    const day = tradeDay(trade);
    if (!day) return;
    const [y, m, d] = day.split("-").map(Number);
    const idx = (new Date(y, m - 1, d).getDay() + 6) % 7;
    if (idx > 4) return;
    totals[idx].pnl += pnl;
    totals[idx].count++;
  });
  return totals;
}

// Pięć ostatnich transakcji (najnowsze na górze)
function recentTrades(trades) {
  return [...trades]
    .sort((a, b) => (b.entryTime ?? "").localeCompare(a.entryTime ?? "") || b.id - a.id)
    .slice(0, 5)
    .map((t) => ({ ...t, pnl: calcPnl(t) }));
}
