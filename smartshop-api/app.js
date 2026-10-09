const foods = require('./foods');

function createHandler() {
  const list = [];
  const send = (res, status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(body));
  };
  const readBody = (req) => new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e5) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { resolve(null); } });
  });

  return async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,DELETE', 'Access-Control-Allow-Headers': 'Content-Type' });
      return res.end();
    }
    if (req.method === 'GET' && url.pathname === '/foods') {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      return send(res, 200, foods.filter((f) => f.name.toLowerCase().includes(q)));
    }
    if (req.method === 'GET' && url.pathname === '/list') return send(res, 200, list);
    if (req.method === 'POST' && url.pathname === '/list') {
      const body = await readBody(req);
      const name = body && typeof body.name === 'string' ? body.name.trim() : '';
      if (!name) return send(res, 400, { error: 'name is required' });
      const item = foods.find((f) => f.name.toLowerCase() === name.toLowerCase())
        || { name, emoji: '🛍️', meta: 'Custom grocery item' };
      const entry = { ...item, listId: list.length ? list[list.length - 1].listId + 1 : 1 };
      list.push(entry);
      return send(res, 201, entry);
    }
    const m = url.pathname.match(/^\/list\/(\d+)$/);
    if (req.method === 'DELETE' && m) {
      const i = list.findIndex((e) => e.listId === Number(m[1]));
      if (i < 0) return send(res, 404, { error: 'not found' });
      list.splice(i, 1);
      return send(res, 204, null);
    }
    send(res, 404, { error: 'not found' });
  };
}

module.exports = { createHandler };
