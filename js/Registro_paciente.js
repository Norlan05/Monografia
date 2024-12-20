document
  .getElementById("reservation-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    // Capturar los valores del formulario
    const nombre = document.getElementById("first-name").value;
    const apellido = document.getElementById("last-name").value;
    const correoElectronico = document.getElementById("email").value;
    const telefono = document.getElementById("phone").value;
    const cedula = document.getElementById("cedula").value;
    const direccion = document.getElementById("direccion").value;
    const fechaNacimiento = document.getElementById("birth-date").value;

    // Validar los campos aquí si es necesario...

    // Construir el objeto para enviar
    const data = {
      nombre: nombre,
      apellido: apellido,
      correo_Electronico: correoElectronico,
      telefono: telefono,
      cedula: cedula,
      direccion: direccion,
      fecha_Nacimiento: fechaNacimiento,
    };

    // Enviar los datos al backend usando fetch
    fetch("https://clinica.somee.com/api/InsertPaciente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convertir el objeto a JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al registrar el paciente");
        }
        return response.json();
      })
      .then((result) => {
        // Mostrar el resultado en el mensaje
        document.getElementById("message").innerHTML =
          '<div class="alert alert-success">Paciente registrado con éxito</div>';
        console.log("Paciente registrado:", result);
      })
      .catch((error) => {
        // Mostrar el error en el mensaje
        document.getElementById("message").innerHTML =
          '<div class="alert alert-danger">Hubo un error al registrar el paciente</div>';
        console.error("Error:", error);
      });
  });
