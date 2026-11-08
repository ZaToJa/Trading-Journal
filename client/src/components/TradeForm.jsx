import { useState } from "react";
import { todayISO } from "../utils/trades";

const EMPTY = {
  symbol: "",
  side: "long",
  quantity: "",
  entryPrice: "",
  exitPrice: "",
  date: todayISO(),
};

export default function TradeForm({ editingTrade, onSave, onCancel }) {
  // Formularz jest zamontowany od nowa przy zmianie `key` w App,
  // więc stan startowy wystarczy ustawić raz.
  const [form, setForm] = useState(
    editingTrade
      ? { ...EMPTY, ...editingTrade, exitPrice: editingTrade.exitPrice ?? "" }
      : EMPTY,
  );

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();

    const ok = await onSave({
      symbol: form.symbol,
      side: form.side,
      quantity: Number(form.quantity),
      entryPrice: Number(form.entryPrice),
      exitPrice: form.exitPrice === "" ? undefined : Number(form.exitPrice),
      date: form.date,
    });

    if (ok) setForm({ ...EMPTY, date: todayISO() });
  }

  return (
    <form className="panel trade-form" onSubmit={handleSubmit}>
      <h2 className="panel-head">
        {editingTrade ? "Edytuj transakcję" : "Nowa transakcja"}
      </h2>

      <label>
        Symbol
        <input
          placeholder="np. AAPL"
          value={form.symbol}
          onChange={set("symbol")}
        />
      </label>

      <div className="seg">
        {["long", "short"].map((s) => (
          <button
            key={s}
            type="button"
            className={form.side === s ? `seg-on ${s}` : ""}
            onClick={() => setForm({ ...form, side: s })}
          >
            {s === "long" ? "Long" : "Short"}
          </button>
        ))}
      </div>

      <div className="row">
        <label>
          Ilość
          <input type="number" value={form.quantity} onChange={set("quantity")} />
        </label>
        <label>
          Data
          <input type="date" value={form.date} onChange={set("date")} />
        </label>
      </div>

      <div className="row">
        <label>
          Cena wejścia
          <input
            type="number"
            value={form.entryPrice}
            onChange={set("entryPrice")}
          />
        </label>
        <label>
          Cena wyjścia
          <input
            type="number"
            placeholder="opcjonalnie"
            value={form.exitPrice}
            onChange={set("exitPrice")}
          />
        </label>
      </div>

      <button className="btn btn-primary btn-block" type="submit">
        {editingTrade ? "Zapisz zmiany" : "Dodaj transakcję"}
      </button>
      {editingTrade && (
        <button className="btn btn-block" type="button" onClick={onCancel}>
          Anuluj
        </button>
      )}
    </form>
  );
}
