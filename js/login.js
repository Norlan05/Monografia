document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      showAlert("Error", "Por favor, ingrese usuario y contraseña.", "error");
      return;
    }

    showLoading("Iniciando sesión...");
    authenticateUser(username, password);
  });

  function authenticateUser(username, password) {
    const apiUrl = "https://Clinica.somee.com/api/Auth/login";
    const timeoutDuration = 7000;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      showAlert(
        "Error",
        "La solicitud tardó demasiado. Inténtelo de nuevo.",
        "error"
      );
    }, timeoutDuration);

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Username: username, Password: password }),
      signal: controller.signal,
    })
      .then((response) => {
        clearTimeout(timeout);
        return response.json();
      })
      .then(handleResponse)
      .catch(handleError);
  }

  function handleResponse(data) {
    Swal.close();
    if (data.message === "Usuario autenticado con éxito") {
      window.location.href = "index.html?myVar=true";
    } else {
      showAlert("Error", "Usuario o contraseña incorrectos.", "error");
    }
  }

  function handleError(error) {
    if (error.name === "AbortError") {
      console.error("Solicitud cancelada por timeout.");
    } else {
      console.error("Error al autenticar:", error);
      showAlert(
        "Error",
        "Hubo un error al intentar iniciar sesión. Intente de nuevo.",
        "error"
      );
    }
  }

  function showAlert(title, text, icon) {
    Swal.fire(title, text, icon);
  }

  function showLoading(message) {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  }
});
