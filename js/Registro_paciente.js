document
  .getElementById("reservation-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = document.getElementById("reservation-form");
    const boton = form.querySelector('button[type="submit"]');

    // 🔒 Bloquear el botón al enviar
    boton.disabled = true;
    boton.innerText = "Procesando...";
    console.log("✅ Botón bloqueado:", boton.disabled);

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
        "https://clinica.somee.com/api/InsertarPaciente",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        // Manejo seguro si el JSON está vacío o mal formado
        let errorDetails = {};
        try {
          const text = await response.text();
          errorDetails = text
            ? JSON.parse(text)
            : { error: "Error desconocido" };
        } catch (e) {
          console.warn("⚠️ No se pudo parsear JSON del error:", e);
          errorDetails = { error: "Error desconocido" };
        }
        throw new Error(errorDetails.error);
      }

      const resultText = await response.text();
      let result = {};
      try {
        result = resultText ? JSON.parse(resultText) : {};
      } catch {
        result = {};
      }

      Swal.fire("¡Éxito!", "Paciente registrado correctamente.", "success");
      form.reset();
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire(
        "Error",
        "Ya existe un paciente con esta cédula o correo electrónico.",
        "error"
      );
    } finally {
      // 🔓 Volver a habilitar el botón
      boton.disabled = false;
      boton.innerText = "Registrar Paciente";
      console.log("🔓 Botón desbloqueado:", boton.disabled);
    }
  });
