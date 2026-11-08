import { money } from "../utils/trades";

export function EquityChart({ data }) {
  if (data.length < 2) {
    return <div className="empty">Za mało zamkniętych transakcji</div>;
  }
  const W = 300;
  const H = 110;
  const pts = [0, ...data];
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const x = (i) => (i / (pts.length - 1)) * W;
  const y = (v) => H - 6 - ((v - min) / range) * (H - 12);
  const line = pts.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const color = pts[pts.length - 1] >= 0 ? "var(--pos)" : "var(--neg)";

  return (
    <svg className="equity" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="eq-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" x2={W} y1={y(0)} y2={y(0)} className="zero-line" />
      <path d={`${line} L${W},${H} L0,${H} Z`} fill="url(#eq-fill)" />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function WinRing({ rate }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ring" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} className="ring-bg" />
      <circle
        cx="50"
        cy="50"
        r={r}
        className="ring-fg"
        strokeDasharray={`${(rate / 100) * c} ${c}`}
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="55" textAnchor="middle" className="ring-text">
        {rate.toFixed(0)}%
      </text>
    </svg>
  );
}

// Słupki pon–pt bieżącego tygodnia; dzień bez transakcji to szary placeholder
export function WeekBars({ bars }) {
  const max = Math.max(...bars.map((b) => Math.abs(b.pnl ?? 0))) || 1;

  return (
    <div className="week">
      {bars.map((b) => (
        <div key={b.label} className="week-col">
          <div className="week-slot">
            {b.pnl === null ? (
              <div className="bar bar-empty" style={{ height: "8%" }} />
            ) : (
              <div
                className={`bar ${b.pnl >= 0 ? "bar-pos" : "bar-neg"}`}
                style={{ height: `${Math.max(10, (Math.abs(b.pnl) / max) * 100)}%` }}
                title={money(b.pnl)}
              />
            )}
          </div>
          <span className="week-label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
