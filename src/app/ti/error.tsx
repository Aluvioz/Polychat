"use client";

export default function TIError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="ti-state-card" role="alert">
      <h1>Não foi possível carregar o Console TI</h1>
      <p>
        Ocorreu uma falha ao apresentar esta página. Tente novamente. Se o
        problema continuar, entre em contato com a equipe de TI.
      </p>
      <button className="ti-state-button" onClick={() => reset()} type="button">
        Tentar novamente
      </button>
    </section>
  );
}
