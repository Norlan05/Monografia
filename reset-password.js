document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetPasswordForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.email.value.trim();

    if (!email) {
      Swal.fire(
        "Error",
        "Por favor, ingresa un correo electrónico válido.",
        "error"
      );
      return;
    }

    Swal.fire({
      title: "Enviando solicitud...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    fetch("https://Clinica.somee.com/api/Auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.close();
        if (data.success) {
          Swal.fire(
            "Éxito",
            "Revisa tu correo para restablecer la contraseña.",
            "success"
          );
        } else {
          Swal.fire(
            "Error",
            data.message || "No se pudo enviar el enlace de recuperación.",
            "error"
          );
        }
      })
      .catch((error) => {
        Swal.close();
        Swal.fire("Error", "Ocurrió un error. Inténtalo más tarde.", "error");
      });
  });
});
