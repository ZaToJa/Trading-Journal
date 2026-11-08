const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, "trades.json");

function saveTrades() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(trades, null, 2));
}

function loadTrades() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Nie udało się wczytać trades.json:", err.message);
      process.exit(1);
    }
    fs.writeFileSync(DATA_FILE, "[]", { flag: "wx" });
    return [];
  }
}

let trades = loadTrades();

// data i godzina w formacie YYYY-MM-DDTHH:MM (jak z <input type="datetime-local">)
const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/;

function validateTrade(body) {
  const errors = [];
  const { symbol, side, quantity, entryPrice, exitPrice, entryTime, exitTime } =
    body;

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
  if (typeof entryTime !== "string" || !DATETIME_REGEX.test(entryTime)) {
    errors.push("entryTime must be a string in YYYY-MM-DDTHH:MM format");
  }
  // exitTime jest opcjonalne (otwarta pozycja), ale jeśli jest, musi być poprawne
  if (
    exitTime !== undefined &&
    exitTime !== null &&
    (typeof exitTime !== "string" || !DATETIME_REGEX.test(exitTime))
  ) {
    errors.push("exitTime must be a string in YYYY-MM-DDTHH:MM format");
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
  const { symbol, side, quantity, entryPrice, exitPrice, entryTime, exitTime } =
    req.body;
  const newTrade = {
    id: Date.now(),
    symbol,
    side,
    quantity,
    entryPrice,
    exitPrice,
    entryTime,
    exitTime,
  };
  const errors = validateTrade(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  trades.push(newTrade);
  saveTrades();
  res.status(201).json(newTrade);
});

app.put("/api/trades/:id", (req, res) => {
  const id = Number(req.params.id);
  const tradeIndex = trades.findIndex((t) => t.id === id);
  const { symbol, side, quantity, entryPrice, exitPrice, entryTime, exitTime } =
    req.body;
  const errors = validateTrade(req.body);

  if (tradeIndex === -1) {
    return res.status(404).json({ error: "Trade not found" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  trades[tradeIndex] = {
    id,
    symbol,
    side,
    quantity,
    entryPrice,
    exitPrice,
    entryTime,
    exitTime,
  };
  saveTrades();
  res.json(trades[tradeIndex]);
});

app.delete("/api/trades/:id", (req, res) => {
  const id = Number(req.params.id);
  const tradeIndex = trades.findIndex((t) => t.id === id);

  if (tradeIndex === -1) {
    return res.status(404).json({ error: "Trade not found" });
  }
  trades.splice(tradeIndex, 1);
  saveTrades();
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
