export default function TILoading() {
  return (
    <section aria-busy="true" aria-live="polite">
      <p className="ti-eyebrow">CONSOLE TI</p>
      <h1>Carregando o dashboard</h1>
      <p className="ti-skeleton" />
      <p className="ti-skeleton" />
      <p className="ti-skeleton" />
    </section>
  );
}
