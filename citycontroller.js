// citycontroller.js

let cidades = [];

const axios = require('axios');

const apiKey = '02823b2eb3519464225952be5a1188e9';

const obterTodasCidades = (req, res) => {
  res.json(cidades);
};

const adicionarCidade = async (req, res) => {
  const { nomeCidade } = req.body;

  try {
    const resposta = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${nomeCidade}&appid=${apiKey}`);
    const cidadeData = resposta.data;
    cidades.push(cidadeData);
    res.json(cidadeData);
  } catch (error) {
    res.status(400).send('Cidade não encontrada.');
  }
};

const excluirCidade = (req, res) => {
  const { id } = req.params;
  cidades = cidades.filter((city, index) => index !== parseInt(id));
  res.send('Cidade excluída com sucesso.');
};

module.exports = {
  obterTodasCidades,
  adicionarCidade,
  excluirCidade,
};
