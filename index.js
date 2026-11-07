const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

let trades = [
  { id: 1, symbol: "AAPL", quantity: 10, price: 150 },
  { id: 2, symbol: "GOOGL", quantity: 5, price: 2800 },
  { id: 3, symbol: "TSLA", quantity: 2, price: 700 },
];

app.get("/api/trades", (req, res) => {
  res.json(trades);
});

app.get("/api/trades/:id", (req, res) => {
  const id = Number(req.params.id);
  const trade = trades.find((t) => t.id === id);

  if (!trade) {
    return res.status(404).json({ error: "Trade not found" });
  }
  res.json(trade);
});

app.post("/api/trades", (req, res) => {
  const { symbol, quantity, price } = req.body;
  const newTrade = { id: Date.now(), symbol, quantity, price };
  trades.push(newTrade);
  res.status(201).json(newTrade);
});

app.put("/api/trades/:id", (req, res) => {
  const id = Number(req.params.id);
  const tradeIndex = trades.findIndex((t) => t.id === id);
  const { symbol, quantity, price } = req.body;

  if (tradeIndex === -1) {
    return res.status(404).json({ error: "Trade not found" });
  }
  trades[tradeIndex] = { id, symbol, quantity, price };
  res.json(trades[tradeIndex]);
});

app.delete("/api/trades/:id", (req, res) => {
  const id = Number(req.params.id);
  const tradeIndex = trades.findIndex((t) => t.id === id);

  if (tradeIndex === -1) {
    return res.status(404).json({ error: "Trade not found" });
  }
  trades.splice(tradeIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
