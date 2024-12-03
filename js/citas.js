document.addEventListener("DOMContentLoaded", function () {
  // Usamos Fetch para hacer una solicitud al servidor y obtener las citas
  fetch("http://Clinica.somee.com/api/citas-del-dia") // Asegúrate de que este endpoint esté disponible
    .then((response) => response.json())
    .then((data) => {
      const citasBody = document.getElementById("citasBody");

      // Asegúrate de que la respuesta del servidor contiene las citas correctas
      if (!data || data.length === 0) {
        console.error(
          "No se encontraron citas o la API no respondió correctamente."
        );
        return;
      }

      data.forEach((cita) => {
        const row = document.createElement("tr");

        // Crear celdas con los datos de la cita
        const nombreCell = document.createElement("td");
        nombreCell.textContent = cita.nombre;
        row.appendChild(nombreCell);

        const apellidoCell = document.createElement("td");
        apellidoCell.textContent = cita.apellido;
        row.appendChild(apellidoCell);

        const correoCell = document.createElement("td");
        correoCell.textContent = cita.correo_electronico;
        row.appendChild(correoCell);

        const telefonoCell = document.createElement("td");
        telefonoCell.textContent = cita.numero_telefono;
        row.appendChild(telefonoCell);

        const fechaCitaCell = document.createElement("td");
        fechaCitaCell.textContent = new Date(
          cita.fecha_hora
        ).toLocaleDateString();
        row.appendChild(fechaCitaCell);

        const horaCitaCell = document.createElement("td");
        horaCitaCell.textContent = new Date(
          cita.fecha_hora
        ).toLocaleTimeString();
        row.appendChild(horaCitaCell);

        const estadoCell = document.createElement("td");
        estadoCell.textContent = cita.estado;
        row.appendChild(estadoCell);

        // Columna para el botón de acción
        const accionesCell = document.createElement("td");
        const button = document.createElement("button");
        button.classList.add("btn", "btn-primary");
        button.textContent = getButtonText(cita.estado); // Asignar el texto adecuado al botón
        button.setAttribute("data-id", cita.id); // Asignamos el ID de la cita al botón
        button.addEventListener("click", function () {
          cambiarEstadoCita(cita.id, cita.estado, estadoCell, button);
        });
        accionesCell.appendChild(button);
        row.appendChild(accionesCell);

        citasBody.appendChild(row); // Añadir la fila al cuerpo de la tabla
      });
    })
    .catch((error) => {
      console.error("Error al cargar las citas:", error);
    });
});

// Función para determinar el texto del botón según el estado de la cita
function getButtonText(estado) {
  switch (estado) {
    case "Pendiente":
      return "Confirmar";
    case "Confirmada":
      return "Realizar";
    case "Realizada":
      return "Cancelar";
    case "Cancelada":
      return "Reactivar";
    default:
      return "Cambiar Estado";
  }
}

// Función para manejar el cambio de estado de la cita
function cambiarEstadoCita(citaId, estadoActual, estadoCell, button) {
  let nuevoEstado;
  switch (estadoActual) {
    case "Pendiente":
      nuevoEstado = "Confirmada";
      break;
    case "Confirmada":
      nuevoEstado = "Realizada";
      break;
    case "Realizada":
      nuevoEstado = "Cancelada";
      break;
    case "Cancelada":
      nuevoEstado = "Pendiente"; // O puedes decidir qué hacer aquí
      break;
    default:
      nuevoEstado = "Pendiente";
      break;
  }

  // Llamar a la API para actualizar el estado en la base de datos
  fetch("http://Clinica.somee.com/api/cambiar-estado-cita", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: citaId, estado: nuevoEstado }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        estadoCell.textContent = nuevoEstado; // Actualizar el estado en la tabla
        button.textContent = getButtonText(nuevoEstado); // Actualizar el texto del botón
      } else {
        alert("Error al actualizar el estado.");
      }
    })
    .catch((error) => {
      console.error("Error al cambiar el estado:", error);
    });
}
