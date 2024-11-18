import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Footer from '../../components/footer';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Perro1 from '../../assets/Imagenes/perro1.jpeg';
import 'tailwindcss/tailwind.css';
import logo from '../../assets/Imagenes/logo.png';

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
  justify-content: space-between; /* Asegura que el logo esté a la izquierda y los enlaces a la derecha */
  align-items: center;
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  z-index: 2;
  background: transparent;
  padding: 0 20px; /* Espacio lateral para la barra de navegación */
  font-family: Poppins-ExtraLight;
  font-size: large;
`;

const Logo = styled.img`
  width: 80px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  margin-right: 61px;
`;

const Circle = styled.div`
  width: 40px; 
  height: 40px; 
  background-color: orange;
  border-radius: 50%; 
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
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

const MenuGerente = () => {
    const [empleados, setEmpleados] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [showClienteSearch, setShowClienteSearch] = useState(false);
    const [documentoBusqueda, setDocumentoBusqueda] = useState('');
    const [clienteEncontrado, setClienteEncontrado] = useState(null);
    const [nombre, setNombre] = useState('');
    const [initials, setInitials] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        if (nombreUsuario) {
            const iniciales = `${nombreUsuario.charAt(0)}`;
            setInitials(iniciales);
            setNombre(nombreUsuario);
        }
    }, []);

    const handleLogout = () => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Sesión cerrada con éxito',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            localStorage.removeItem('usuarioId');
            localStorage.removeItem('nombreUsuario');
            navigate('/');
        });
    };

    const handleAgregarEmpleadoClick = () => {
        setShowClienteSearch(true);
    };

    const handleBuscarCliente = () => {
        const cliente = clientes.find(cliente => cliente.NumeroDocumento === documentoBusqueda);
        setClienteEncontrado(cliente);
    };

    const handleCambioRol = (clienteId) => {
        const cliente = clientes.find(c => c.id === clienteId);

        if (cliente) {
            fetch(`http://localhost:3002/Usuarios/${clienteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...cliente,
                    Rol: 'Empleado'
                }),
            })
                .then(response => response.json())
                .then(updatedCliente => {
                    setEmpleados([...empleados, updatedCliente]);
                    setClientes(clientes.filter(c => c.id !== clienteId));
                    setClienteEncontrado(null);
                    setDocumentoBusqueda('');
                    setShowClienteSearch(false);

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Empleado agregado exitosamente",
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
                .catch(error => {
                    console.error('Error changing role:', error);
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error al agregar empleado",
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
        } else {
            console.error('Cliente no encontrado');
        }
    };

    const handleCloseModal = () => {
        setShowClienteSearch(false);
        setClienteEncontrado(null);
        setDocumentoBusqueda('');
    };

    return (
        <div>
            <HeroSection>
                <Navbar>
                    <Logo src={logo} alt="Logo" />
                    <NavLinks>
                        <Dropdown>
                            <Link href="/menuGerente">Inicio</Link>
                        </Dropdown>
                        <Dropdown>
                            <Link href="#">Mascotas</Link>
                            <DropdownContent className="dropdown-content">
                                <DropdownContentLink href="/consultarMascotaG">Consultar</DropdownContentLink>
                            </DropdownContent>
                        </Dropdown>
                        <Dropdown>
                            <Link href="#">Reservas</Link>
                            <DropdownContent className="dropdown-content">
                                <DropdownContentLink href="/consultarReservasG">Consultar</DropdownContentLink>
                            </DropdownContent>
                        </Dropdown>
                        <Dropdown>
                            <Link href="#">Quejas</Link>
                            <DropdownContent className="dropdown-content">
                                <DropdownContentLink href="/consultarQuejasG">Consultar</DropdownContentLink>
                            </DropdownContent>
                        </Dropdown>
                        <Dropdown>
                            <Circle>
                                {initials} {/* Muestra las iniciales dentro del círculo */}
                            </Circle>
                            <DropdownContent className="dropdown-content">
                                <DropdownContentLink href="/miPerfilG">Mi Perfil</DropdownContentLink>
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

            {/* Contenido del equipo y modal de agregar empleado */}
            <div className="container mx-auto my-10 bg-white rounded-xl shadow-lg p-8 max-w-3xl text-center">
                <h2 className="text-2xl font-semibold text-gray-800">¡Tu Equipo!</h2>
                <p className="text-gray-500">Las personas que hacen que todo suceda</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {empleados.filter(empleado => empleado.Rol === 'Empleado').map((empleado) => (
                        <div key={empleado.id} className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
                            <h3 className="text-lg font-semibold text-gray-700">{empleado.Nombre}</h3>
                            <p className="text-sm text-gray-500">{empleado.Rol}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 duration-300"
                        onClick={handleAgregarEmpleadoClick}
                    >
                        + Agregar Empleado
                    </button>
                </div>
            </div>

            {/* Modal para buscar cliente */}
            {showClienteSearch && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 transform transition-all duration-300 ease-in-out scale-105">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Buscar Cliente para Agregar</h3>
                            <button onClick={handleCloseModal} className="text-red-600 hover:text-red-800 text-xl font-bold">
                                ×
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Número de Documento"
                            value={documentoBusqueda}
                            onChange={(e) => setDocumentoBusqueda(e.target.value)}
                            className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                        <button
                            className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                            onClick={handleBuscarCliente}
                        >
                            Buscar
                        </button>

                        {clienteEncontrado && (
                            <div className="mt-4 bg-gray-100 p-3 rounded-lg text-center">
                                <p className="text-gray-700 font-medium">{clienteEncontrado.Nombre} {clienteEncontrado.Apellido}</p>
                                <button
                                    className="mt-2 bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                                    onClick={() => handleCambioRol(clienteEncontrado.id)}
                                >
                                    Cambiar a Empleado
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default MenuGerente;
