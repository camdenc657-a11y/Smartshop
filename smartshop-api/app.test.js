const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { createHandler } = require('./app');

test('foods search, list add and delete', async () => {
  const server = http.createServer(createHandler());
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  try {
    const foods = await (await fetch(`${base}/foods?q=avo`)).json();
    assert.strictEqual(foods.length, 1);

    const added = await fetch(`${base}/list`, { method: 'POST', body: JSON.stringify({ name: 'Avocado' }) });
    assert.strictEqual(added.status, 201);
    const item = await added.json();
    assert.strictEqual(item.cal, 160);

    assert.strictEqual((await fetch(`${base}/list`, { method: 'POST', body: '{}' })).status, 400);
    assert.strictEqual((await fetch(`${base}/list/${item.listId}`, { method: 'DELETE' })).status, 204);
    assert.deepStrictEqual(await (await fetch(`${base}/list`)).json(), []);
  } finally {
    server.close();
  }
});
