
import { useEffect, useState } from "react";

function App() {

  const [trades, setTrades] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  fetch("/api/trades")
    .then((res) => res.json())
    .then((data) => setTrades(data));
  }, []);

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
        quantity: Number(quantity),
        price: Number(price),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.error);
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
    setQuantity("");
    setPrice("");
    setEditingId(null);
  }

  function handleEdit(trade) {
    setSymbol(trade.symbol);
    setQuantity(trade.quantity);
    setPrice(trade.price);
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

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          placeholder="Ilość"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          placeholder="Cena"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">{editingId !== null ? "Zapisz" : "Dodaj"}</button>
        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Anuluj
          </button>
        )}
      </form>

      <ul>
        {trades.map((t) => (
          <li key={t.id}>
            {t.symbol}: {t.quantity} × {t.price}{" "}
            <button onClick={() => handleEdit(t)}>Edytuj</button>{" "}
            <button onClick={() => handleDelete(t.id)}>Usuń</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
