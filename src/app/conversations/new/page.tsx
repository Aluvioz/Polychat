"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ActiveUser = { id: string; username: string };

export default function NewConversationPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [openingId, setOpeningId] = useState("");
  const [error, setError] = useState("");

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    setError("");
    setSearched(false);
    setUsers([]);
    try {
      const response = await fetch(
        "/api/conversations/users?q=" + encodeURIComponent(query.trim()),
        { cache: "no-store" },
      );
      const data = await response.json().catch(() => null);
      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok || !Array.isArray(data?.users)) {
        setError(data?.error ?? "Não foi possível pesquisar usuários.");
        return;
      }
      setUsers(data.users);
      setSearched(true);
    } catch {
      setError("Não foi possível conectar ao serviço de usuários.");
    } finally {
      setSearching(false);
    }
  }

  async function openConversation(user: ActiveUser) {
    setOpeningId(user.id);
    setError("");
    try {
      const response = await fetch("/api/conversations/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherProfileId: user.id }),
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);
      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok || typeof data?.conversationId !== "string") {
        setError(data?.error ?? "Não foi possível abrir a conversa.");
        return;
      }
      router.replace("/conversations/" + data.conversationId);
    } catch {
      setError("Não foi possível conectar ao serviço de conversas.");
    } finally {
      setOpeningId("");
    }
  }

  return (
    <main className="conversations-shell">
      <header className="conversations-header">
        <Link className="conversations-brand" href="/conversations" aria-label="Voltar às conversas">
          <span className="conversations-brand-mark">P</span>
          <span>polychat</span>
        </Link>
        <Link className="history-back" href="/conversations">Conversas</Link>
      </header>

      <section className="conversations-content" aria-labelledby="new-conversation-title">
        <div className="conversations-heading">
          <div>
            <p className="conversations-eyebrow">NOVA CONVERSA</p>
            <h1 id="new-conversation-title">Encontrar usuário</h1>
            <p className="conversations-subtitle">Pesquise pelo nome de usuário para iniciar uma conversa individual.</p>
          </div>
        </div>

        <form className="directory-search" onSubmit={search}>
          <label htmlFor="active-user-query">Nome de usuário</label>
          <div className="directory-search-row">
            <input
              id="active-user-query"
              name="q"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              minLength={2}
              maxLength={64}
              required
              placeholder="Digite ao menos 2 caracteres"
              autoComplete="off"
            />
            <button type="submit" disabled={searching || query.trim().length < 2}>
              {searching ? "Pesquisando..." : "Pesquisar"}
            </button>
          </div>
        </form>

        {error ? <p className="directory-error" role="alert">{error}</p> : null}
        {searching ? (
          <div className="conversations-state" role="status" aria-live="polite">
            <span className="conversations-spinner" aria-hidden="true" />
            <p>Pesquisando usuários ativos...</p>
          </div>
        ) : searched && users.length === 0 ? (
          <div className="conversations-state conversations-state-empty">
            <h2>Nenhum usuário encontrado</h2>
            <p>Não há usuários ativos correspondentes à pesquisa.</p>
          </div>
        ) : users.length > 0 ? (
          <ul className="directory-results" aria-label="Usuários ativos encontrados">
            {users.map((user) => (
              <li key={user.id}>
                <span>{user.username}</span>
                <button
                  type="button"
                  onClick={() => void openConversation(user)}
                  disabled={Boolean(openingId)}
                >
                  {openingId === user.id ? "Abrindo..." : "Conversar"}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
      <footer className="conversations-footer">POLYCHAT · COMUNICAÇÃO CORPORATIVA</footer>
    </main>
  );
}
