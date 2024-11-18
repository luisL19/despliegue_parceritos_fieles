import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import Modal from 'react-modal';

// Estilos de Tailwind CSS para el modal
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};


const Asistencias = () => {
  const [tipoAsistencia, setTipoAsistencia] = useState('');
  const [modalData, setModalData] = useState([]);
  const [isColegioModalOpen, setIsColegioModalOpen] = useState(false);
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [isPasadiaModalOpen, setIsPasadiaModalOpen] = useState(false);

  
  // Manejador de cambio de estado de asistencia
  const handleAsistenciaChange = (index) => {
    const updatedData = [...modalData];
    updatedData[index].asistio = !updatedData[index].asistio;
    setModalData(updatedData);
  };

  const registrarAsistencias = () => {
    const asistencias = modalData.map(mascota => ({
      id_Mascota: mascota.id_Mascota,    // Asegúrate de que se incluya el id de la mascota
      tipo_servicio: mascota.tipo_servicio,      // Incluye el tipo de servicio seleccionado
      asistio: mascota.asistio ? "Si" : "No"    // El estado de asistencia
    }));

    console.log("Datos enviados a registrar-asistencias:", JSON.stringify({ asistencias }, null, 2));

    axios.post('http://localhost:5000/registrar-asistencias', { asistencias }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        alert('Asistencias registradas exitosamente');
        closeModal('colegio'); // Cierra el modal después de registrar
        closeModal('hotel');
        closeModal('pasadia');
      })
      .catch(error => {
        console.error('Error al registrar asistencias:', error);
      });
  };
  


   // Función para abrir el modal y cargar los datos correspondientes
   const openModal = (tipo) => {
    const endpoint = tipo === 'colegio' ? '/mascotas/colegio' : `/reservas/${tipo}`;
    axios.get(`http://localhost:5000${endpoint}`)
      .then(response => {
        setModalData(response.data);
        if (tipo === 'colegio') {
          setIsColegioModalOpen(true);
        } else if (tipo === 'hotel') {
          setIsHotelModalOpen(true);
        } else if (tipo === 'pasadia') {
          setIsPasadiaModalOpen(true);
        }
      })
      .catch(error => {
        console.error(`Error al obtener datos para ${tipo}:`, error);
      });
  };

  // Funciones para cerrar cada modal y limpiar datos
  const closeModal = (tipo) => {
    setModalData([]);
    if (tipo === 'colegio') {
      setIsColegioModalOpen(false);
    } else if (tipo === 'hotel') {
      setIsHotelModalOpen(false);
    } else if (tipo === 'pasadia') {
      setIsPasadiaModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow bg-gray-100 py-10 px-6">
      <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Registro de Asistencias</h2>

      {/* Botones para abrir cada modal */}
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => openModal('colegio')} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Colegio</button>
        <button onClick={() => openModal('hotel')} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300">Hotel</button>
        <button onClick={() => openModal('pasadia')} className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-300">Pasadía</button>
      </div>

      {/* Modal de Colegio */}
      <Modal
        isOpen={isColegioModalOpen}
        onRequestClose={() => closeModal('colegio')}
        style={customModalStyles}
        contentLabel="Colegio - Asistencias"
      >
        <h3 className="text-xl font-bold text-center mb-4">Colegio - Asistencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modalData.map((mascota, index) => (
            <div key={mascota.id_Mascota} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-lg font-semibold">{mascota.nombre}</p>
              <p>Dirección: {mascota.direccion_dueño}</p>
              <div className="mt-2 flex items-center">
                <label className="text-gray-700 mr-2">Asistió:</label>
                <input
                  type="checkbox"
                  checked={mascota.asistio || false}
                  onChange={() => handleAsistenciaChange(index)}
                  className="h-5 w-5 text-blue-600"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button onClick={registrarAsistencias} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Registrar Asistencias</button>
          <button onClick={() => closeModal('colegio')} className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">Cerrar</button>
        </div>
      </Modal>

      {/* Modal de Hotel */}
      <Modal
        isOpen={isHotelModalOpen}
        onRequestClose={() => closeModal('hotel')}
        style={customModalStyles}
        contentLabel="Hotel - Asistencias"
      >
        <h3 className="text-xl font-bold text-center mb-4">Hotel - Asistencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modalData.map((mascota, index) => (
            <div key={mascota.id_Reservas} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-lg font-semibold">Nombre: {mascota.nombre_mascota}</p>
              <p>Dirección del Dueño: {mascota.direccion_cliente}</p>
              <p>Celular del Dueño: {mascota.celular_cliente}</p>
              <div className="mt-2 flex items-center">
                <label className="text-gray-700 mr-2">Asistió:</label>
                <input
                  type="checkbox"
                  checked={mascota.asistio || false}
                  onChange={() => handleAsistenciaChange(index)}
                  className="h-5 w-5 text-green-600"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
        <button onClick={registrarAsistencias} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Registrar Asistencias</button>
          <button onClick={() => closeModal('hotel')} className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">Cerrar</button>
        </div>
      </Modal>

      {/* Modal de Pasadía */}
      <Modal
        isOpen={isPasadiaModalOpen}
        onRequestClose={() => closeModal('pasadia')}
        style={customModalStyles}
        contentLabel="Pasadía - Asistencias"
      >
        <h3 className="text-xl font-bold text-center mb-4">Pasadía - Asistencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modalData.map((mascota, index) => (
            <div key={mascota.id_Reservas} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-lg font-semibold">{mascota.nombre_mascota}</p>
              <p>Dirección: {mascota.direccion_cliente}</p>
              <p>Celular: {mascota.celular_cliente}</p>
              <div className="mt-2 flex items-center">
                <label className="text-gray-700 mr-2">Asistió:</label>
                <input
                  type="checkbox"
                  checked={mascota.asistio || false}
                  onChange={() => handleAsistenciaChange(index)}
                  className="h-5 w-5 text-purple-600"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
        <button onClick={registrarAsistencias} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Registrar Asistencias</button>
          <button onClick={() => closeModal('pasadia')} className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">Cerrar</button>
        </div>
      </Modal>
    </div>
      </div>
      <Footer />
    </div>
  );
};

export default Asistencias;