"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SessionUser = { id: string; username: string; role: "user" | "ti" };
type Conversation = {
  conversationId: string; kind: "direct" | "group"; name: string | null;
  lastMessageId: string | null; lastMessageBody: string | null;
  lastMessageAt: string | null; lastMessageSenderId: string | null;
  lastMessageDeleted: boolean; unreadCount: number;
};

function formatActivity(value: string | null) {
  if (!value) return "Sem mensagens";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function preview(conversation: Conversation, userId: string) {
  if (!conversation.lastMessageId) return "Nenhuma mensagem ainda";
  if (conversation.lastMessageDeleted) return "Mensagem removida";
  if (conversation.lastMessageBody === null) return "Anexo";
  return (conversation.lastMessageSenderId === userId ? "Você: " : "") + conversation.lastMessageBody;
}

export default function ConversationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/conversations", { cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (response.status === 401) { router.replace("/login"); return; }
      if (data?.user && data.user.role !== "user") { router.replace("/"); return; }
      if (!response.ok || !data?.user || !Array.isArray(data?.conversations)) {
        setError(data?.error ?? "Não foi possível carregar as conversas.");
        return;
      }
      setUser(data.user);
      setConversations(data.conversations);
    } catch {
      setError("Não foi possível conectar ao serviço de conversas.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { void Promise.resolve().then(() => loadConversations()); }, [loadConversations]);

  async function logout() {
    try { await fetch("/api/auth/logout", { method: "POST" }); }
    catch { /* The navigation still clears the local application flow. */ }
    finally { router.replace("/login"); router.refresh(); }
  }

  return (
    <main className="conversations-shell">
      <header className="conversations-header">
        <Link className="conversations-brand" href="/" aria-label="Polychat início">
          <span className="conversations-brand-mark">P</span><span>polychat</span>
        </Link>
        <div className="conversations-account">
          <span>{user?.username ?? "Usuário"}</span>
          <button className="conversations-logout" onClick={logout} type="button">Sair</button>
        </div>
      </header>
      <section className="conversations-content" aria-labelledby="conversations-title">
        <div className="conversations-heading">
          <div>
            <p className="conversations-eyebrow">COMUNICAÇÃO INTERNA</p>
            <h1 id="conversations-title">Conversas</h1>
            <p className="conversations-subtitle">Suas conversas mais recentes em um só lugar.</p>
          </div>
          <div className="conversation-actions">
            <Link className="conversation-new-link" href="/conversations/new">Nova conversa</Link>
            <button className="conversations-refresh" type="button" onClick={() => void loadConversations()} disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </div>
        {loading ? (
          <div className="conversations-state" role="status" aria-live="polite">
            <span className="conversations-spinner" aria-hidden="true" /><p>Carregando suas conversas...</p>
          </div>
        ) : error ? (
          <div className="conversations-state conversations-state-error" role="alert">
            <h2>Não foi possível carregar</h2><p>{error}</p>
            <button type="button" onClick={() => void loadConversations()}>Tentar novamente</button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="conversations-state conversations-state-empty">
            <span className="conversations-empty-icon" aria-hidden="true">◌</span>
            <h2>Nenhuma conversa por enquanto</h2>
            <p>Inicie uma conversa com um usuário ativo ou aguarde uma conversa em grupo.</p>
            <Link className="conversation-new-link" href="/conversations/new">Iniciar conversa</Link>
          </div>
        ) : (
          <div className="conversation-list" aria-label="Lista de conversas recentes">
            {conversations.map((conversation) => (
              <Link className="conversation-link" href={"/conversations/" + conversation.conversationId} key={conversation.conversationId}>
                <article className="conversation-item">
                  <div className="conversation-avatar" aria-hidden="true">{conversation.kind === "group" ? "G" : "C"}</div>
                  <div className="conversation-main">
                    <div className="conversation-title-row">
                      <h2>{conversation.kind === "group" ? conversation.name || "Grupo" : "Conversa individual"}</h2>
                      <time dateTime={conversation.lastMessageAt ?? undefined}>{formatActivity(conversation.lastMessageAt)}</time>
                    </div>
                    <div className="conversation-preview-row">
                      <p>{preview(conversation, user?.id ?? "")}</p>
                      {conversation.unreadCount > 0 ? (
                        <span className="conversation-unread" aria-label={conversation.unreadCount + " mensagens não lidas"}>
                          {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
      <footer className="conversations-footer">POLYCHAT · COMUNICAÇÃO CORPORATIVA</footer>
    </main>
  );
}
