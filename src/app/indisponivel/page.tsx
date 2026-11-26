import Link from "next/link";
import "../ti/console.css";

export default function UnavailablePage() {
  return (
    <main className="ti-state-page">
      <section className="ti-state-card" role="alert">
        <p className="ti-eyebrow">POLYCHAT · CONSOLE TI</p>
        <h1>Não foi possível validar seu acesso</h1>
        <p>
          O serviço de autenticação está temporariamente indisponível. Nenhum
          acesso administrativo foi liberado. Tente novamente mais tarde.
        </p>
        <Link className="ti-state-link" href="/login">
          Ir para o login
        </Link>
      </section>
    </main>
  );
}
