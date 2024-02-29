$(document).ready(function () {
  var ctx1 = document.getElementById("sensorUltrasonico").getContext("2d");
  var chart1 = new Chart(ctx1, {
    type: "line", // Tipo de gráfica
    data: {
      labels: [], // Las etiquetas de tiempo
      datasets: [
        {
          label: "Sensor Ultrasonico",
          backgroundColor: "rgb(51, 141, 255)",
          borderColor: "rgb(93, 164, 255)",
          data: [], // Los datos del sensor
        },
      ],
    },
    options: {},
  })})

websocket.onmessage = (event) => {
  const [ledState, distanciaStr] = event.data.split(" ");
  const toggleBtn = document.getElementById("toggleBtn");

  if (ledState === "1") {
    toggleBtn.checked = true;
    console.log("Estado inicial del LED recibido:", ledState);

    // Iniciar actualizaciones periódicas mientras ledState sea 1
    updatePeriodically();
  } else {
    toggleBtn.checked = false;
    // Detener las actualizaciones periódicas si ledState es 0
    clearTimeout(updateInterval);
  }
};

let updateInterval;

function updatePeriodically() {
  updateInterval = setTimeout(() => {
    // Obtener la última distancia
    const distancia = parseInt(distanciaStr);
    let mensaje;
    if (distancia <= 10) {
      mensaje = "V";
    } else if (distancia <= 30) {
      mensaje = "A";
    } else {
      mensaje = "R";
    }

    // Agregar los datos al principio de dataArray
    dataArray.unshift({ mensaje: mensaje, dato_sensor: distancia });

    // Actualizar la gráfica y los LED
    updateChartAndLEDs();

    // Volver a llamar a la función para continuar las actualizaciones periódicas
    updatePeriodically();
  }, 1000); // Actualizar cada segundo (puedes ajustar el intervalo según tus necesidades)
}

function updateChartAndLEDs() {
  let labels = [];
  let sensorData = [];

  dataArray.forEach(function (obj) {
    labels.push(obj.mensaje);
    sensorData.push(obj.dato_sensor);
  });

  chart1.data.labels = labels;
  chart1.data.datasets[0].data = sensorData;
  chart1.update();

  // Cambiar los LED basados en el último color
  const lastColor = dataArray[0].mensaje;
  const led1 = document.getElementById("led1");
  const led2 = document.getElementById("led2");
  const led3 = document.getElementById("led3");

  if (lastColor === "R") {
    led1.src = "img/VERDE-OFF.svg";
    led2.src = "img/AMARILLO-OFF.svg";
    led3.src = "img/ROJO-ON.svg";
  } else if (lastColor === "A") {
    led1.src = "img/VERDE-OFF.svg";
    led2.src = "img/AMARILLO-ON.svg";
    led3.src = "img/ROJO-OFF.svg";
  } else if (lastColor === "V") {
    led1.src = "img/VERDE-ON.svg";
    led2.src = "img/AMARILLO-OFF.svg";
    led3.src = "img/ROJO-OFF.svg";
  }
}
