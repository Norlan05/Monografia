const apiUrl = "http://Clinica.somee.com/api/select/GetAllReservations"; // Cambia esto a la URL de tu API

let dataTable; // Variable para almacenar la instancia de DataTable

// Función para obtener las reservas desde la API
function fetchReservas() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((reservas) => {
      console.log("Reservas obtenidas:", reservas); // Verifica los datos obtenidos
      displayReservas(reservas);
    })
    .catch((error) => {
      console.error("Error al obtener las reservas:", error);
    });
}

// Función para separar la fecha y hora
function separarFechaHora(fechaHora) {
  const fecha = new Date(fechaHora); // Convierte el string en un objeto Date
  const opcionesFecha = { year: "numeric", month: "2-digit", day: "2-digit" };
  const opcionesHora = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  // Obtiene la fecha y la hora con el formato adecuado
  const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha); // Formato: "dd/mm/yyyy"
  const horaFormateada = fecha.toLocaleTimeString("es-ES", opcionesHora); // Formato: "hh:mm:ss"

  // Convertir la hora a segundos desde medianoche para ordenarla correctamente
  const seconds =
    fecha.getHours() * 3600 + fecha.getMinutes() * 60 + fecha.getSeconds();

  return {
    fecha: fechaFormateada,
    hora: horaFormateada,
    rawDate: fecha,
    seconds,
  }; // Devolver los segundos para la ordenación
}

// Función para mostrar las reservas en la tabla
function displayReservas(reservas) {
  const tableBody = document.querySelector("#reservas-table-body");
  tableBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

  // Obtener la fecha actual (sin hora para la comparación)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00 para comparar solo la fecha

  // Filtrar las reservas para que solo se muestren las fechas desde hoy en adelante
  const reservasFiltradas = reservas.filter((reserva) => {
    const { rawDate } = separarFechaHora(reserva.fecha_hora);
    return rawDate >= today; // Solo mostrar reservas desde hoy en adelante
  });

  // Verificar si hay reservas
  if (reservasFiltradas.length > 0) {
    const formattedReservas = reservasFiltradas.map((reserva) => {
      const { fecha, hora, seconds } = separarFechaHora(reserva.fecha_hora); // Separar fecha, hora y segundos
      return [
        reserva.nombre,
        reserva.apellido,
        reserva.correo_electronico,
        reserva.numero_telefono,
        fecha,
        hora,
        seconds, // Agregar los segundos para la ordenación
      ]; // Cada subarreglo tiene 7 elementos (incluyendo 'seconds' para ordenación)
    });

    // Inicializar o actualizar DataTable
    if (!$.fn.dataTable.isDataTable("#dataTable")) {
      dataTable = $("#dataTable").DataTable({
        data: formattedReservas, // Los datos mapeados correctamente
        columns: [
          { title: "Nombre" },
          { title: "Apellido" },
          { title: "Correo Electrónico" },
          { title: "Teléfono" },
          { title: "Fecha" },
          { title: "Hora" },
        ], // Define explícitamente las columnas
        responsive: true,
        stateSave: true, // Mantener el estado de la tabla (como la paginación)
        order: [[6, "asc"]], // Ordenar por la columna 'seconds' (índice 6) de forma ascendente
        language: {
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ entradas",
          info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
          infoEmpty: "No hay datos disponibles",
          paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior",
          },
        },
        columnDefs: [
          {
            targets: 6, // Columna 'seconds'
            visible: false, // Hacer que la columna de segundos no sea visible
          },
        ],
      });
    } else {
      dataTable.clear(); // Limpiar la tabla
      dataTable.rows.add(formattedReservas); // Agregar nuevas filas
      dataTable.draw(); // Redibujar la tabla
    }
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6">No hay reservas disponibles</td>`;
    tableBody.appendChild(row); // Añadir un mensaje si no hay reservas
  }
}

// Llamar a la función para obtener las reservas cuando se carga la página
window.onload = fetchReservas;

// Actualización automática de reservas cada 3 segundos
setInterval(fetchReservas, 30000);
