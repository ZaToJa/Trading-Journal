// Temporary page for tabs that have no content yet
export default function Placeholder({ title }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      <p>This page is still empty.</p>
    </div>
  );
}
