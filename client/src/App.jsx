
import { useEffect, useState } from "react";

function App() {

  const [trades, setTrades] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(""); 


  useEffect(() => {
  fetch("/api/trades")
    .then((res) => res.json())
    .then((data) => setTrades(data));
  }, []);

  return (
    <div>
      <h1>Trading Journal</h1>
      <ul>
        {trades.map((t) => (
          <li key={t.id}>
            {t.symbol}: {t.quantity} × {t.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
