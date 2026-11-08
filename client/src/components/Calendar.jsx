import { useState } from "react";
import Panel from "./Panel";
import { money, pnlByDay } from "../utils/trades";

const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];

const pad = (n) => String(n).padStart(2, "0");

export default function Calendar({ trades }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const days = pnlByDay(trades);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay(): 0 = niedziela → przesuwamy tak, by tydzień zaczynał się w poniedziałek
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;

  const monthPnl = Object.entries(days)
    .filter(([d]) => d.startsWith(`${year}-${pad(month + 1)}`))
    .reduce((s, [, v]) => s + v, 0);

  function shift(delta) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Panel
      title="Kalendarz"
      aside={
        <span className={monthPnl >= 0 ? "pos" : "neg"}>{money(monthPnl)}</span>
      }
    >
      <div className="cal-nav">
        <button className="btn" onClick={() => shift(-1)} aria-label="Poprzedni miesiąc">
          ←
        </button>
        <span>
          {MONTHS[month]} {year}
        </span>
        <button className="btn" onClick={() => shift(1)} aria-label="Następny miesiąc">
          →
        </button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map((d) => (
          <span key={d} className="cal-dow">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} />;
          const pnl = days[`${year}-${pad(month + 1)}-${pad(day)}`];
          const cls = pnl === undefined ? "" : pnl >= 0 ? "cal-pos" : "cal-neg";
          return (
            <span
              key={day}
              className={`cal-day ${cls}`}
              title={pnl === undefined ? "" : money(pnl)}
            >
              {day}
            </span>
          );
        })}
      </div>
    </Panel>
  );
}
