const clients = new Map();

const send = (response, event, data) => {
  if (!response.writableEnded) response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

const publish = (userIds, event, data) => {
  for (const userId of new Set(userIds.map(String))) {
    for (const response of clients.get(userId) || []) send(response, event, data);
  }
};

const broadcast = (event, data) => {
  for (const responses of clients.values()) for (const response of responses) send(response, event, data);
};

const subscribe = (userId, response) => {
  const key = String(userId);
  const responses = clients.get(key) || new Set();
  responses.add(response);
  clients.set(key, responses);
  send(response, 'connected', { connected: true });
  broadcast('presence', { userId: key, online: true });

  return () => {
    responses.delete(response);
    if (!responses.size) {
      clients.delete(key);
      broadcast('presence', { userId: key, online: false });
    }
  };
};

const isOnline = userId => clients.has(String(userId));

module.exports = { publish, subscribe, isOnline };
