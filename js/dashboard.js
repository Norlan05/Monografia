// Realizar la solicitud a la API
fetch("https://Clinica.somee.com/api/Dashboard")
  .then((response) => {
    // Verificar si la respuesta es exitosa (código 200)
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API: " + response.status);
    }
    return response.json();
  })
  .then((data) => {
    // Verificar si los datos necesarios están presentes
    if (
      data.totalPacientes !== undefined &&
      data.citasCanceladas !== undefined &&
      data.citasAtendidas !== undefined &&
      data.citasPendientes !== undefined
    ) {
      // Asignar los valores a los elementos correspondientes
      const totalPacientesElement = document.getElementById("totalPacientes");
      const citasCanceladasElement = document.getElementById("citasCanceladas");
      const citasAtendidasElement = document.getElementById("citasAtendidas");
      const citasPendientesElement = document.getElementById("citasPendientes");

      if (totalPacientesElement)
        totalPacientesElement.textContent = data.totalPacientes;
      if (citasCanceladasElement)
        citasCanceladasElement.textContent = data.citasCanceladas;
      if (citasAtendidasElement)
        citasAtendidasElement.textContent = data.citasAtendidas;
      if (citasPendientesElement)
        citasPendientesElement.textContent = data.citasPendientes;
    } else {
      throw new Error("Datos incompletos recibidos de la API.");
    }
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
    // Mostrar un mensaje de error en la interfaz de usuario
    const errorMessageElement = document.getElementById("error-message");
    if (errorMessageElement) {
      errorMessageElement.textContent =
        "Hubo un problema al cargar los datos. Intenta nuevamente más tarde.";
    }
  });

// Función para obtener las citas por mes desde la API
fetch("https://Clinica.somee.com/api/Citas/citasPorMes")
  .then((response) => response.json()) // Convertimos la respuesta a formato JSON
  .then((data) => {
    console.log(data); // Verifica los datos que recibimos

    // Extraemos los meses y las citas de la respuesta
    const labels = data.map((item) => item.mes); // Cambié 'Mes' a 'mes' según la respuesta de la API
    const citasData = data.map((item) => item.citas); // Cambié 'Citas' a 'citas' según la respuesta de la API

    if (labels.length === 0 || citasData.length === 0) {
      console.log("No hay datos para mostrar.");
      return;
    }

    // Configuración del gráfico de barras
    const ctx = document.getElementById("myBarChart").getContext("2d");
    new Chart(ctx, {
      type: "bar", // Tipo de gráfico (barras)
      data: {
        labels: labels, // Los nombres de los meses
        datasets: [
          {
            label: "Citas Confirmadas", // Etiqueta del gráfico
            data: citasData, // Los datos de citas por mes
            backgroundColor: "rgba(78, 115, 223, 0.5)", // Color de fondo de las barras
            borderColor: "rgba(78, 115, 223, 1)", // Color del borde de las barras
            borderWidth: 1, // Ancho del borde de las barras
          },
        ],
      },
      options: {
        responsive: true, // Hacer el gráfico responsive
        maintainAspectRatio: false, // Mantener el aspecto cuando se redimensiona
        scales: {
          x: {
            beginAtZero: true, // Comenzar desde el 0
            grid: {
              display: false, // No mostrar la cuadrícula del eje X
            },
          },
          y: {
            beginAtZero: true, // Comenzar desde el 0 en el eje Y
            grid: {
              color: "rgba(0, 0, 0, .125)", // Color de la cuadrícula en el eje Y
            },
            ticks: {
              stepSize: 1, // Paso entre las marcas en el eje Y
            },
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Color de fondo de las herramientas emergentes
            titleColor: "#fff", // Color del título de la herramienta emergente
            bodyColor: "#fff", // Color del cuerpo de la herramienta emergente
          },
          datalabels: {
            // Mostrar los números sobre las barras
            color: "white", // Color del texto de la etiqueta
            font: {
              weight: "bold", // Hacer el texto más grueso
              size: 14, // Tamaño de la fuente
            },
            anchor: "end", // Anclar la etiqueta al final de la barra
            align: "top", // Alinea la etiqueta en la parte superior de la barra
            formatter: (value) => value, // Formatear la etiqueta como el valor de citas
          },
        },
      },
    });
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error); // Manejo de errores
  });
