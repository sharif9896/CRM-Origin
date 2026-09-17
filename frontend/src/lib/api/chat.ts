import { API_BASE_URL, apiRequest, getToken } from '../apiClient';

export type ChatUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  online?: boolean;
  unread?: number;
  lastMessage?: { text: string; createdAt: string; sender: string } | null;
};

export type ChatMessage = {
  id: string;
  channel: 'internal' | 'assistant';
  sender: ChatUser | null;
  recipient: ChatUser | null;
  text: string;
  assistant: boolean;
  readAt: string | null;
  createdAt: string;
};

export type ChatEvent = { event: string; data: Record<string, unknown> };

export const listChatContacts = async () => (await apiRequest<{ data: ChatUser[] }>('/chat/contacts')).data;
export const listChatMessages = async (userId: string) => (await apiRequest<{ data: ChatMessage[] }>(`/chat/messages/${userId}`)).data;
export const sendChatMessage = async (recipientId: string, text: string) => (await apiRequest<{ data: ChatMessage }>('/chat/messages', { method: 'POST', body: { recipientId, text } })).data;
export const markChatRead = (userId: string) => apiRequest(`/chat/messages/${userId}/read`, { method: 'PUT' });
export const listAssistantMessages = async () => (await apiRequest<{ data: ChatMessage[] }>('/chat/assistant')).data;
export const sendAssistantMessage = async (text: string) => (await apiRequest<{ data: ChatMessage[] }>('/chat/assistant', { method: 'POST', body: { text } })).data;

export async function openChatStream(onEvent: (event: ChatEvent) => void, signal: AbortSignal) {
  const token = getToken();
  const url = new URL(`${API_BASE_URL.replace(/\/$/, '')}/chat/stream`, window.location.origin);
  const response = await fetch(url, { headers: { Accept: 'text/event-stream', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, signal });
  if (!response.ok || !response.body) throw new Error('Unable to connect to live chat.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (!signal.aborted) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() || '';
    for (const block of blocks) {
      if (!block || block.startsWith(':')) continue;
      let event = 'message';
      const data: string[] = [];
      for (const line of block.split(/\r?\n/)) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        if (line.startsWith('data:')) data.push(line.slice(5).trim());
      }
      if (data.length) onEvent({ event, data: JSON.parse(data.join('\n')) as Record<string, unknown> });
    }
  }
}
