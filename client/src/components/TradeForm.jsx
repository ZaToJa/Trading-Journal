import { useState } from "react";
import { nowDateTime } from "../utils/trades";

const EMPTY = {
  symbol: "",
  side: "long",
  quantity: "",
  entryPrice: "",
  exitPrice: "",
  entryTime: nowDateTime(),
  exitTime: "",
};

export default function TradeForm({ editingTrade, onSave, onCancel }) {
  // The form is remounted whenever `key` changes in App,
  // so the initial state only needs to be set once.
  const [form, setForm] = useState(
    editingTrade
      ? {
          ...EMPTY,
          ...editingTrade,
          exitPrice: editingTrade.exitPrice ?? "",
          exitTime: editingTrade.exitTime ?? "",
        }
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
      entryTime: form.entryTime,
      exitTime: form.exitTime === "" ? undefined : form.exitTime,
    });

    if (ok) setForm({ ...EMPTY, entryTime: nowDateTime() });
  }

  return (
    <form className="panel trade-form" onSubmit={handleSubmit}>
      <h2 className="panel-head">
        {editingTrade ? "Edit trade" : "New trade"}
      </h2>

      <label>
        Symbol
        <input
          placeholder="e.g. AAPL"
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

      <label>
        Quantity
        <input type="number" value={form.quantity} onChange={set("quantity")} />
      </label>

      <div className="row">
        <label>
          Entry price
          <input
            type="number"
            value={form.entryPrice}
            onChange={set("entryPrice")}
          />
        </label>
        <label>
          Exit price
          <input
            type="number"
            placeholder="optional"
            value={form.exitPrice}
            onChange={set("exitPrice")}
          />
        </label>
      </div>

      <label>
        Entry time
        <input
          type="datetime-local"
          value={form.entryTime}
          onChange={set("entryTime")}
        />
      </label>
      <label>
        Exit time
        <input
          type="datetime-local"
          value={form.exitTime}
          onChange={set("exitTime")}
        />
      </label>

      <button className="btn btn-primary btn-block" type="submit">
        {editingTrade ? "Save changes" : "Add trade"}
      </button>
      {editingTrade && (
        <button className="btn btn-block" type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}
