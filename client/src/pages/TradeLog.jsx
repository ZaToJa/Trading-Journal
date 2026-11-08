import TradesTable from "../components/TradesTable";

export default function TradeLog({ trades, onEdit, onDelete }) {
  return (
    <>
      <div className="page-head">
        <h1>Trade Log</h1>
        <p>Wszystkie transakcje</p>
      </div>

      <TradesTable trades={trades} onEdit={onEdit} onDelete={onDelete} />
    </>
  );
}
