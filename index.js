const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

let trades = [
  {
    id: 1,
    symbol: "AAPL",
    side: "long",
    quantity: 10,
    entryPrice: 140,
    exitPrice: 160,
  },
  {
    id: 2,
    symbol: "GOOGL",
    side: "long",
    quantity: 5,
    entryPrice: 2900,
    exitPrice: 2700,
  },
  {
    id: 3,
    symbol: "TSLA",
    side: "short",
    quantity: 2,
    entryPrice: 750,
    exitPrice: 650,
  },
];

function validateTrade(body) {
  const errors = [];
  const { symbol, side, quantity, entryPrice, exitPrice } = body;

  if (typeof symbol !== "string" || symbol.trim() === "") {
    errors.push("symbol must be a non-empty string");
  }
  if (typeof quantity !== "number" || quantity <= 0) {
    errors.push("quantity must be a positive number");
  }
  if (typeof entryPrice !== "number" || entryPrice <= 0) {
    errors.push("entryPrice must be a positive number");
  }
  // exitPrice jest opcjonalne (otwarta pozycja), ale jeśli jest, musi być poprawne
  if (
    exitPrice !== undefined &&
    exitPrice !== null &&
    (typeof exitPrice !== "number" || exitPrice <= 0)
  ) {
    errors.push("exitPrice must be a positive number");
  }
  if (!["long", "short"].includes(side)) {
    errors.push('side must be "long" or "short"');
  }

  return errors;
}

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
  const { symbol, side, quantity, entryPrice, exitPrice } = req.body;
  const newTrade = {
    id: Date.now(),
    symbol,
    side,
    quantity,
    entryPrice,
    exitPrice,
  };
  const errors = validateTrade(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  trades.push(newTrade);
  res.status(201).json(newTrade);
});

app.put("/api/trades/:id", (req, res) => {
  const id = Number(req.params.id);
  const tradeIndex = trades.findIndex((t) => t.id === id);
  const { symbol, side, quantity, entryPrice, exitPrice } = req.body;
  const errors = validateTrade(req.body);

  if (tradeIndex === -1) {
    return res.status(404).json({ error: "Trade not found" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  trades[tradeIndex] = { id, symbol, side, quantity, entryPrice, exitPrice };
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
