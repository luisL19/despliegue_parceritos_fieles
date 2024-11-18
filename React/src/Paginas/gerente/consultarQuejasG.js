import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navBarGerente';
import Footer from '../../components/footer';
import './consultarQuejasG.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const ConsultarQuejasG = () => {
  const [quejas, setQuejas] = useState([]);
  const [mostrarQueja, setMostrarQueja] = useState(null);
  const [respuestas, setRespuestas] = useState({}); // Mantén el estado de las respuestas

  useEffect(() => {
    const fetchQuejas = async () => {
      try {
        const response = await axios.get('http://localhost:3002/Quejas/');
        // Invertir el orden de los registros para que el último registro sea el primero
        const data = response.data.reverse();
        setQuejas(data);
      } catch (error) {
        console.error('Error al obtener las quejas:', error);
      }
    };

    fetchQuejas();
  }, []);

  const toggleQueja = (index) => {
    setMostrarQueja(mostrarQueja === index ? null : index);
  };

  const handleRespuestaChange = (index, value) => {
    setRespuestas({ ...respuestas, [index]: value });
  };

  const enviarRespuesta = async (queja) => {
    try {
      // Aquí puedes hacer la llamada a la API para enviar la respuesta
      await axios.post(`http://localhost:3002/Quejas/${queja.id}/responder`, { respuesta: respuestas[queja.id] });
      
      // Muestra la notificación de éxito
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Respuesta enviada',
        showConfirmButton: false,
        timer: 1500
      });

      // Opcional: actualizar la lista de quejas para reflejar la nueva respuesta
      const nuevasQuejas = quejas.map(q => q.id === queja.id ? { ...q, respondida: true } : q);
      setQuejas(nuevasQuejas);
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
      // Muestra una notificación de error si es necesario
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al enviar respuesta',
        text: 'Hubo un problema al enviar la respuesta.',
        showConfirmButton: true
      });
    }
  };

  return (
    <div>
      <NavBar />
      <div className="consultarQuejasG-container">
        <h2>Quejas</h2>
        <p>Estas son las últimas quejas registradas en el sistema</p>
        <div className="consultarQuejasG-table-container">
          <table className="consultarQuejasG-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {quejas.map((queja, index) => (
                <React.Fragment key={queja.id}>
                  <tr>
                    <td>{queja.fecha}</td>
                    <td>{queja.hora}</td>
                    <td>{queja.nombre}</td>
                    <td>{queja.correo}</td>
                    <td>
                      <i
                        className={`fa-solid ${mostrarQueja === index ? 'fa-eye-slash' : 'fa-eye'} consultarQuejasG-icon`}
                        onClick={() => toggleQueja(index)}
                      />
                    </td>
                  </tr>
                  {mostrarQueja === index && (
                    <tr>
                      <td colSpan={5}>
                        <div className="consultarQuejasG-queja-content">
                          <p>{queja.texto}</p>
                          <div className="consultarQuejasG-response-section">
                            <textarea 
                              className="consultarQuejasG-textarea" 
                              placeholder="Escribe tu respuesta aquí..."
                              value={respuestas[queja.id] || ''}
                              onChange={(e) => handleRespuestaChange(queja.id, e.target.value)}
                            />
                            <button 
                              className="consultarQuejasG-button" 
                              onClick={() => enviarRespuesta(queja)}
                            >
                              Enviar Respuesta
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultarQuejasG;
