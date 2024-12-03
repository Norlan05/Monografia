document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Previene el envío del formulario

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validar formato del correo
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Swal.fire("Error", "Por favor, ingrese un correo válido.", "error");
      return;
    }

    if (password.trim() === "") {
      Swal.fire("Error", "Por favor, ingrese la contraseña.", "error");
      return;
    }

    // Muestra un mensaje de carga
    Swal.fire({
      title: "Iniciando sesión...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    authenticateUser(email, password);
  });

function authenticateUser(email, password) {
  const apiUrl = "http://Clinica.somee.com/api/Select/login";
  const timeoutDuration = 5000; // 5 segundos de tiempo de espera

  const controller = new AbortController(); // Crear controlador para cancelar solicitud
  const signal = controller.signal;

  // Configura el timeout para cancelar el fetch si se excede el tiempo
  const timeout = setTimeout(() => {
    controller.abort(); // Cancela la solicitud
    Swal.close();
    Swal.fire(
      "Error",
      "La solicitud tardó demasiado. Inténtelo de nuevo.",
      "error"
    );
  }, timeoutDuration);

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
    signal: signal,
  })
    .then((response) => {
      clearTimeout(timeout); // Cancela el timeout si la respuesta llega a tiempo
      return response.json();
    })
    .then((data) => {
      Swal.close(); // Cierra el mensaje de carga

      if (data.success || data === true) {
        // Redirige al index con el parámetro `myVar=true`
        window.location.href = "index.html?myVar=true";
      } else {
        Swal.fire("Error", "Usuario o contraseña incorrectos.", "error");
      }
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.error("La solicitud fue cancelada debido a timeout.");
      } else {
        console.error("Error al autenticar:", error);
        Swal.fire(
          "Error",
          "Hubo un error al intentar iniciar sesión. Intente de nuevo.",
          "error"
        );
      }
    });
}
