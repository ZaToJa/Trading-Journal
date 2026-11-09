import Panel from "./Panel";
import { calcPnl, formatDateTime, money } from "../utils/trades";

export default function TradesTable({ trades, onEdit, onDelete }) {
  return (
    <Panel title="Trades" aside={`${trades.length}`}>
      <div className="table-scroll">
        <table className="trade-table">
          <thead>
            <tr>
              <th>Entry time</th>
              <th>Exit time</th>
              <th>Instrument</th>
              <th>Side</th>
              <th>Quantity</th>
              <th>Entry price</th>
              <th>Exit price</th>
              <th>P&amp;L</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => {
              const pnl = calcPnl(t);
              return (
                <tr key={t.id}>
                  <td>{formatDateTime(t.entryTime)}</td>
                  <td>{formatDateTime(t.exitTime)}</td>
                  <td className="strong">{t.symbol}</td>
                  <td>
                    <span className={`badge ${t.side}`}>{t.side}</span>
                  </td>
                  <td>{t.quantity}</td>
                  <td>{t.entryPrice}</td>
                  <td>{t.exitPrice ?? "open"}</td>
                  <td className={pnl === null ? "" : pnl >= 0 ? "pos" : "neg"}>
                    {pnl === null ? "—" : money(pnl)}
                  </td>
                  <td className="actions">
                    <button className="btn" onClick={() => onEdit(t)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(t.id)}
                    >
                      Delete
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
