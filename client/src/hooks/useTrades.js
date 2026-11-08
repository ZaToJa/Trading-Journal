import { useEffect, useState } from "react";

// Cała komunikacja z API w jednym miejscu
export function useTrades() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then((data) => setTrades(data));
  }, []);

  async function saveTrade(trade, editingId) {
    const isEditing = editingId !== null;
    const res = await fetch(
      isEditing ? `/api/trades/${editingId}` : "/api/trades",
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trade),
      },
    );
    const data = await res.json();

    if (!res.ok) {
      console.log(data.errors ?? data.error);
      return false;
    }

    setTrades((prev) =>
      isEditing
        ? prev.map((t) => (t.id === editingId ? data : t))
        : [...prev, data],
    );
    return true;
  }

  async function deleteTrade(id) {
    const res = await fetch(`/api/trades/${id}`, { method: "DELETE" });

    if (!res.ok) {
      console.log("Nie udało się usunąć transakcji");
      return;
    }

    setTrades((prev) => prev.filter((t) => t.id !== id));
  }

  return { trades, saveTrade, deleteTrade };
}
