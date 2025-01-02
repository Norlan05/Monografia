// URL de la API para obtener todas las reservas
const apiUrl = "https://Clinica.somee.com/api/Select/GetReservas";

// Variable para almacenar la instancia de DataTable
let dataTable;

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

// Función para convertir la hora de 24 horas a 12 horas (con AM/PM)
function convertirHoraAMPM(hora) {
  let [h, m] = hora.split(":"); // Divide la hora y los minutos
  h = parseInt(h); // Convierte la hora a un número entero
  const ampm = h >= 12 ? "PM" : "AM"; // Determina si es AM o PM
  h = h % 12; // Convierte a formato de 12 horas
  h = h ? h : 12; // El 0 se convierte en 12
  m = m || "00"; // Si los minutos no están definidos, se ponen a 00
  return `${h}:${m} ${ampm}`; // Retorna la hora en formato 12 horas con AM/PM
}

// Función para mostrar las reservas en la tabla
function displayReservas(reservas) {
  const tableBody = document.querySelector("#reservas-table-body");
  tableBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

  // Verificar si hay reservas
  if (reservas.length > 0) {
    // Mapeamos las reservas para que cada reserva tenga los datos que vamos a mostrar
    const formattedReservas = reservas.map((reserva) => {
      return [
        reserva.nombre,
        reserva.apellido,
        reserva.cedula,
        reserva.correo_electronico,
        reserva.numero_telefono,
        reserva.fecha,
        convertirHoraAMPM(reserva.hora),
        reserva.estado,
        `<button class="btn btn-primary" onclick="actualizarEstado('${reserva.cedula}', 'Confirmado')">Confirmar</button>
         <button class="btn btn-danger" onclick="actualizarEstado('${reserva.cedula}', 'Rechazado')">Rechazar</button>`,
      ];
    });

    // Inicializar o actualizar DataTable
    if (!$.fn.dataTable.isDataTable("#dataTable")) {
      dataTable = $("#dataTable").DataTable({
        data: formattedReservas,
        columns: [
          { title: "Nombre" },
          { title: "Apellido" },
          { title: "Cedula" },
          { title: "Correo Electrónico" },
          { title: "Teléfono" },
          { title: "Fecha" },
          { title: "Hora" },
          { title: "Estado" },
          { title: "Acciones" },
        ],
        responsive: true,
        stateSave: true, // Mantener el estado de la tabla (como la paginación)
        order: [[5, "asc"]], // Ordenar por la columna 'Fecha' (índice 5) de forma ascendente
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
      });
    } else {
      // Si la tabla ya está inicializada, actualizamos sus datos
      dataTable.clear();
      dataTable.rows.add(formattedReservas); // Añadir nuevas filas
      dataTable.draw(); // Redibujar la tabla
    }
  } else {
    // Si no hay reservas, mostrar un mensaje
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="9" class="text-center">No hay reservas disponibles</td>`;
    tableBody.appendChild(row); // Añadir un mensaje si no hay reservas
  }
}

// Función para manejar la actualización del estado de la reserva
function actualizarEstado(cedula, estado) {
  console.log(`Reserva con cédula ${cedula} actualizada a estado: ${estado}`);
  // Aquí puedes realizar una solicitud al backend para actualizar el estado de la reserva
  fetch(`https://Clinica.somee.com/api/Update/ActualizarEstadoReserva`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cedula: cedula,
      estado: estado,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Estado actualizado:", data);
      fetchReservas(); // Vuelve a cargar las reservas después de la actualización
    })
    .catch((error) => {
      console.error("Error al actualizar el estado:", error);
    });
}

// Llamar a la función para obtener las reservas cuando se carga la página
window.onload = fetchReservas;

// Actualización automática de reservas cada 30 segundos
setInterval(fetchReservas, 30000);
