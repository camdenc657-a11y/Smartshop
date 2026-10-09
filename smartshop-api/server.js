const http = require('http');
const { createHandler } = require('./app');

const port = process.env.PORT || 3000;
http.createServer(createHandler()).listen(port, () => console.log(`smartshop-api listening on :${port}`));
