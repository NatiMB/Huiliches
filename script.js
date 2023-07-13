$(document).ready(function() {
    $('#consultaForm').submit(function(event) {
      event.preventDefault(); // Evita que se envíe el formulario de forma predeterminada
  
      var dni = $('#dni').val(); // Obtiene el valor del campo DNI
  
      $.ajax({
        url: 'https://natimartinez.pythonanywhere.com/personas/' + dni, // URL de la API en PythonAnywhere
        type: 'GET',
        success: function(response) {
          // Manipula la respuesta de la API (response)
          if (response.error) {
            mostrarError('El DNI proporcionado no coincide con ninguna reserva');
          } else {
            mostrarResultados(response);
          }
        },
        error: function(xhr, textStatus, errorThrown) {
          // Maneja el error de la solicitud AJAX
          mostrarError('Error en la consulta');
        }
      });
    });
  
    function mostrarResultados(resultados) {
      // Borra los resultados anteriores, si los hay
      $('#resultados').empty();
    
      // Muestra la información de la persona
      var persona = resultados.persona;
      var personaHtml = '<div class="card">' +
                        '<h2>Información personal:</h2>' +
                        '<p>Nombre: ' + persona.nombre + '</p>' +
                        '<p>Apellido: ' + persona.apellido + '</p>' +
                        '<p>Teléfono: ' + persona.tel + '</p>' +
                        '<p>Hotel: ' + persona.hotel + '</p>' +
                        '<p>Cantidad de pasajeros: ' + persona.pax + '</p>' +
                        '</div>';
      $('#resultados').append(personaHtml);
    
      // Muestra las excursiones
      var excursiones = resultados.excursiones;
      var excursionesHtml = '<div class="card">' +
                            '<h2>Excursiones:</h2><ul>';
      for (var i = 0; i < excursiones.length; i++) {
        var excursion = excursiones[i];
        var fechaHora = moment(excursion.fecha_hora).format('DD/MM/YYYY, HH:mm'); // Formatear fecha
        var excursionHtml = '<li>' +
                            '<p>' + excursion.excursion + '</p>' +
                            '<p>Fecha: ' + fechaHora + '</p>' +
                            '<p>x' + excursion.cantidad_pasajeros + '</p>' +
                            '</li>';
        excursionesHtml += excursionHtml;
      }
      excursionesHtml += '</ul></div>';
      $('#resultados').append(excursionesHtml);
    
      // Muestra los transfers
      var transfers = resultados.transfers;
      var transfersHtml = '<div class="card">' +
                          '<h2>Transfers:</h2><ul>';
    
      for (var j = 0; j < transfers.length; j++) {
        var transfer = transfers[j];
        var transferListHtml = '<li>';
    
        if (transfer.vuelo_in && transfer.fechayhora_in) {
          var fechaHoraIn = moment(transfer.fechayhora_in).format('DD/MM/YYYY, HH:mm'); // Formatear fecha
          transferListHtml += 'Del aeropuerto al hotel - ' + fechaHoraIn;
        }
    
        if (transfer.vuelo_out && transfer.fechayhora_out) {
          var fechaHoraOut = moment(transfer.fechayhora_out).format('DD/MM/YYYY, HH:mm'); // Formatear fecha
          transferListHtml += '</li><li>Del hotel al aeropuerto - ' + fechaHoraOut;
        }
    
        transfersHtml += transferListHtml;
      }
    
      transfersHtml += '</li></ul></div>';
      $('#resultados').append(transfersHtml);
    }
    
  
    function mostrarError(errorMessage) {
      // Borra los resultados anteriores, si los hay
      $('#resultados').empty();
  
      // Muestra el mensaje de error
      var errorHtml = '<div class="card">' +
                      '<p>' + errorMessage + '</p>' +
                      '</div>';
      $('#resultados').append(errorHtml);
    }
  });
  