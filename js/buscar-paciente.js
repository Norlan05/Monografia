// Realizar la búsqueda del paciente por cédula o correo
document
  .getElementById("search-patient-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar el envío del formulario y la recarga de la página

    // Obtener los valores de los campos de búsqueda
    const searchCriteria = document.getElementById("search-criteria").value; // cédula o email
    const searchValue = document.getElementById("search-value").value; // Valor de búsqueda (cédula o email)

    // Construir la URL de la API en función del criterio de búsqueda
    let apiUrl = "";

    // Dependiendo del criterio de búsqueda, armamos la URL adecuada
    if (searchCriteria === "cedula") {
      apiUrl = `https://Clinica.somee.com/api/Buscar_pacientes_cs/search?cedula=${searchValue}`;
    } else if (searchCriteria === "email") {
      apiUrl = `https://Clinica.somee.com/api/Buscar_pacientes_cs/search?correo=${searchValue}`;
    }

    // Realizamos la llamada a la API usando fetch
    fetch(apiUrl)
      .then((response) => {
        // Comprobamos si la respuesta es un error 404 o algo similar
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        // Intentamos obtener el JSON si la respuesta es válida
        return response.json();
      })
      .then((data) => {
        // Verificar que `data` es un arreglo y tiene elementos
        console.log(data); // Imprimir toda la respuesta para verificar que contiene el ID
        if (Array.isArray(data) && data.length > 0) {
          const paciente = data[0]; // Tomamos el primer paciente encontrado

          // Rellenar los campos del formulario con los datos del paciente
          document.getElementById("first-name").value = paciente.nombre || ""; // Nombre
          document.getElementById("last-name").value = paciente.apellido || ""; // Apellido
          document.getElementById("email").value =
            paciente.correo_electronico || ""; // Correo electrónico
          document.getElementById("cedula").value = paciente.cedula || ""; // Cédula
          document.getElementById("phone").value = paciente.telefono || ""; // Teléfono
          document.getElementById("birth-date").value =
            paciente.fecha_Nacimiento || ""; // Fecha de nacimiento
          document.getElementById("direccion").value = paciente.direccion || ""; // Dirección

          // Asignar el ID del paciente al campo oculto
          document.getElementById("paciente-id").value =
            paciente.pacienteID || ""; // Guardar el ID del paciente

          // Limpiar cualquier mensaje previo
          document.getElementById("search-message").innerHTML = "";
        } else {
          // Si no hay resultados, mostrar el mensaje
          document.getElementById("search-message").innerHTML =
            "No se encontraron resultados.";
        }
      })
      .catch((error) => {
        // Si la respuesta no es válida o hay algún otro error, mostramos el mensaje
        console.error("Error al realizar la búsqueda:", error);
        document.getElementById(
          "search-message"
        ).innerHTML = `Paciente no encontrado. Registre al paciente.`;
      });
  });

// Evento para limpiar los campos de búsqueda y los datos del paciente
document
  .getElementById("clear-search-btn")
  .addEventListener("click", function () {
    // Limpiar los campos de búsqueda
    document.getElementById("search-criteria").value = "cedula"; // Opcional, reiniciar a "cedula" por defecto
    document.getElementById("search-value").value = "";

    // Limpiar los campos del formulario de datos del paciente
    document.getElementById("first-name").value = "";
    document.getElementById("last-name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("cedula").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("birth-date").value = "";
    document.getElementById("direccion").value = "";

    // Limpiar mensaje de búsqueda
    document.getElementById("search-message").innerHTML = "";
  });

// Realizar la actualización del paciente
document
  .getElementById("update-patient-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const form = document.getElementById("update-patient-form");
    const boton = form.querySelector('button[type="submit"]');
    // 🔒 Bloquear el botón al hacer clic
    boton.disabled = true;
    boton.innerText = "Procesando...";
    console.log("✅ Botón bloqueado:", boton.disabled);

    const pacienteId = document.getElementById("paciente-id").value;
    const pacienteData = {
      pacienteID: pacienteId,
      nombre: document.getElementById("first-name").value,
      apellido: document.getElementById("last-name").value,
      correo_electronico: document.getElementById("email").value,
      Telefono: document.getElementById("phone").value,
      Cedula: document.getElementById("cedula").value,
      Direccion: document.getElementById("direccion").value,
      Fecha_Nacimiento: document.getElementById("birth-date").value,
    };

    fetch("https://Clinica.somee.com/api/ActualizarPaciente/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pacienteData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        // Mostrar alerta de éxito con SweetAlert
        Swal.fire({
          icon: "success",
          title: "¡Paciente actualizado!",
          text: "Los datos del paciente se han actualizado correctamente.",
        });

        // Limpiar los campos del formulario después de la actualización
        document.getElementById("update-patient-form").reset(); // Limpiar los campos del formulario
        document.getElementById("search-patient-form").reset(); // Limpiar los campos del formulario de búsqueda

        // Limpiar mensaje de búsqueda
        document.getElementById("search-message").innerHTML = "";
      })
      .catch((error) => {
        console.error("Error al actualizar el paciente:", error);
        Swal.fire({
          icon: "error",
          title: "¡Hubo un problema!",
          text: "No se pudo actualizar el paciente. Intente nuevamente.",
        });
      })
      .finally(() => {
        // 🔓 Desbloquear el botón siempre al terminar
        boton.disabled = false;
        boton.innerText = "Guardar Cambios";
        console.log("🔓 Botón desbloqueado:", boton.disabled);
      });
  });
