import { money } from "../utils/trades";

export function EquityChart({ data }) {
  if (data.length < 2) {
    return <div className="empty">Not enough closed trades</div>;
  }
  const W = 300;
  const H = 110;
  const pts = [0, ...data];
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const x = (i) => (i / (pts.length - 1)) * W;
  // top margin leaves room for the value label above the highest gridline
  const y = (v) => H - 6 - ((v - min) / range) * (H - 24);
  const pct = (v) => (y(v) / H) * 100;
  const line = pts.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const last = pts[pts.length - 1];
  const color = last >= 0 ? "var(--pos)" : "var(--neg)";
  const fmt = (v) => (v < 0 ? "-" : "") + "$" + Math.round(Math.abs(v));
  // 4 evenly spaced gridlines from the lowest to the highest value
  const ticks = [0, 1, 2, 3].map((i) => min + (range * i) / 3);

  return (
    <div className="equity-wrap">
      <svg className="equity" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="eq-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <line
            key={t}
            x1="0"
            x2={W}
            y1={y(t)}
            y2={y(t)}
            className="grid-line"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <line
          x1="0"
          x2={W}
          y1={y(0)}
          y2={y(0)}
          className="zero-line"
          vectorEffect="non-scaling-stroke"
        />
        <path d={`${line} L${W},${H} L0,${H} Z`} fill="url(#eq-fill)" />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* HTML overlays so text and the dot are not stretched with the SVG */}
      {ticks.map((t) => (
        <span key={t} className="equity-label" style={{ top: `${pct(t)}%` }}>
          {fmt(t)}
        </span>
      ))}
      <span className="equity-dot" style={{ top: `${pct(last)}%`, background: color }} />
    </div>
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
      <text x="50" y="50" textAnchor="middle" className="ring-text">
        {rate.toFixed(0)}%
      </text>
    </svg>
  );
}

// Outlined flame with the streak count inside; color comes from the `tone` class
export function StreakFlame({ count, tone }) {
  return (
    <svg className={`flame ${tone}`} viewBox="0 0 24 24" preserveAspectRatio="none">
      <path
        d="M12 2C12 2 13 6 15.5 8.5C18 11 19 13 19 15.5A7 7 0 0 1 5 15.5C5 13.5 5.8 12 7 10.8C7.3 12.2 8 13 9 13.4C8.4 9 9.5 5 12 2Z"
        className="flame-outline"
      />
      <text x="12" y="18" textAnchor="middle" className="flame-text">
        {count}
      </text>
    </svg>
  );
}

// Mon–Fri bars for the current week; a day without trades is a grey placeholder
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
