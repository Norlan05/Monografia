// js/check-session.js

// Al cargar la página, verificamos la sesión
if (sessionStorage.getItem("isLoggedIn") !== "true") {
  // Si no está logueado, redirigimos al 404
  window.location.href = "404.html";
}
