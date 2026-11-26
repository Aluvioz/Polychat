import Link from "next/link";
import "../ti/console.css";

type AccessDeniedPageProps = {
  searchParams: Promise<{ motivo?: string }>;
};

export default async function AccessDeniedPage({ searchParams }: AccessDeniedPageProps) {
  const { motivo } = await searchParams;
  const deviceIncompatible = motivo === "dispositivo-incompativel";

  return (
    <main className="ti-state-page">
      <section className="ti-state-card" aria-labelledby="access-denied-title">
        <p className="ti-eyebrow">POLYCHAT · CONTROLE DE ACESSO</p>
        <h1 id="access-denied-title">
          {deviceIncompatible ? "Dispositivo ou navegador não homologado" : "Acesso não autorizado"}
        </h1>
        <p>
          {deviceIncompatible
            ? "O Console TI só pode ser usado em computador com Chrome, Edge ou Firefox atual. Acesse novamente por um computador com um desses navegadores."
            : "Seu perfil não possui permissão para acessar o Console TI. Se você acredita que deveria ter acesso, entre em contato com a equipe responsável."}
        </p>
        <Link className="ti-state-link" href="/">
          Voltar ao início
        </Link>
      </section>
    </main>
  );
}
