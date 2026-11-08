// Tymczasowa strona dla zakładek, które nie mają jeszcze zawartości
export default function Placeholder({ title }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      <p>Ta strona jest jeszcze pusta.</p>
    </div>
  );
}
