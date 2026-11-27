"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const notice =
    searchParams.get("motivo") === "sessao-expirada"
      ? "Sua sessão expirou. Entre novamente para continuar."
      : "";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        cache: "no-store",
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.error ?? "Não foi possível iniciar a sessão.");
        return;
      }
      router.replace(result?.user?.role === "ti" ? "/ti" : "/");
      router.refresh();
    } catch {
      setError("Não foi possível iniciar a sessão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <Link className="login-brand" href="/" aria-label="Voltar ao início">
          <span className="login-brand-mark" aria-hidden="true">P</span>
          <span>polychat</span>
        </Link>
        <p className="login-eyebrow">ACESSO CORPORATIVO · FORD</p>
        <h1 id="login-title">Entrar no Polychat</h1>
        <p className="login-description">
          Utilize o nome de usuário e a senha fornecidos pela equipe de TI.
        </p>
        {notice ? <p className="login-notice" role="status">{notice}</p> : null}
        <form className="login-form" onSubmit={submit}>
          <label htmlFor="username">Nome de usuário</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            maxLength={128}
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            maxLength={1024}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <p className="login-error" role="alert">{error}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? "Validando..." : "Entrar"}
          </button>
        </form>
        <p className="login-footnote">
          Problemas de acesso? Entre em contato com a equipe de TI.
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="login-shell" aria-busy="true" />}>
      <LoginForm />
    </Suspense>
  );
}
