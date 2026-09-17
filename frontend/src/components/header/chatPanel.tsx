import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccess } from '../../hooks/useAccess';
import { useAuth } from '../../store/hooks';
import {
  listAssistantMessages,
  listChatContacts,
  listChatMessages,
  markChatRead,
  openChatStream,
  sendAssistantMessage,
  sendChatMessage,
  type ChatMessage,
  type ChatUser,
} from '../../lib/api/chat';
import ImageWithBasePath from '../ui/imageWithBasePath';

const internalRoles = new Set(['admin', 'manager', 'senior-agent', 'agent', 'staff']);
const assistantRoles = new Set(['customer', 'viewer']);
const roleLabel = (role: string) => role.replace(/-/g, ' ').replace(/^./, character => character.toUpperCase());
const time = (value: string) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const addUnique = (messages: ChatMessage[], incoming: ChatMessage[]) => {
  const seen = new Set(messages.map(message => message.id));
  return [...messages, ...incoming.filter(message => !seen.has(message.id))].sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
};

export default function ChatPanel() {
  const { role } = useAccess();
  const { user } = useAuth();
  const internal = internalRoles.has(role);
  const supported = internal || assistantRoles.has(role);
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<ChatUser[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const openRef = useRef(open);
  const selectedRef = useRef(selectedId);
  const messageEnd = useRef<HTMLDivElement>(null);
  useEffect(() => { openRef.current = open; }, [open]);
  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);

  const loadContacts = useCallback(async () => {
    if (!internal) return;
    try {
      const rows = await listChatContacts();
      setContacts(rows);
      setSelectedId(current => current || rows[0]?.id || '');
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  }, [internal]);

  useEffect(() => {
    if (!supported || !internal) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial chat contacts come from the authenticated API.
    void loadContacts();
  }, [supported, internal, loadContacts]);

  useEffect(() => {
    if (!supported || !internal) return;
    const controller = new AbortController();
    let stopped = false;
    const connect = async () => {
      while (!stopped) {
        try {
          await openChatStream(event => {
            if (event.event === 'presence') {
              const userId = String(event.data.userId || '');
              setContacts(current => current.map(contact => contact.id === userId ? { ...contact, online: Boolean(event.data.online) } : contact));
            }
            if (event.event === 'message') {
              const message = event.data as unknown as ChatMessage;
              const senderId = message.sender?.id || '';
              const recipientId = message.recipient?.id || '';
              const active = selectedRef.current && [senderId, recipientId].includes(selectedRef.current);
              if (active) setMessages(current => addUnique(current, [message]));
              if (recipientId === user?.id && senderId) {
                setContacts(current => current.map(contact => contact.id === senderId ? {
                  ...contact,
                  unread: active && openRef.current ? 0 : (contact.unread || 0) + 1,
                  lastMessage: { text: message.text, createdAt: message.createdAt, sender: senderId },
                } : contact));
                if (active && openRef.current) void markChatRead(senderId);
              }
            }
            if (event.event === 'read') {
              const by = String(event.data.by || '');
              const readAt = String(event.data.readAt || new Date().toISOString());
              setMessages(current => current.map(message => message.recipient?.id === by ? { ...message, readAt } : message));
            }
          }, controller.signal);
        } catch (streamError) {
          if (!controller.signal.aborted) setError((streamError as Error).message);
        }
        if (!stopped) await new Promise(resolve => window.setTimeout(resolve, 2500));
      }
    };
    void connect();
    return () => { stopped = true; controller.abort(); };
  }, [supported, internal, user?.id]);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Opening or switching a conversation starts its API load.
    setLoading(true);
    setError('');
    const request = internal
      ? selectedId ? listChatMessages(selectedId) : Promise.resolve([])
      : listAssistantMessages();
    request.then(rows => {
      setMessages(rows);
      if (internal && selectedId) {
        void markChatRead(selectedId);
        setContacts(current => current.map(contact => contact.id === selectedId ? { ...contact, unread: 0 } : contact));
      }
    }).catch(requestError => setError((requestError as Error).message)).finally(() => setLoading(false));
  }, [open, internal, selectedId]);

  useEffect(() => { messageEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending || (internal && !selectedId)) return;
    setSending(true);
    setError('');
    setDraft('');
    try {
      const sent = internal ? [await sendChatMessage(selectedId, text)] : await sendAssistantMessage(text);
      setMessages(current => addUnique(current, sent));
      if (internal) await loadContacts();
    } catch (requestError) {
      setDraft(text);
      setError((requestError as Error).message);
    } finally {
      setSending(false);
    }
  };

  if (!supported) return null;
  const selected = contacts.find(contact => contact.id === selectedId);
  const unread = contacts.reduce((sum, contact) => sum + (contact.unread || 0), 0);

  return <>
    <div className="header-item">
      <button type="button" className="topbar-link flex items-center justify-center relative" aria-label={internal ? 'Team chat' : 'Assistant chat'} onClick={() => setOpen(true)}>
        <i className={internal ? 'icon-messages-square' : 'icon-bot'}/>
        {unread > 0 && <span className="chat-unread-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>
    </div>
    {open && <div className="chat-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className={`chat-panel ${internal ? '' : 'assistant-only'}`} role="dialog" aria-modal="true" aria-label={internal ? 'Team chat' : 'Property assistant'}>
        <header className="chat-panel-header">
          <div><span className="eyebrow">{internal ? 'INTERNAL WORKSPACE' : 'CUSTOMER SUPPORT'}</span><h2>{internal ? 'Team chat' : 'Realestate Assistant'}</h2></div>
          <button type="button" className="chat-icon-button" aria-label="Close chat" onClick={() => setOpen(false)}><i className="icon-x"/></button>
        </header>
        <div className="chat-layout">
          {internal && <aside className="chat-contacts" aria-label="Chat contacts">
            <div className="chat-contact-title"><strong>People</strong><button type="button" aria-label="Refresh contacts" onClick={() => void loadContacts()}><i className="icon-refresh-cw"/></button></div>
            {contacts.map(contact => <button type="button" key={contact.id} className={`chat-contact ${selectedId === contact.id ? 'active' : ''}`} onClick={() => setSelectedId(contact.id)}>
              <span className="chat-avatar"><ImageWithBasePath src={contact.avatar || 'assets/img/avatar/avatar-02.jpg'} alt=""/><i className={contact.online ? 'online' : ''}/></span>
              <span><strong>{contact.name}</strong><small>{contact.lastMessage?.text || roleLabel(contact.role)}</small></span>
              {!!contact.unread && <b>{contact.unread}</b>}
            </button>)}
            {!contacts.length && <p className="chat-empty-copy">No other active team accounts.</p>}
          </aside>}
          <div className="chat-conversation">
            <div className="chat-conversation-header">
              <div className="chat-avatar"><ImageWithBasePath src={internal ? selected?.avatar || 'assets/img/avatar/avatar-02.jpg' : 'assets/img/logo-small.svg'} alt=""/></div>
              <div><strong>{internal ? selected?.name || 'Select a teammate' : 'Realestate Assistant'}</strong><span>{internal ? selected ? `${roleLabel(selected.role)} · ${selected.online ? 'Online' : 'Offline'}` : 'Internal messaging' : 'Automated help for customers and viewers'}</span></div>
            </div>
            <div className="chat-messages" aria-live="polite">
              {!internal && !messages.length && <div className="assistant-welcome"><i className="icon-bot"/><strong>Hello {user?.name?.split(' ')[0]}</strong><p>Ask me about properties, rentals, appointments, tours, agents, billing, or your account.</p></div>}
              {loading && <div className="chat-loading">Loading conversation...</div>}
              {!loading && internal && selectedId && !messages.length && <div className="assistant-welcome"><i className="icon-message-circle"/><strong>Start the conversation</strong><p>Messages are private between you and {selected?.name}.</p></div>}
              {messages.map(message => {
                const mine = message.sender?.id === user?.id;
                return <div className={`chat-message ${mine ? 'mine' : ''}`} key={message.id}>
                  <div>{message.assistant && <span className="chat-assistant-label"><i className="icon-bot"/> Assistant</span>}<p>{message.text}</p><small>{time(message.createdAt)}{mine && internal ? message.readAt ? ' · Read' : ' · Sent' : ''}</small></div>
                </div>;
              })}
              <div ref={messageEnd}/>
            </div>
            {error && <div className="chat-error" role="alert">{error}</div>}
            <form className="chat-compose" onSubmit={submit}>
              <textarea aria-label="Message" placeholder={internal ? selected ? `Message ${selected.name}` : 'Select a teammate' : 'Ask the assistant...'} rows={1} maxLength={2000} disabled={internal && !selected} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }}/>
              <button type="submit" aria-label="Send message" disabled={sending || !draft.trim() || (internal && !selected)}><i className={sending ? 'icon-loader-circle image-picker-spin' : 'icon-send'}/></button>
            </form>
          </div>
        </div>
      </section>
    </div>}
  </>;
}
