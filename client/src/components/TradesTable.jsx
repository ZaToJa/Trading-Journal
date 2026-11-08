import Panel from "./Panel";
import { calcPnl, money } from "../utils/trades";

export default function TradesTable({ trades, onEdit, onDelete }) {
  return (
    <Panel title="Transakcje" aside={`${trades.length}`}>
      <div className="table-scroll">
        <table className="trade-table">
          <thead>
            <tr>
              <th>Data</th>
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
                  <td>{t.date}</td>
                  <td className="strong">{t.symbol}</td>
                  <td>
                    <span className={`badge ${t.side}`}>{t.side}</span>
                  </td>
                  <td>{t.quantity}</td>
                  <td>{t.entryPrice}</td>
                  <td>{t.exitPrice ?? "otwarta"}</td>
                  <td className={pnl === null ? "" : pnl >= 0 ? "pos" : "neg"}>
                    {pnl === null ? "—" : money(pnl)}
                  </td>
                  <td className="actions">
                    <button className="btn" onClick={() => onEdit(t)}>
                      Edytuj
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(t.id)}
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
    </Panel>
  );
}
