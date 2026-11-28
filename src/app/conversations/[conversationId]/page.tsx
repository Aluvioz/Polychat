"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type SessionUser = { id: string; username: string; role: "user" | "ti" };
type Message = {
  id: string;
  body: string | null;
  senderProfileId: string;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
};
type Cursor = { createdAt: string; messageId: string };

function formatMessageDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ConversationHistoryPage() {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState("");

  const markRead = useCallback(async (items: Message[], readerProfileId: string) => {
    const messageIds = items
      .filter((message) => message.senderProfileId !== readerProfileId && !message.deletedAt)
      .map((message) => message.id);
    if (messageIds.length === 0) return;
    await fetch(`/api/conversations/${conversationId}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageIds }),
      cache: "no-store",
    }).catch(() => null);
  }, [conversationId]);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
      if (sessionResponse.status === 401) {
        router.replace("/login");
        return;
      }
      const sessionData = await sessionResponse.json().catch(() => null);
      if (!sessionResponse.ok || !sessionData?.user || sessionData.user.role !== "user") {
        router.replace(sessionData?.user ? "/" : "/login");
        return;
      }
      setUser(sessionData.user);

      const response = await fetch(
        `/api/conversations/${conversationId}/messages?limit=50`,
        { cache: "no-store" },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !Array.isArray(data?.messages)) {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        setError(data?.error ?? "Não foi possível carregar o histórico.");
        return;
      }

      const chronological = [...data.messages].reverse() as Message[];
      setMessages(chronological);
      setHasMore(Boolean(data.hasMore));
      setCursor(data.nextCursor ?? null);
      await markRead(chronological, sessionData.user.id);
    } catch {
      setError("Não foi possível conectar ao serviço de mensagens.");
    } finally {
      setLoading(false);
    }
  }, [conversationId, markRead, router]);

  useEffect(() => {
    void Promise.resolve().then(() => loadInitial());
  }, [loadInitial]);

  async function loadOlder() {
    if (!cursor || loadingOlder) return;
    setLoadingOlder(true);
    setError("");
    try {
      const query = new URLSearchParams({
        limit: "50",
        beforeCreatedAt: cursor.createdAt,
        beforeMessageId: cursor.messageId,
      });
      const response = await fetch(
        `/api/conversations/${conversationId}/messages?${query.toString()}`,
        { cache: "no-store" },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !Array.isArray(data?.messages)) {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        setError(data?.error ?? "Não foi possível carregar mensagens anteriores.");
        return;
      }
      const older = [...data.messages].reverse() as Message[];
      setMessages((current) => [...older, ...current]);
      setHasMore(Boolean(data.hasMore));
      setCursor(data.nextCursor ?? null);
      if (user?.id) await markRead(older, user.id);
    } catch {
      setError("Não foi possível conectar ao serviço de mensagens.");
    } finally {
      setLoadingOlder(false);
    }
  }

  return (
    <main className="conversations-shell">
      <header className="conversations-header">
        <Link className="conversations-brand" href="/conversations" aria-label="Voltar às conversas">
          <span className="conversations-brand-mark">P</span>
          <span>polychat</span>
        </Link>
        <div className="conversations-account">
          <span>{user?.username ?? "Usuário"}</span>
          <Link className="history-back" href="/conversations">Conversas</Link>
        </div>
      </header>

      <section className="conversations-content history-content" aria-labelledby="history-title">
        <div className="conversations-heading">
          <div>
            <p className="conversations-eyebrow">MENSAGERIA</p>
            <h1 id="history-title">Conversa</h1>
            <p className="conversations-subtitle">Histórico disponível para sua participação.</p>
          </div>
          <button className="conversations-refresh" type="button" onClick={() => void loadInitial()} disabled={loading}>
            Atualizar
          </button>
        </div>

        {loading ? (
          <div className="conversations-state" role="status" aria-live="polite">
            <span className="conversations-spinner" aria-hidden="true" />
            <p>Carregando mensagens...</p>
          </div>
        ) : error && messages.length === 0 ? (
          <div className="conversations-state conversations-state-error" role="alert">
            <h2>Não foi possível abrir a conversa</h2>
            <p>{error}</p>
            <button type="button" onClick={() => void loadInitial()}>Tentar novamente</button>
          </div>
        ) : (
          <div className="history-panel">
            {hasMore ? (
              <button className="history-older" type="button" onClick={() => void loadOlder()} disabled={loadingOlder}>
                {loadingOlder ? "Carregando..." : "Carregar mensagens anteriores"}
              </button>
            ) : null}
            {error ? <p className="history-inline-error" role="alert">{error}</p> : null}
            {messages.length === 0 ? (
              <div className="conversations-state conversations-state-empty">
                <h2>Nenhuma mensagem disponível</h2>
                <p>Esta conversa ainda não possui mensagens visíveis.</p>
              </div>
            ) : (
              <ol className="history-message-list" aria-label="Histórico de mensagens">
                {messages.map((message) => {
                  const own = message.senderProfileId === user?.id;
                  return (
                    <li className={own ? "history-message history-message-own" : "history-message"} key={message.id}>
                      <div className="history-message-meta">
                        <span>{own ? "Você" : "Colaborador"}</span>
                        <time dateTime={message.createdAt}>{formatMessageDate(message.createdAt)}</time>
                      </div>
                      <p>{message.deletedAt ? "Mensagem removida" : message.body ?? "Anexo"}</p>
                      {message.editedAt && !message.deletedAt ? <small>Mensagem editada</small> : null}
                    </li>
                  );
                })}
              </ol>
            )}
            {!hasMore && messages.length > 0 ? <p className="history-end">Início do histórico disponível</p> : null}
          </div>
        )}
      </section>
      <footer className="conversations-footer">POLYCHAT · COMUNICAÇÃO CORPORATIVA</footer>
    </main>
  );
}
