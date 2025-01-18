// Selección del formulario de inicio de sesión
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevenir el envío predeterminado del formulario

    // Obtener los valores de los campos
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validar los campos antes de enviar la solicitud
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, ingresa ambos campos: correo y contraseña.",
      });
      return;
    }

    try {
      // Enviar la solicitud de inicio de sesión a la API
      const response = await fetch("https://Clinica.somee.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Mostrar mensaje de éxito si la respuesta es correcta
        Swal.fire({
          icon: "success",
          title: "¡Acceso correcto!",
          text: result.message,
          confirmButtonText: "Continuar",
        }).then(() => {
          // Redirigir a la página principal u otra según sea necesario
          window.location.href = "dashboard.html"; // Cambia esto a la URL correspondiente
        });
      } else {
        // Mostrar mensaje de error si la autenticación falla
        Swal.fire({
          icon: "error",
          title: result.status_error || "Error de inicio de sesión",
          text: result.error_text || "Valide sus credenciales nuevamente.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con la conexión. Por favor, intenta nuevamente.",
      });
      console.error("Error al intentar iniciar sesión:", error);
    }
  });
