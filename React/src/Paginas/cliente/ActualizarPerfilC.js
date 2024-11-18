import React, { useState, useEffect } from 'react';
import NavBarCliente from '../../components/navBarCliente'; // Ajusta la ruta según tu estructura de carpetas
import Footer from '../../components/footer'; // Ajusta la ruta según tu estructura de carpetas
import './ActualizarPerfilC.css'; // Asegúrate de que la ruta es correcta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa FontAwesomeIcon
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Importa los íconos
import Swal from 'sweetalert2'; // Importa SweetAlert2

const ActualizarPerfilC = () => {
    const [cliente, setCliente] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        contraseña: '',
        celular: '',
        direccion: '',
        tipo_Documento: '',
        numero_Documento: ''
    });
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
    const userId = localStorage.getItem('usuarioId'); // ID del cliente actualmente autenticado

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/usuarios/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const clienteData = await response.json();
                setCliente(clienteData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Datos a enviar:", cliente); // Verificar los datos enviados
    
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizarlo'
        });
        
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/usuarios/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cliente),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                await Swal.fire({
                    title: 'Actualizado!',
                    text: 'Tus datos han sido actualizados.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                console.error('Error updating data:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron actualizar los datos. Inténtalo de nuevo más tarde.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="update-profile-container">
            <NavBarCliente />
            <main className="update-profile-content">
                <div className="container-2">
                    <h2>Actualizar Datos</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={cliente.nombre}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido">Apellido:</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    value={cliente.apellido}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="correo">Correo:</label>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    value={cliente.correo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contraseña">Contraseña:</label>
                                <div className="password-field">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="contraseña"
                                        name="contraseña"
                                        value={cliente.contraseña}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        onClick={togglePasswordVisibility}
                                        className="password-toggle-icon"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="celular">Celular:</label>
                                <input
                                    type="text"
                                    id="celular"
                                    name="celular"
                                    value={cliente.celular}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="direccion">Dirección:</label>
                                <input
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    value={cliente.direccion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group full-width-inline">
                                <label htmlFor="tipo_documento">Tipo documento:</label>
                                <input
                                    type="text"
                                    id="tipo_documento"
                                    name="tipo_Documento"
                                    value={cliente.tipo_Documento}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                            <div className="form-group full-width-inline">
                                <label htmlFor="numero_documento">Número Documento:</label>
                                <input
                                    type="text"
                                    id="numero_documento"
                                    name="numero_Documento"
                                    value={cliente.numero_Documento}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>
                        <center>
                            <button className="boton" type="submit">Guardar</button>
                        </center>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ActualizarPerfilC;
