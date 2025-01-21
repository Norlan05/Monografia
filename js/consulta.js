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
      apiUrl = `https://Clinica.somee.com/api/Reservas/search?cedula=${searchValue}`;
    } else if (searchCriteria === "email") {
      apiUrl = `https://Clinica.somee.com/api/Reservas/search?correo=${searchValue}`;
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
        if (Array.isArray(data) && data.length > 0) {
          const paciente = data[0]; // Tomamos el primer paciente encontrado

          // Rellenar los campos del formulario con los datos del paciente
          document.getElementById("first-name").value =
            paciente.nombre_completo; // Nombre completo
          document.getElementById("cedula").value = paciente.cedula; // Cédula
          document.getElementById("email").value = paciente.correo_electronico; // Correo electrónico
          document.getElementById("phone").value = paciente.numero_telefono; // Teléfono
          document.getElementById("date").value = paciente.fecha; // Fecha de la cita (YYYY-MM-DD)
          document.getElementById("time").value = paciente.hora; // Hora de la cita (12h AM/PM)

          // Guardamos el ID de la reserva en un campo oculto o variable para usarlo después
          document.getElementById("paciente-id").value = paciente.id; // Guardamos el ID en un campo oculto
          console.log("ID de la reserva: ", paciente.id); // Puedes verificar en consola que se ha guardado correctamente

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
        ).innerHTML = `No hay reserva para el día de hoy`;
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
        document.getElementById("cedula").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("date").value = "";
        document.getElementById("time").value = "";
        document.getElementById("motivo-consulta").value = "";
        document.getElementById("diagnostico").value = "";
        document.getElementById("observaciones").value = "";
        document.getElementById("paciente-id").value = ""; // Limpiar el campo oculto

        // Limpiar cualquier mensaje
        document.getElementById("search-message").innerHTML = "";
      });
  });

// Realizar el registro de la consulta
document
  .getElementById("register-consultation-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener el ID de la reserva desde el campo oculto
    const reservaId = document.getElementById("paciente-id").value;
    const motivoConsulta = document.getElementById("motivo-consulta").value;
    const diagnostico = document.getElementById("diagnostico").value;
    const observaciones = document.getElementById("observaciones").value;

    // Crear el objeto que se va a enviar para la consulta
    const consultaData = {
      reservaID: reservaId,
      motivo_Consulta: motivoConsulta,
      diagnostico: diagnostico,
      observaciones: observaciones,
    };

    // Llamada a la API para insertar la consulta
    fetch("https://Clinica.somee.com/api/InsertPaciente/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consultaData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Verificar si la inserción fue exitosa
        console.log(data); // Verifica lo que contiene data
        if (data) {
          console.log("Consulta insertada con éxito:", data);
          Swal.fire({
            icon: "success",
            title: "Consulta registrada con éxito.",
            showConfirmButton: true,
            timer: 3000, // Opcional: el mensaje se cerrará automáticamente después de 3 segundos
          }).then(() => {
            // Limpiar los campos del formulario de datos del paciente después del éxito
            document.getElementById("first-name").value = "";
            document.getElementById("cedula").value = "";
            document.getElementById("email").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("date").value = "";
            document.getElementById("time").value = "";
            document.getElementById("motivo-consulta").value = "";
            document.getElementById("diagnostico").value = "";
            document.getElementById("observaciones").value = "";
            document.getElementById("paciente-id").value = ""; // Limpiar el campo oculto

            // Limpiar los campos de búsqueda
            document.getElementById("search-value").value = ""; // Limpiar el valor de búsqueda

            // Limpiar cualquier mensaje
            document.getElementById("search-message").innerHTML = "";
          });
        } else {
          console.log("Error al insertar la consulta:", data);
          Swal.fire({
            icon: "error",
            title: "Hubo un error al registrar la consulta.",
            text: "Por favor, intente nuevamente.",
            showConfirmButton: true,
            timer: 5000, // Opcional: el mensaje se cerrará automáticamente después de 5 segundos
          });
        }
      })
      .catch((error) => {
        console.error("Error al insertar la consulta:", error);
        Swal.fire({
          icon: "error",
          title: "Hubo un error al registrar la consulta.",
          text: "Por favor, intente nuevamente.",
          showConfirmButton: true,
          timer: 5000, // Opcional: el mensaje se cerrará automáticamente después de 5 segundos
        });
      });
  });
