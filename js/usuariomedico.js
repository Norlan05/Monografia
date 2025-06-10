document
  .getElementById("form-agregar-usuario")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Evita que se recargue la página

    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value.trim();

    // Crear el objeto con los datos
    const data = {
      username: nombre,
      email: correo,
      password: clave,
    };

    try {
      // Enviar los datos al backend
      const response = await fetch(
        "https://Clinica.somee.com/api/Auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      // Mostrar mensaje según la respuesta
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Usuario registrado",
          text: result.message,
        });
        document.getElementById("form-agregar-usuario").reset(); // Limpiar formulario
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "No se pudo registrar el usuario",
        });
      }
    } catch (error) {
      // Error de conexión o del servidor
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
      console.error("Error:", error);
    }
  });
