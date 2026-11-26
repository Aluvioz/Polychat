import Link from "next/link";
import "../ti/console.css";

export default function AccessDeniedPage() {
  return (
    <main className="ti-state-page">
      <section className="ti-state-card" aria-labelledby="access-denied-title">
        <p className="ti-eyebrow">POLYCHAT · CONTROLE DE ACESSO</p>
        <h1 id="access-denied-title">Acesso não autorizado</h1>
        <p>
          Seu perfil não possui permissão para acessar o Console TI. Se você
          acredita que deveria ter acesso, entre em contato com a equipe
          responsável.
        </p>
        <Link className="ti-state-link" href="/">
          Voltar ao início
        </Link>
      </section>
    </main>
  );
}
