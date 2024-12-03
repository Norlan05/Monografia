document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Previene el envío del formulario

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    resetPassword(currentPassword, newPassword);
  });

function resetPassword(currentPassword, newPassword) {
  const apiUrl = "http://Clinica.somee.com/api/UpdatePassword"; // Reemplaza con la URL de tu API para actualizar la contraseña

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success || data === true) {
        Swal.fire(
          "Éxito",
          "Contraseña actualizada correctamente.",
          "success"
        ).then(() => {
          // Redirige al usuario al formulario de inicio de sesión
          window.location.href = "login.html";
        });
      } else {
        Swal.fire(
          "Error",
          "La contraseña actual no coincide. Intente nuevamente.",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error al cambiar la contraseña:", error);
      Swal.fire(
        "Error",
        "Hubo un error al intentar cambiar la contraseña. Intente de nuevo.",
        "error"
      );
    });
}
