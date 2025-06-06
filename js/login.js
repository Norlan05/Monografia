document.addEventListener("DOMContentLoaded", function () {
  // Obtener los elementos del formulario
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Obtener el formulario y agregar el evento de envío
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir el envío tradicional del formulario

    // Validación básica de los campos
    if (emailInput.value === "" || passwordInput.value === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    // Validación de email (usando una expresión regular)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(emailInput.value)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor ingrese un correo electrónico válido.",
      });
      return;
    }

    // Enviar los datos del formulario a la API
    fetch("https://Clinica.somee.com/api/Auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Asegura que los datos sean enviados como JSON
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Imprimir la respuesta para depuración

        // Comprobar si la respuesta tiene el mensaje de acceso correcto
        if (data.message === "Acceso correcto") {
          // ✅ Guardar que la sesión está iniciada
          sessionStorage.setItem("isLoggedIn", "true");

          // ✅ Guardar el email del usuario
          sessionStorage.setItem("userEmail", emailInput.value);

          Swal.fire({
            icon: "success",
            title: "¡Bienvenido!",
            text: "Acceso exitoso.",
          }).then(() => {
            // Redirigir a la página principal o dashboard
            window.location.href = "index.html"; // Cambia la URL según tu ruta
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Credenciales inválidas.",
          });
        }
      })
      .catch((error) => {
        // Capturar errores en la solicitud
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al procesar la solicitud. Intenta nuevamente.",
        });
      });
  });
});
