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

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Wszystkie statystyki liczone w jednym miejscu
export function computeStats(trades) {
  const closed = trades
    .map((t) => ({ trade: t, pnl: calcPnl(t) }))
    .filter((x) => x.pnl !== null)
    .sort((a, b) => (a.trade.date ?? "").localeCompare(b.trade.date ?? ""));

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
  };
}

// P&L zsumowany per dzień: { "2026-11-03": 200, ... }
export function pnlByDay(trades) {
  const days = {};
  trades.forEach((t) => {
    const pnl = calcPnl(t);
    if (pnl === null || !t.date) return;
    days[t.date] = (days[t.date] ?? 0) + pnl;
  });
  return days;
}
