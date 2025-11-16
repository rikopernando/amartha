const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db-step2.json'));
const middlewares = jsonServer.defaults({
  static: './public',
});

// Enable CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 4002;
server.listen(PORT, () => {
  console.log(`JSON Server (Step 2) is running on port ${PORT}`);
});
