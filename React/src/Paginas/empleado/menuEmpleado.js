import React, { useState, useEffect } from 'react';
import styled from 'styled-components'; // Usa Axios para hacer la llamada a la API
import Perro1 from '../../assets/Imagenes/perro1.jpeg';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';


const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  text-align: center;
  font-size: 3rem;
  font-family: Poppins-Light;
  font-weight: bold;
  z-index: 1;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  z-index: 2;
  background: transparent;
  margin-top: 26px;
  font-family: Poppins-ExtraLight;
  font-size: large;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  margin-right: 61px;
`;

const Circle = styled.div`
  width: 40px; 
  height: 40px; 
  background-color: orange; /* Color del círculo */
  border-radius: 50%; 
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase; /* Para asegurarse de que las letras estén en mayúsculas */
`;

const Dropdown = styled.div`
  position: relative;

  &:hover .dropdown-content {
    display: block;
  }
`;

const Link = styled.a`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const DropdownContentLink = styled.a`
  display: block;
  color: black;
  padding: 8px 10px;
  text-decoration: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const MenuEmpleado = () => {
  const [nombre, setNombre] = useState('');
  const [initials, setInitials] = useState('');
  const [inscripciones, setInscripciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el nombre del usuario desde localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    console.log("Nombre de usuario desde localStorage:", nombreUsuario);

    if (nombreUsuario) {
      const iniciales = `${nombreUsuario.charAt(0)}`;
      setInitials(iniciales);
      setNombre(nombreUsuario); // Asignar el nombre al estado si está presente
    } else {
      console.log('No se encontró el nombre del usuario en localStorage');
    }

     // Carga de datos de mascotas desde el backend
     axios.get('http://localhost:5000/api/colegio/pendientes')
    .then(response => {
      console.log("Datos de inscripciones pendientes:", response.data);
      setInscripciones(response.data);
    })
    .catch(error => console.error("Error al obtener inscripciones pendientes:", error));
  }, []);

  const handleConfirm = (id_Servicio) => {
    axios.post(`http://localhost:5000/api/colegio/${id_Servicio}/confirmar`)
      .then(() => {
        Swal.fire('Inscripción confirmada', '', 'success');
        // Actualizar el estado eliminando la inscripción confirmada
        setInscripciones(inscripciones.filter(inscripcion => inscripcion.id_Servicio !== id_Servicio));
      })
      .catch(error => console.error("Error al confirmar la inscripción:", error));
  };

  const handleLogout = () => {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sesión cerrada con éxito',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      // Limpiar todos los datos de la sesión del localStorage
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('nombreUsuario'); // Si estás guardando más información, asegúrate de remover todo
  
      // También puedes limpiar todo el localStorage si es necesario
      // localStorage.clear();
  
      // Redirigir al usuario a la página de inicio de sesión
      navigate('/');
    });
    
  };

  // Función para rechazar inscripción
  const handleReject = (id_Servicio) => {
    axios.post(`http://localhost:5000/api/colegio/${id_Servicio}/rechazar`)
      .then(() => {
        Swal.fire('Inscripción rechazada', '', 'success');
        setInscripciones(inscripciones.filter(inscripcion => inscripcion.id_Servicio !== id_Servicio));
      })
      .catch(error => console.error("Error al rechazar la inscripción:", error));
  };
  

  return (
    <div>
      <HeroSection>
        <Navbar>
          {/* Enlaces con Dropdowns */}
          <NavLinks>
            <Dropdown>
              <Link href="/menuEmpleado">Inicio</Link>
            </Dropdown>
            <Dropdown>
              <Link href="#">Mascotas</Link>
              <DropdownContent className="dropdown-content">
                <DropdownContentLink href="/consultarMascotasE">Consultar</DropdownContentLink>
                <DropdownContentLink href="/asistencia">Asistencia</DropdownContentLink>
              </DropdownContent>
            </Dropdown>
            <Dropdown>
              <Link href="#">Reservas</Link>
              <DropdownContent className="dropdown-content">
                <DropdownContentLink href="/consultarReservasE">Consultar</DropdownContentLink>
              </DropdownContent>
            </Dropdown>
            <Dropdown>
              <Link href="#">Quejas</Link>
              <DropdownContent className="dropdown-content">
                <DropdownContentLink href="/consultarQuejaE">Consultar</DropdownContentLink>
              </DropdownContent>
            </Dropdown>
            <Dropdown>
            <Circle>
              {initials} {/* Muestra las iniciales dentro del círculo */}
            </Circle>
            <DropdownContent className="dropdown-content">
              <DropdownContentLink href="/miPerfilE">Mi Perfil</DropdownContentLink>
              <DropdownContentLink href="#" onClick={handleLogout}>
                Cerrar sesión
              </DropdownContentLink>
            </DropdownContent>
          </Dropdown>
          </NavLinks>
        </Navbar>

        <HeroImage src={Perro1} alt="Perro1" />
        <HeroText>Bienvenido, {nombre}</HeroText>
      </HeroSection>

      {/* Sección de mascotas asignadas */}
      <div className="min-h-screen bg-gray-100 p-5">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Inscripciones Pendientes en Colegio</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {inscripciones.map((inscripcion) => (
          <div key={inscripcion.id_Servicio} className="bg-white shadow-lg rounded-lg p-5 max-w-xs">
            <h3 className="text-xl font-semibold">{inscripcion.nombre_mascota}</h3>
            <p className="text-gray-600">Raza: {inscripcion.raza}</p>
            <p className="text-gray-600">Edad: {inscripcion.edad}</p>
            <p className="text-gray-600">Dueño: {inscripcion.nombre_dueño}</p>
            <p className="text-gray-600">Contacto: {inscripcion.contacto_dueño}</p>
            <button
              onClick={() => handleConfirm(inscripcion.id_Servicio)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Confirmar Inscripción
            </button>
            <button
                onClick={() => handleReject(inscripcion.id_Servicio)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Rechazar
              </button>
          </div>
        ))}
      </div>
    </div>


      <Footer />
    </div>
  );
};

export default MenuEmpleado;