import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border-bottom: 2px solid #ddd;
  padding: 12px;
  background-color: #f4f4f4;
`;

const Td = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 12px;
`;

const Button = styled.button`
  background-color: ${(props) => (props.primary ? '#24ad60' : '#0d793c')};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.primary ? '#0d793c' : '#218838')};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
  resize: vertical;
  margin-bottom: 10px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const QuejaContent = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ResponseSection = styled.div`
  margin-top: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;

  label {
    display: flex;
    flex-direction: column;
    font-weight: bold;
  }

  input, select {
    margin-top: 5px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 16px;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }
`;



const ConsultarQuejaE = () => {
  const [quejas, setQuejas] = useState([]);
  const [filteredQuejas, setFilteredQuejas] = useState([]);
  const [mostrarQueja, setMostrarQueja] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [respondidaFiltro, setRespondidaFiltro] = useState('');

  useEffect(() => {
    const fetchQuejas = async () => {
      try {
        const response = await axios.get('http://localhost:3002/Quejas/');
        // Invertir el orden de los registros para que el último registro sea el primero
        const data = response.data.reverse();
        setQuejas(data);
        setFilteredQuejas(data);
      } catch (error) {
        console.error('Error al obtener las quejas:', error);
      }
    };

    fetchQuejas();
  }, []);

  useEffect(() => {
    const aplicarFiltros = () => {
      let resultado = quejas;

      if (fechaFiltro) {
        resultado = resultado.filter(queja => queja.fecha.includes(fechaFiltro));
      }

      if (respondidaFiltro) {
        resultado = resultado.filter(queja => (respondidaFiltro === 'respondida' ? queja.Respuesta : !queja.Respuesta));
      }

      setFilteredQuejas(resultado);
    };

    aplicarFiltros();
  }, [fechaFiltro, respondidaFiltro, quejas]);

  const toggleQueja = (index) => {
    setMostrarQueja(mostrarQueja === index ? null : index);
  };

  const handleEnviarRespuesta = async (queja) => {
    if (!respuesta) return;

    try {
      const updatedQueja = { ...queja, Respuesta: respuesta };
      await axios.put(`http://localhost:3002/Quejas/${queja.id}`, updatedQueja);

      const emailParams = {
        to_name: queja.nombre,
        message: respuesta,
        to_email: queja.correo,
      };

      await emailjs.send(
        'service_ry1g0os',
        'template_ldrsz2k',
        emailParams,
        'I20QJHbvYjkT3UX_N'
      );

      setQuejas((prevQuejas) =>
        prevQuejas.map((q) =>
          q.id === queja.id ? { ...q, Respuesta: respuesta } : q
        )
      );

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Tu respuesta ha sido enviada',
        showConfirmButton: false,
        timer: 1500
      });

      setRespuesta('');
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <Container>
        <h2>Quejas</h2>
        <p>Estas son las últimas quejas registradas en el sistema</p>
        <FilterContainer>
          <label>
            Fecha:
            <input 
              type="date" 
              value={fechaFiltro} 
              onChange={(e) => setFechaFiltro(e.target.value)} 
            />
          </label>
          <label>
            Estado:
            <select 
              value={respondidaFiltro} 
              onChange={(e) => setRespondidaFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="respondida">Respondidas</option>
              <option value="noRespondida">No Respondidas</option>
            </select>
          </label>
        </FilterContainer>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Fecha</Th>
                <Th>Hora</Th>
                <Th>Nombre</Th>
                <Th>Correo</Th>
                <Th>Acción</Th>
              </tr>
            </thead>
            <tbody>
              {filteredQuejas.map((queja, index) => (
                <React.Fragment key={queja.id}>
                  <tr>
                    <Td>{queja.fecha}</Td>
                    <Td>{queja.hora}</Td>
                    <Td>{queja.nombre}</Td>
                    <Td>{queja.correo}</Td>
                    <Td>
                      <Button primary onClick={() => toggleQueja(index)}>
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </Td>
                  </tr>
                  {mostrarQueja === index && (
                    <tr>
                      <Td colSpan={6}>
                        <QuejaContent>
                          <p>{queja.texto}</p>
                          <ResponseSection>
                            {queja.Respuesta ? (
                              <p>Respuesta: {queja.Respuesta}</p>
                            ) : (
                              <>
                                <TextArea
                                  value={respuesta}
                                  onChange={(e) => setRespuesta(e.target.value)}
                                  placeholder="Escribe tu respuesta aquí..."
                                />
                                <Button
                                  onClick={() => handleEnviarRespuesta(queja)}
                                  disabled={!respuesta}
                                >
                                  Enviar Respuesta
                                </Button>
                              </>
                            )}
                          </ResponseSection>
                        </QuejaContent>
                      </Td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </div>
  );
};

export default ConsultarQuejaE;