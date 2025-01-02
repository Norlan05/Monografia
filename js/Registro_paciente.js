document
  .getElementById("reservation-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Datos del formulario
    const data = {
      Nombre: document.getElementById("first-name").value,
      Apellido: document.getElementById("last-name").value,
      Correo_Electronico: document.getElementById("email").value,
      Cedula: document.getElementById("cedula").value,
      Telefono: document.getElementById("phone").value,
      Fecha_Nacimiento: document.getElementById("birth-date").value,
      Direccion: document.getElementById("direccion").value,
    };

    try {
      const response = await fetch(
        "https://clinica.somee.com/api/InsertPaciente",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        // Obtener el error como JSON
        const errorDetails = await response.json();
        throw new Error(errorDetails.error); // Usar el campo 'error' del JSON
      }

      const result = await response.json();
      Swal.fire("¡Éxito!", "Paciente registrado correctamente.", "success");
      document.getElementById("reservation-form").reset();
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire(
        "Error",
        "Ya existe un paciente con esta cédula o correo electrónico.",
        "error"
      );
    }
  });
