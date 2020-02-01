const express = require(`express`);

const server = express();
server.use(express.json());

//localhost:3000/users

const users = ['Raphael', 'Helen', 'Bernardo'];

// middleware global
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Method: ${req.method}, URL: ${req.url}`);
  next();
  console.timeEnd('Request');
});

function checkParamNameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is missing on the request'}); //bad requet
  }
  return next();
}

function checkUserExists(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: 'User does not exist'}); //bad requet
  }
  req.user = user;
  return next()
}

server.get('/users', (req, res) => {
  return res.json(users);
})

server.get('/users/:index', checkUserExists, (req, res) => {
  return res.json(req.user);
});

server.post('/users', checkParamNameExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
})

server.put('/users/:index', checkUserExists, checkParamNameExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
})

server.delete('/users/:index', checkUserExists, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
})

server.listen(3000);