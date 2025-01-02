$(document).ready(function () {
  // Manejador de evento para el envío del formulario
  $("#search-patient-form").submit(function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    var searchCriteria = $("#search-criteria").val();
    var searchValue = $("#search-value").val();

    var apiUrl = "https://Clinica.somee.com/api/Select/Cedula"; // URL base

    // Si se selecciona la cédula o el correo, agregamos el parámetro necesario
    if (searchCriteria === "cedula") {
      apiUrl += "?cedula=" + searchValue;
    } else if (searchCriteria === "email") {
      apiUrl += "?correo_electronico=" + searchValue;
    }

    // Realizar la solicitud AJAX
    $.ajax({
      url: apiUrl,
      type: "GET",
      success: function (response) {
        console.log(response); // Verifica la respuesta para asegurarte de que los datos están llegando

        // Si la respuesta contiene datos y es un arreglo no vacío
        if (response && response.length > 0) {
          var paciente = response[0]; // Asumiendo que la respuesta contiene un array de pacientes

          // Asignamos los valores a los campos del formulario
          $("#paciente-nombre").val(paciente.Nombre_Completo);
          $("#paciente-cedula").val(paciente.Cedula);
          $("#paciente-email").val(paciente.correo_electronico);
          $("#paciente-telefono").val(paciente.numero_telefono);
          $("#paciente-fecha").val(paciente.fecha);
          $("#paciente-hora").val(paciente.hora);
        } else {
          // Si no se encuentran resultados, mostrar mensaje
          $("#search-message").text("No se encontraron resultados.");
        }
      },
      error: function (xhr, status, error) {
        // Manejar errores en la solicitud
        console.log(xhr.responseText); // Ver detalles del error
        $("#search-message").text("Hubo un error al buscar los datos.");
      },
    });
  });
});
