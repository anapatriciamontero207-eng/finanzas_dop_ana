const API_KEY = "c17810eb53fd1e5b7e29c648";

const container = document.getElementById("cardsContainer");
const input = document.getElementById("amount");

const monedas = [
  "USD","EUR","GBP","JPY","CNY","AUD",
  "CAD","CHF","MXN","BRL","INR","KRW"
];

let rates = {};

async function cargarDatos() {
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/DOP`);
    const data = await res.json();

    console.log("API:", data);

    if (data.result === "success") {
      rates = data.conversion_rates;
    } else {
      throw new Error("API falló");
    }

  } catch (error) {
    console.error("Usando datos de respaldo:", error);

    // 🔥 DATOS DE RESPALDO (MUY IMPORTANTE)
    rates = {
      USD: 0.017,
      EUR: 0.015,
      GBP: 0.013,
      JPY: 2.6,
      CNY: 0.12,
      AUD: 0.026,
      CAD: 0.023,
      CHF: 0.016,
      MXN: 0.29,
      BRL: 0.085,
      INR: 1.4,
      KRW: 22
    };
  }

  renderCards();
}

function renderCards() {
  container.innerHTML = "";

  monedas.forEach(moneda => {
    const tasa = rates[moneda];

    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card-cyber">
        <h5>${moneda}</h5>
        <p>Tasa: ${tasa}</p>
        <p class="result">0</p>
        <div id="chart-${moneda}"></div>
      </div>
    `;

    container.appendChild(col);

    crearGrafico(moneda);
  });
}

function crearGrafico(moneda) {
  const opciones = {
    chart: { type: 'line', height: 150 },
    series: [{
      name: moneda,
      data: generarFakeData()
    }],
    xaxis: {
      categories: ["Ene","Feb","Mar","Abr","May","Jun"]
    }
  };

  new ApexCharts(
    document.querySelector(`#chart-${moneda}`),
    opciones
  ).render();
}

// Simulación de tendencia 
function generarFakeData() {
  return Array.from({length: 6}, () =>
    Math.floor(Math.random() * 100)
  );
}

// Calculadora
input.addEventListener("input", () => {
  const valor = input.value;

  document.querySelectorAll(".card-cyber").forEach((card, i) => {
    const moneda = monedas[i];
    const resultado = valor * rates[moneda];

    card.querySelector(".result").innerText =
      resultado.toFixed(2);
  });
});

cargarDatos();