const capabilities = [
  {
    number: "01",
    title: "Comunicação centralizada",
    description:
      "Um espaço único para conversas individuais e grupos de trabalho autorizados."
  },
  {
    number: "02",
    title: "Acesso controlado",
    description:
      "Perfis Usuário e TI, com permissões validadas no servidor."
  },
  {
    number: "03",
    title: "Gestão pelo TI",
    description:
      "Administração de contas e grupos conforme as regras do projeto."
  }
];

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Polychat início">
          <span className="wordmark-symbol" aria-hidden="true">
            P
          </span>
          <span>polychat</span>
        </a>
        <span className="topbar-context">AMBIENTE CORPORATIVO</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            PLATAFORMA DE COMUNICAÇÃO INTERNA
          </p>
          <h1 id="hero-title">
            Conexões que
            <br />
            <span>movem equipes.</span>
          </h1>
          <p className="hero-description">
            O Polychat está sendo preparado como um ambiente centralizado de
            comunicação interna para a FORD, com acesso controlado e gestão
            dedicada.
          </p>
          <div className="hero-note">
            <span className="note-icon" aria-hidden="true">i</span>
            <p>
              Esta é a estrutura inicial da aplicação. O acesso de usuários
              será liberado após a implementação e validação da autenticação.
            </p>
          </div>
        </div>

        <div className="hero-panel" aria-label="Resumo do ambiente Polychat">
          <div className="panel-orbit orbit-one" />
          <div className="panel-orbit orbit-two" />
          <div className="panel-content">
            <div className="panel-mark">P</div>
            <p className="panel-label">POLYCHAT</p>
            <p className="panel-caption">Comunicação. Colaboração. Segurança.</p>
            <div className="panel-divider" />
            <div className="panel-meta">
              <span>AMBIENTE</span>
              <strong>FORD</strong>
            </div>
            <div className="panel-meta">
              <span>STATUS</span>
              <strong className="panel-status">EM PREPARAÇÃO</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="capabilities" aria-labelledby="capabilities-title">
        <div className="section-heading">
          <p className="eyebrow">BASE DO PRODUTO</p>
          <h2 id="capabilities-title">Um ambiente. Dois perfis. Gestão centralizada.</h2>
        </div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <article className="capability-card" key={item.number}>
              <span className="card-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>POLYCHAT</span>
        <span>Projeto de comunicação interna · FORD</span>
      </footer>
    </main>
  );
}
