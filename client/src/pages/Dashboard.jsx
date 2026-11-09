import StatsPanels from "../components/StatsPanels";

export default function Dashboard({ stats }) {
  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>Summary of your trades</p>
      </div>

      <StatsPanels stats={stats} />
    </>
  );
}
