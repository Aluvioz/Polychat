"use client";

import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
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
type PendingAttempt = { id: string; body: string };

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

function toMessage(value: Record<string, unknown>): Message | null {
  if (
    typeof value.id !== "string" ||
    typeof value.sender_profile_id !== "string" ||
    typeof value.created_at !== "string" ||
    (typeof value.body !== "string" && value.body !== null)
  ) return null;

  return {
    id: value.id,
    body: value.body,
    senderProfileId: value.sender_profile_id,
    createdAt: value.created_at,
    editedAt: typeof value.edited_at === "string" ? value.edited_at : null,
    deletedAt: typeof value.deleted_at === "string" ? value.deleted_at : null,
  };
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
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [sendError, setSendError] = useState("");
  const pendingAttempt = useRef<PendingAttempt | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

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

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || sending || !user) return;

    // Keep the same id when retrying the exact same draft after a network failure.
    if (!pendingAttempt.current || pendingAttempt.current.body !== body) {
      pendingAttempt.current = { id: crypto.randomUUID(), body };
    }

    setSending(true);
    setSendError("");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pendingAttempt.current.id,
          conversationId,
          body,
        }),
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok) {
        if (response.status === 409) pendingAttempt.current = null;
        setSendError(
          response.status === 403
            ? "Você não tem permissão para enviar mensagens nesta conversa."
            : response.status === 409
              ? "Não foi possível confirmar esta tentativa. Tente enviar novamente."
              : data?.error ?? "Não foi possível enviar a mensagem. Tente novamente.",
        );
        return;
      }

      const persisted = data?.message && typeof data.message === "object"
        ? toMessage(data.message as Record<string, unknown>)
        : null;
      if (!persisted) {
        setSendError("O serviço não confirmou a mensagem. Tente novamente.");
        return;
      }

      setMessages((current) => current.some((item) => item.id === persisted.id)
        ? current
        : [...current, persisted]);
      pendingAttempt.current = null;
      setDraft("");
      setSendError("");
      composerRef.current?.focus();
    } catch {
      // Retain the idempotency key so a retry cannot create a duplicate message.
      setSendError("Falha de conexão. Sua mensagem não foi confirmada; tente novamente.");
    } finally {
      setSending(false);
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
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
            <p className="conversations-subtitle">Mensagens privadas entre participantes autorizados.</p>
          </div>
          <button className="conversations-refresh" type="button" onClick={() => void loadInitial()} disabled={loading || sending}>
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
          <>
            <div className="history-panel">
              {hasMore ? (
                <button className="history-older" type="button" onClick={() => void loadOlder()} disabled={loadingOlder}>
                  {loadingOlder ? "Carregando..." : "Carregar mensagens anteriores"}
                </button>
              ) : null}
              {error ? <p className="history-inline-error" role="alert">{error}</p> : null}
              {messages.length === 0 ? (
                <div className="history-empty">
                  <span className="history-empty-mark" aria-hidden="true">✉</span>
                  <h2>Comece a conversa</h2>
                  <p>Envie a primeira mensagem para iniciar este diálogo.</p>
                </div>
              ) : (
                <ol className="history-message-list" aria-label="Histórico de mensagens" aria-live="polite">
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
              {!hasMore && messages.length > 0 ? <p className="history-end">Fim das mensagens carregadas</p> : null}
            </div>

            <form className="message-composer" onSubmit={sendMessage}>
              <label htmlFor="message-draft">Sua mensagem</label>
              <div className="message-composer-row">
                <textarea
                  ref={composerRef}
                  id="message-draft"
                  name="message"
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    if (sendError) setSendError("");
                  }}
                  onKeyDown={handleComposerKeyDown}
                  placeholder="Escreva uma mensagem..."
                  rows={2}
                  maxLength={10000}
                  disabled={sending}
                  aria-describedby="message-composer-hint"
                />
                <button className="message-send-button" type="submit" disabled={sending || !draft.trim()}>
                  {sending ? "Enviando..." : "Enviar"}
                  <span aria-hidden="true">➤</span>
                </button>
              </div>
              <div className="message-composer-footer">
                <span id="message-composer-hint">Enter para enviar · Shift + Enter para quebrar linha</span>
                <span>{draft.length}/10.000</span>
              </div>
              {sendError ? <p className="message-send-error" role="alert">{sendError}</p> : null}
            </form>
          </>
        )}
      </section>
      <footer className="conversations-footer">POLYCHAT · COMUNICAÇÃO CORPORATIVA</footer>
    </main>
  );
}
