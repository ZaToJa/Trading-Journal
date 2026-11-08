import { useEffect, useState } from "react";
import "./App.css";

function calcPnl(trade) {
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

function App() {
  const [trades, setTrades] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [side, setSide] = useState("long");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then((data) => setTrades(data));
  }, []);

  const closedPnls = trades.map(calcPnl).filter((pnl) => pnl !== null);

  const totalPnl = closedPnls.reduce((sum, pnl) => sum + pnl, 0);
  const wins = closedPnls.filter((pnl) => pnl > 0).length;
  const losses = closedPnls.filter((pnl) => pnl < 0).length;
  const winRate = closedPnls.length > 0 ? (wins / closedPnls.length) * 100 : 0;

  async function handleSubmit(e) {
    e.preventDefault();

    const isEditing = editingId !== null;
    const url = isEditing ? `/api/trades/${editingId}` : "/api/trades";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol,
        side,
        quantity: Number(quantity),
        entryPrice: Number(entryPrice),
        exitPrice: exitPrice === "" ? undefined : Number(exitPrice),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.errors ?? data.error);
      return;
    }

    if (isEditing) {
      setTrades(trades.map((t) => (t.id === editingId ? data : t)));
    } else {
      setTrades([...trades, data]);
    }

    resetForm();
  }

  function resetForm() {
    setSymbol("");
    setSide("long");
    setQuantity("");
    setEntryPrice("");
    setExitPrice("");
    setEditingId(null);
  }

  function handleEdit(trade) {
    setSymbol(trade.symbol);
    setSide(trade.side);
    setQuantity(trade.quantity);
    setEntryPrice(trade.entryPrice);
    setExitPrice(trade.exitPrice ?? "");
    setEditingId(trade.id);
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/trades/${id}`, { method: "DELETE" });

    if (!res.ok) {
      console.log("Nie udało się usunąć transakcji");
      return;
    }

    setTrades(trades.filter((t) => t.id !== id));
  }

  return (
    <div>
      <h1>Trading Journal</h1>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Łączny P&amp;L</span>
          <span className={`stat-value ${totalPnl >= 0 ? "pos" : "neg"}`}>
            {totalPnl.toFixed(2)}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Wygrane</span>
          <span className="stat-value">{wins}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Przegrane</span>
          <span className="stat-value">{losses}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Win rate</span>
          <span className="stat-value">{winRate.toFixed(1)}%</span>
        </div>
      </div>

      <form className="trade-form" onSubmit={handleSubmit}>
        <label>
          Symbol
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        </label>
        <label>
          Ilość
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <label>
          Kierunek
          <select value={side} onChange={(e) => setSide(e.target.value)}>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </label>
        <label>
          Cena wejścia
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
          />
        </label>
        <label>
          Cena wyjścia
          <input
            type="number"
            placeholder="opcjonalnie"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" type="submit">
          {editingId !== null ? "Zapisz" : "Dodaj"}
        </button>
        {editingId !== null && (
          <button className="btn" type="button" onClick={resetForm}>
            Anuluj
          </button>
        )}
      </form>

      <table className="trade-table">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Kierunek</th>
            <th>Ilość</th>
            <th>Wejście</th>
            <th>Wyjście</th>
            <th>P&amp;L</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => {
            const pnl = calcPnl(t);

            return (
              <tr key={t.id}>
                <td>{t.symbol}</td>
                <td>
                  <span className={`badge ${t.side}`}>{t.side}</span>
                </td>
                <td>{t.quantity}</td>
                <td>{t.entryPrice}</td>
                <td>{t.exitPrice ?? "otwarta"}</td>
                <td className={pnl === null ? "" : pnl >= 0 ? "pos" : "neg"}>
                  {pnl === null ? "—" : pnl.toFixed(2)}
                </td>
                <td>
                  <button className="btn" onClick={() => handleEdit(t)}>
                    Edytuj
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(t.id)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
