const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const auth = require('../auth/auth-router');
const expenses = require('../routes/expense-router');

const corsOption = {
  origin: '*',
  credentials: true,
}


const server = express();
server.use(helmet());
server.use(cors(corsOption));
server.use(express.json());


// server.all(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

server.use('/auth', auth, expenses);
// server.use('/', expenses)

server.get('/', (_, res) => {
  res.send("<h3>We're all good here! 💰 💰 💰</h3>");
});

module.exports = server;

// EOF