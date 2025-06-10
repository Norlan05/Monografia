document.addEventListener("DOMContentLoaded", () => {
  fetch("https://Clinica.somee.com/api/Usuarios")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("usuarios-table-body");
      tbody.innerHTML = ""; // Limpia antes de llenar

      data.forEach((usuario) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${usuario.username}</td>
          <td>${usuario.email}</td>
          <td>${usuario.password}</td>
        `;
        tbody.appendChild(fila);
      });

      // Asegurar que la tabla existe antes de aplicar DataTables
      if ($.fn.DataTable.isDataTable("#usuariosTable")) {
        $("#usuariosTable").DataTable().destroy();
      }

      // Activar DataTables con traducción y paginación
      $("#usuariosTable").DataTable({
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        language: {
          url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
        },
      });
    })
    .catch((error) => {
      console.error("Error al cargar usuarios:", error);
    });
});
