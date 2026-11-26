const areas = [
  {
    code: "T-03",
    title: "Usuários",
    description: "Administração de contas e credenciais.",
  },
  {
    code: "T-04",
    title: "Grupos",
    description: "Gestão de grupos e participantes.",
  },
  {
    code: "T-05",
    title: "Consulta de conversas",
    description: "Consulta administrativa autorizada.",
  },
  {
    code: "T-06",
    title: "Alertas",
    description: "Fila de mensagens sinalizadas.",
  },
  {
    code: "T-07",
    title: "Auditoria",
    description: "Registros administrativos e de segurança.",
  },
  {
    code: "T-08",
    title: "Configurações",
    description: "Termos/regras de detecção e quotas de anexos.",
  },
];

export default function TIDashboardPage() {
  return (
    <div className="ti-dashboard">
      <header className="ti-page-heading">
        <p className="ti-eyebrow">T-02 · ÁREA ADMINISTRATIVA</p>
        <h1>Dashboard TI</h1>
        <p>
          Visão inicial do ambiente administrativo do Polychat e acesso às
          áreas previstas para a equipe de TI.
        </p>
      </header>

      <section className="ti-notice" aria-labelledby="ti-notice-title">
        <span className="ti-notice-label">Console TI</span>
        <div>
          <h2 id="ti-notice-title">Bem-vindo ao ambiente administrativo</h2>
          <p>
            Esta entrega disponibiliza a estrutura do console e sua navegação.
            As operações das demais áreas serão habilitadas nas respectivas
            entregas.
          </p>
        </div>
      </section>

      <section className="ti-area-section" aria-labelledby="ti-areas-title">
        <div className="ti-section-heading">
          <div>
            <p className="ti-eyebrow">NAVEGAÇÃO</p>
            <h2 id="ti-areas-title">Áreas administrativas</h2>
          </div>
          <p>Catálogo aprovado POLY-UX-DEC-001</p>
        </div>

        <div className="ti-area-grid">
          {areas.map((area) => (
            <article className="ti-area-card" key={area.code}>
              <span className="ti-area-code">{area.code}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <span className="ti-area-status">Indisponível nesta entrega</span>
            </article>
          ))}
        </div>
      </section>

      <p className="ti-dashboard-footnote">
        Não há indicadores operacionais conectados nesta entrega. Nenhuma
        métrica ou dado demonstrativo é apresentado como informação real.
      </p>
    </div>
  );
}
