//server.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 4000;

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

app.use(express.static(__dirname));

app.use(session({ 
  secret: '1111111122222222222333333333334444444abcd', 
  resave: true, 
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 3600000, path: '/' },
}));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql14ed',
  database: 'prog3',
});


const cityController = require('./cityController');


app.post('/register', async (req, res) => {
  const { nome_usuario, senha } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);
  
  
  db.query('INSERT INTO usuarios (nome, senha) VALUES (?, ?)', [nome_usuario, hashedPassword], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error registering user.');
    } else {
      res.send('User registered successfully.');
    }
  });
});


app.post('/login', async (req, res) => {
  const { nome_usuario, senha } = req.body;
  db.query('SELECT * FROM usuarios WHERE nome = ?', [nome_usuario], async (err, results) => {
    if (err) {
      res.status(500).send('Error logging in.');
    } else if (results.length > 0) {
      const match = await bcrypt.compare(senha, results[0].senha);
      if (match) {
        req.session.user = results;
        res.send('Login successful.');
      } else {
        res.status(401).send('Senha incorreta.');
      }
    } else {
      res.status(404).send('User not found.');
    }
  });
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logout successful.');
});

app.get('/cidades', cityController.obterTodasCidades);
app.post('/cidades', cityController.adicionarCidade);
app.delete('/cidades/:id', cityController.excluirCidade);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
