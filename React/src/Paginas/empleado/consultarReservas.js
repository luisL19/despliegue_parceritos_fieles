import React, { useEffect, useState } from 'react';
import NavBarEmpleado from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdCheckCircle } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';

const Container = styled.div`
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
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
  background-color: ${(props) => (props.disabled ? '#ccc' : props.color || '#1cab1f')};
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : props.hoverColor || '#156d27')};
  }
`;

const Icon = styled.div`
  font-size: 20px;
`;

const ConsultarReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/reservas');
        const data = respuesta.data.reverse();
        setReservas(data);
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    };

    fetchReservas();
  }, []);

  const actualizarEstadoReserva = async (index, nuevoEstado) => {
    const reserva = reservas[index];
    const nuevaReserva = { ...reserva, estado: nuevoEstado };

    try {
      const result = await Swal.fire({
        title: `¿Estás seguro de ${nuevoEstado === 'Confirmado' ? 'confirmar' : 'cancelar'} esta reserva?`,
        text: "No podrás revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Sí, ${nuevoEstado === 'Confirmado' ? 'confirmar' : 'cancelar'}`,
        cancelButtonText: 'No, mantener',
        reverseButtons: true,
        customClass: {
          confirmButton: 'btn-confirmar',
          cancelButton: 'btn-cancelar',
          actions: 'actions'
        },
        buttonsStyling: false
      });

      if (result.isConfirmed) {
        await axios.put(`http://localhost:5000/api/reservas/${reserva.id_Reservas}/estado`, { estado: nuevoEstado });
        const nuevasReservas = reservas.map((reserva, i) =>
          i === index ? nuevaReserva : reserva
        );
        setReservas(nuevasReservas);
        Swal.fire({
          title: nuevoEstado === 'Confirmado' ? 'Confirmada!' : 'Cancelada!',
          text: `La reserva ha sido ${nuevoEstado.toLowerCase()}.`,
          icon: 'success'
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Acción cancelada',
          text: 'La reserva no ha sido modificada.',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error(`Error al ${nuevoEstado === 'Confirmado' ? 'confirmar' : 'cancelar'} la reserva:`, error);
      Swal.fire({
        title: 'Error',
        text: `Hubo un problema al ${nuevoEstado === 'Confirmado' ? 'confirmar' : 'cancelar'} la reserva.`,
        icon: 'error'
      });
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const reservasFiltradas = reservas.filter((reserva) =>
    filtro === 'todos' ? true : reserva.estado === filtro
  );

  return (
    <div>
      <NavBarEmpleado />
      <Container>
        <h2>Reservas</h2>
        <p>Estas son las últimas reservas que has hecho</p>
        <FilterContainer>
          <FilterSelect value={filtro} onChange={handleFiltroChange}>
            <option value="todos">Todos</option>
            <option value="Por Confirmar">Por confirmar</option>
            <option value="Confirmado">Confirmada</option>
            <option value="Asistida">Asistida</option>
            <option value="Cancelado">Cancelada</option>
          </FilterSelect>
        </FilterContainer>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Fecha de inicio</Th>
                <Th>Fecha de final</Th>
                <Th>Celular</Th>
                <Th>Correo</Th>
                <Th>Nombre del Dueño</Th>
                <Th>Nombre de la Mascota</Th>
                <Th>Tipo de Servicio</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((reserva, index) => (
                <tr key={reserva.id_Reservas}>
                  <Td>{reserva.fecha_Inicio}</Td>
                  <Td>{reserva.fecha_Fin}</Td>
                  <Td>{reserva.celular}</Td>
                  <Td>{reserva.correo}</Td>
                  <Td>{reserva.nombre_dueño}</Td>
                  <Td>{reserva.nombre_mascota}</Td>
                  <Td>{reserva.tipo_servicio}</Td>
                  <Td>{reserva.estado}</Td>
                  <Td>
                    <Button
                      onClick={() => actualizarEstadoReserva(index, 'Confirmado')}
                      disabled={reserva.estado === 'Confirmado' || reserva.estado === 'Cancelado'}
                      color="#28a745"
                      hoverColor="#218838"
                    >
                      <Icon>
                        <MdCheckCircle />
                      </Icon>
                    </Button>
                    <Button
                      onClick={() => actualizarEstadoReserva(index, 'Cancelado')}
                      disabled={reserva.estado === 'Confirmado' || reserva.estado === 'Cancelado'}
                      color="#dc3545"
                      hoverColor="#c82333"
                    >
                      <Icon>
                        <MdCancel />
                      </Icon>
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </div>
  );
};

export default ConsultarReservas;