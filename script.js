// script.js

function traduzirDescricaoTempo(descricao) {
  const traducoes = {
    'clear sky': 'céu limpo',
    'few clouds': 'poucas nuvens',
    'scattered clouds': 'nuvens dispersas',
    'broken clouds': 'nuvens quebradas',
    'shower rain': 'chuva passageira',
    'rain': 'chuva',
    'thunderstorm': 'tempestade',
    'snow': 'neve',
    'mist': 'névoa',
    'thunderstorm with heavy rain': 'tempestade com muita chuva',
    'overcast clouds': 'nublado',
    'moderate rain': 'chuva moderada',
    'light rain' : 'chuva fraca',
  };

  return traducoes[descricao] || descricao;
}

function traduzirVelocidadeVento(velocidade) {
   velocidade = velocidade * 3.6;
  return `${velocidade.toFixed(2)} km/h`;
}

async function registrar() {
  const nome_usuario = document.getElementById('nomeregistro').value;
  const senha = document.getElementById('senharegistro').value;
  await fetch('http://localhost:4000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome_usuario, senha }),
  });
  
  document.getElementById('secaoRegistro').style.display = 'none';
}

async function login() {
  const nome_usuario = document.getElementById('nomelogin').value;
  const senha = document.getElementById('senhalogin').value;
  const resposta = await fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome_usuario, senha }),
  });

  const mensagemaposlogin = document.getElementById('mensagemaposlogin');

  if (resposta.ok) {
    
    document.cookie = 'token=' + resposta.headers.get('Authorization');
    
    document.getElementById('secaoLogin').style.display = 'none';
    document.getElementById('secaoRegistro').style.display = 'none';
    document.getElementById('selecao').style.display = 'block';

    mensagemaposlogin.innerHTML = '<div class="success">Login bem-sucedido.</div>';
    mensagemaposlogin.style.color = 'green';

    fetchData();
    }else {
      mensagemaposlogin.innerHTML = '<div class="error">Erro no login. Verifique suas credenciais.</div>';
      mensagemaposlogin.style.color = 'red';
    }
  
}

async function logout() {
  await fetch('http://localhost:4000/logout');
  fetchData();
}

async function fetchData() {
  try {
    const resposta = await fetch('http://localhost:4000/cidades');
    if (!resposta.ok) {
      throw new Error('Não foi possível obter os dados da cidade.');
    }
    const cidades = await resposta.json();

    const cidadesContainer = document.getElementById('cidades');
    if (!cidadesContainer) {
      console.error('Cidades container nao encontrado.');
      return;
    }
    
    cidadesContainer.innerHTML = '';
    
    if (cidades.length === 0) {
      const messageDiv = document.createElement('div');
      // messageDiv.textContent = 'Nenhuma cidade encontrada.';
      cidadesContainer.appendChild(messageDiv);
    } else {
    cidades.forEach((city, index) => {
      const temperaturaCelsius = city.main.temp - 273.15;
      const velocidadeVento = traduzirVelocidadeVento(city.wind.speed);
      const descricaoClima = traduzirDescricaoTempo(city.weather[0].description);
      const umidade = city.main.humidity;

      const cityDiv = document.createElement('div');
      cityDiv.classList.add('cidade-container');
      cityDiv.innerHTML = `
        <div class="cidade-container" id="city-${index}">
        <p>${city.name}, ${city.sys.country}</p>
        <p>Temperatura: ${temperaturaCelsius.toFixed(2)} °C</p>
        <p>Velocidade do Vento: ${velocidadeVento}</p>
        <p>Umidade: ${umidade}%</p>
        <p>Tempo: ${descricaoClima}</p>
        <button onclick="excluirCidade(${index})">Excluir</button>
        <hr>
      </div>
      `;
      cidadesContainer.appendChild(cityDiv);
            });
          }
  } catch (error) {
    console.error('Erro ao obter dados da cidade:', error);
  }
}


function abrirModalCidade() {
  document.getElementById('modalCidade').style.display = 'block';
}

function fecharModalCidade() {
  document.getElementById('modalCidade').style.display = 'none';
}

async function adicionarCidade() {
  const nomeCidade = document.getElementById('nomeCidade').value;
  if (nomeCidade) {
    await fetch('http://localhost:4000/cidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nomeCidade })
    });
    fecharModalCidade();
    fetchData();
  }
}

async function excluirCidade(index) {
  await fetch(`http://localhost:4000/cidades/${index}`, {
    method: 'DELETE'
  });
  fetchData();
}

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});
