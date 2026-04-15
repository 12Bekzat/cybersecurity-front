export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export function FormField({ label, children }) {
  return (
    <label className="field-block">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

export function LoadingPanel({ title }) {
  return (
    <section className="page-stack">
      <article className="feature-panel loading-panel">
        <div className="loader-dot-row">
          <span />
          <span />
          <span />
        </div>
        <h2>{title}</h2>
        <p>Деректер серверден жүктеліп жатыр. Процесс тұрып қалса, backend пен frontend іске қосылғанын тексер.</p>
      </article>
    </section>
  );
}

export function EmptyPanel({ title, text }) {
  return (
    <section className="page-stack">
      <article className="feature-panel loading-panel">
        <h2>{title}</h2>
        <p>{text}</p>
      </article>
    </section>
  );
}

export function GatePanel({ title, text, actionLabel, onAction }) {
  return (
    <section className="page-stack">
      <article className="feature-panel loading-panel">
        <span className="eyebrow">Рөлге байланысты қолжетімділік</span>
        <h2>{title}</h2>
        <p>{text}</p>
        <button type="button" className="primary-btn" onClick={onAction}>
          {actionLabel}
        </button>
      </article>
    </section>
  );
}
