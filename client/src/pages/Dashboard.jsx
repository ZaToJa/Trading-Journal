import StatsPanels from "../components/StatsPanels";

export default function Dashboard({ stats }) {
  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>Podsumowanie Twoich transakcji</p>
      </div>

      <StatsPanels stats={stats} />
    </>
  );
}
