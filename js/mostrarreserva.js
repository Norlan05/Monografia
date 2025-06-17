// URL de la API para obtener todas las reservas
const apiUrl = "https://Clinica.somee.com/api/Select/GetReservas";
const apiUpdateUrl = "https://Clinica.somee.com/api/Update/Actualizar"; // Endpoint para actualizar el estado

let dataTable;

// Función para obtener las reservas desde la API
function fetchReservas() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((reservas) => {
      console.log("Reservas obtenidas:", reservas);
      // Filtrar solo pendientes y confirmadas
      const reservasFiltradas = reservas.filter(
        (r) => r.estado === "Pendiente" || r.estado === "Confirmada"
      );
      displayReservas(reservasFiltradas);
    })
    .catch((error) => {
      console.error("Error al obtener las reservas:", error);
    });
}

function convertirHoraAMPM(hora) {
  let [h, m] = hora.split(":"),
    ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m || "00"} ${ampm}`;
}

function displayReservas(reservas) {
  const tableBody = document.querySelector("#reservas-table-body");
  tableBody.innerHTML = "";

  if (reservas.length > 0) {
    const formattedReservas = reservas.map((reserva) => {
      const botonConfirmar = `<button class="btn btn-primary confirmar-btn" onclick="actualizar(this, '${reserva.id}', 'Confirmado', 2, '${reserva.nombre}', '${reserva.apellido}', '${reserva.correo_electronico}', '${reserva.numero_telefono}', '${reserva.cedula}', '${reserva.fecha}', '${reserva.hora}')">Confirmar</button>`;

      const botonCancelar = `<button class="btn btn-danger" onclick="actualizar(this, '${reserva.id}', 'Cancelado', 3, '${reserva.nombre}', '${reserva.apellido}', '${reserva.correo_electronico}', '${reserva.numero_telefono}', '${reserva.cedula}', '${reserva.fecha}', '${reserva.hora}')">Cancelar</button>`;

      return [
        reserva.nombre,
        reserva.apellido,
        reserva.cedula,
        reserva.correo_electronico,
        reserva.numero_telefono,
        reserva.fecha,
        convertirHoraAMPM(reserva.hora),
        reserva.estado,
        `${botonConfirmar} ${botonCancelar}`,
      ];
    });

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
        stateSave: true,
        order: [[5, "asc"]],
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
      dataTable.clear();
      dataTable.rows.add(formattedReservas);
      dataTable.draw();
    }
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="9" class="text-center">No hay reservas disponibles</td>`;
    tableBody.appendChild(row);
  }
}

// Actualizar estado de reserva con feedback visual y bloqueo de segundo clic
// Estado global para rastrear botones ya utilizados
const botonesUsados = new Set();

function actualizar(
  boton,
  id,
  estado,
  estado_id,
  nombre,
  apellido,
  correo_electronico,
  numero_telefono,
  cedula,
  fecha,
  hora
) {
  // Si ya se usó este botón (por ID de la reserva), no hacemos nada
  if (botonesUsados.has(id)) {
    Swal.fire({
      icon: "warning",
      title: "Ya confirmado",
      text: "Esta acción ya fue realizada.",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  // Lo marcamos como usado inmediatamente
  botonesUsados.add(id);
  boton.disabled = true;
  boton.classList.add("disabled");

  fetch(apiUpdateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      estado_id,
      descripcion: estado,
      nombre,
      apellido,
      correo_electronico,
      numero_telefono,
      cedula,
      fecha,
      hora,
    }),
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Error en la respuesta");
    })
    .then((data) => {
      Swal.fire({
        icon: estado === "Cancelado" ? "warning" : "success",
        title:
          estado === "Cancelado"
            ? "Cita cancelada correctamente"
            : "Cita confirmada exitosamente",
        showConfirmButton: false,
        timer: 2000,
      });

      fetchReservas(); // Refrescar tabla
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al actualizar la cita.",
      });
      // En caso de error, permitir nuevo intento
      botonesUsados.delete(id);
      boton.disabled = false;
      boton.classList.remove("disabled");
    });
}

window.onload = fetchReservas;
setInterval(fetchReservas, 30000);
