export default function Panel({ title, aside, className = "", children }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-head">
        <span>{title}</span>
        {aside && <span className="panel-aside">{aside}</span>}
      </header>
      {children}
    </section>
  );
}
