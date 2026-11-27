import Link from "next/link";
import type { ReactNode } from "react";
import "./console.css";

const navigation = [
  { code: "T-02", label: "Dashboard", href: "/ti", available: true },
  { code: "T-03", label: "Usuários", available: false },
  { code: "T-04", label: "Grupos", available: false },
  { code: "T-05", label: "Consulta de conversas", available: false },
  { code: "T-06", label: "Alertas", available: false },
  { code: "T-07", label: "Auditoria", available: false },
  { code: "T-08", label: "Configurações", available: false },
];

export default function TIConsoleLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="ti-console">
      <aside className="ti-sidebar" aria-label="Console TI">
        <Link className="ti-brand" href="/ti" aria-label="Polychat — Dashboard TI">
          <span className="ti-brand-name">polychat</span>
          <span className="ti-brand-context">CONSOLE TI</span>
        </Link>

        <nav className="ti-navigation" aria-label="Navegação administrativa">
          <ul>
            {navigation.map((item) => (
              <li key={item.code}>
                {item.available ? (
                  <Link
                    className="ti-nav-link ti-nav-link-active"
                    href={item.href ?? "/ti"}
                    aria-current="page"
                  >
                    <span className="ti-nav-code">{item.code}</span>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="ti-nav-link ti-nav-link-disabled" aria-disabled="true">
                    <span className="ti-nav-code">{item.code}</span>
                    <span className="ti-nav-copy">
                      <span>{item.label}</span>
                      <small>Indisponível nesta entrega</small>
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <p className="ti-sidebar-footnote">Área administrativa restrita ao perfil TI.</p>
      </aside>

      <div className="ti-main-column">
        <header className="ti-topbar">
          <span>Polychat</span>
          <span className="ti-topbar-context">Ambiente administrativo</span>
        </header>
        <main className="ti-main" id="conteudo-principal">
          {children}
        </main>
      </div>
    </div>
  );
}
