import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavIndex from '../components/navIndex';
import Footer from '../components/footer';
import './index.css';
import Perro from '../assets/Imagenes/imagen_perro.jpeg';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import guarderiaImage from '../assets/Imagenes/guarderia.png';
import colegioImage from '../assets/Imagenes/colegio.png';
import hotelImage from '../assets/Imagenes/hotel.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Swal from 'sweetalert2';


const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
};

function Index() {
    const [modalVisible, setModalVisible] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [nombre, setNombre] = useState('');
    const [texto, setTexto] = useState('');
    const [opiniones, setOpiniones] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [registerNombre, setRegisterNombre] = useState('');
    const [registerApellido, setRegisterApellido] = useState('');
    const [registerCorreo, setRegisterCorreo] = useState('');
    const [registerCelular, setRegisterCelular] = useState('');
    const [registerDireccion, setRegisterDireccion] = useState('');
    const [registerTipoDocumento, setRegisterTipoDocumento] = useState('');
    const [registerNumeroDocumento, setRegisterNumeroDocumento] = useState('');
    const [registerContraseña, setRegisterContraseña] = useState('');
    const [registerConfirmarContraseña, setRegisterConfirmarContraseña] = useState('');
    const [paginaActual, setPaginaActual] = useState(1); // Página actual
    const [totalPaginas, setTotalPaginas] = useState(0); // Total de páginas
    const [opinionesPagina, setOpinionesPagina] = useState([]); // Opiniones de la página actual
    const maxCaracteres = 300;
    const opinionesPorPagina = 6; // Número de opiniones por página
    const navigate = useNavigate();

     // Obtener las opiniones de la API
     useEffect(() => {
        const fetchOpiniones = async () => {
            try {
                const respuesta = await axios.get('http://localhost:3002/Opiniones');
                const opinionesData = respuesta.data;
                setOpiniones(opinionesData);
                setTotalPaginas(Math.ceil(opinionesData.length / opinionesPorPagina));
                setOpinionesPagina(opinionesData.slice((paginaActual - 1) * opinionesPorPagina, paginaActual * opinionesPorPagina));
            } catch (error) {
                console.error('Error al cargar opiniones:', error);
            }
        };

        fetchOpiniones();
    }, [paginaActual]);

    // Función para manejar el envío de la opinión
    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevaOpinion = {
            id: new Date().toISOString(),
            texto,
            nombre,
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toISOString().split('T')[1].split('.')[0]
        };

        try {
            await axios.post('http://localhost:3002/Opiniones', nuevaOpinion);
            setOpiniones([...opiniones, nuevaOpinion]);
            setNombre('');
            setTexto('');
            setModalVisible(false);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Tu opinión ha sido guardada',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Hubo un error al enviar la opinión', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al enviar la opinión',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const manejarInicioSesion = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await axios.get('http://localhost:3002/Usuarios/');
            const usuarios = respuesta.data;

            const usuario = usuarios.find(
                user => user.Correo === correo && user.Contraseña === contraseña
            );

            if (usuario) {
                Swal.fire({
                    title: 'Inicio de sesión exitoso',
                    text: 'Bienvenido de nuevo!',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    localStorage.setItem('usuarioId', usuario.id);

                    switch (usuario.Rol) {
                        case 'Cliente':
                            navigate('/menu');
                            break;
                        case 'Empleado':
                            navigate('/menuEmpleado');
                            break;
                        case 'Gerente':
                            navigate('/menuGerente');
                            break;
                        default:
                            Swal.fire({
                                title: 'Error',
                                text: 'Rol desconocido',
                                icon: 'error',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Aceptar'
                            });
                            break;
                    }

                    setLoginModalVisible(false);
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Correo o contraseña incorrectos',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al iniciar sesión',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        setLoginModalVisible(false);
        setRegisterModalVisible(true);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (registerContraseña !== registerConfirmarContraseña) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

    
        if (!validatePassword(registerContraseña)) {
            Swal.fire({
                title: 'Error',
                text: 'La contraseña debe contener al menos una letra mayúscula, un número y un signo especial',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
    



        try {
            const response = await axios.get('http://localhost:3002/Usuarios');
            const usuarios = response.data;
            const usuarioExistente = usuarios.find(usuario => usuario.Correo === registerCorreo);
            if (usuarioExistente) {
                Swal.fire({
                    title: 'Error',
                    text: 'Ya existe un usuario con este correo',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }
            const nuevoUsuario = {
                id: Date.now().toString(),
                Nombre: registerNombre,
                Apellido: registerApellido,
                Correo: registerCorreo,
                Celular: registerCelular,
                Direccion: registerDireccion,
                TipoDocumento: registerTipoDocumento,
                NumeroDocumento: registerNumeroDocumento,
                Contraseña: registerContraseña,
                Rol: 'Cliente',
            };

            Swal.fire({
                title: 'Registrado con éxito',
                text: 'Usuario registrado con éxito',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                setRegisterModalVisible(false);
                navigate('/');
            });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al registrar usuario',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    // Formatear nombre y apellido
    const formatName = (value) => {
        return value
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleNameChange = (e) => {
        const formattedValue = formatName(e.target.value);
        setRegisterNombre(formattedValue);
    };

    const handleApellidoChange = (e) => {
        const formattedValue = formatName(e.target.value);
        setRegisterApellido(formattedValue);
    };

    // Cambiar de página
    const handlePageChange = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    const handleTextoChange = (e) => {
        const value = e.target.value;
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setTexto(formattedValue);
    };

    const handleNombreChange = (e) => {
        const value = e.target.value;
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setNombre(formattedValue);
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /[0-9]/.test(password);
    
        return hasUpperCase && hasSpecialChar && hasNumber;
    };

    return (
        <div>
            <NavIndex />
            <section className="hero">
                <div className="hero-text-container">
                    <font size={8}>¡Sé Parte de Nosotros!</font>
                    <br />
                    <br />
                    <br />
                    <font size={4}>Somos expertos en cuidado animal, ofreciendo un servicio de calidad</font>
                    <br />
                    <br />
                    <font size={4}>Inicia Sesión o Regístrate</font>
                    <br />
                    <br />
                    <font size={4}>Tu mascota también tiene derecho a tener un buen bienestar</font>
                    <br />
                    <br />
                    <button onClick={() => setLoginModalVisible(true)} className="button">Inicia Sesión</button>
                    <br />
                    <br />
                    <h4>Nuestras Redes Sociales</h4>
                    <a href="https://www.instagram.com/guarderia_parceritos_fieles?igsh=eXBxaTIxbGg2NXpi">
                        <i className="fa-brands fa-instagram" />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61555383941250">
                        <i className="fa-brands fa-facebook-f" />
                    </a>
                    <a href="https://www.tiktok.com/@parceritosfieles?_t=8oLcvrq6wh3&_r=1">
                        <i className="fa-brands fa-tiktok" />
                    </a>
                </div>
                <div className="hero-image-container">
                    <img src={Perro} alt="Imagen de perro" style={{ filter: 'brightness(0.8)' }} />
                </div>
            </section>
            <section className="about" id="nosotros">
                <div className="container">
                    <div className="about-content">
                        <h2>Nosotros</h2>
                        <p>Bienvenidos a Parceritos Fieles, tu mejor opción para el cuidado de tu perro. Nos especializamos en brindar un ambiente seguro y acogedor donde tu mascota puede disfrutar de nuestros servicios de guardería, colegio y hotel.</p>
                        <p>En Parceritos Fieles, entendemos lo importante que es para ti el bienestar de tu perro. Por eso, ofrecemos un servicio de transporte para recoger a tu perrito y llevarlo a nuestras instalaciones, asegurándonos de que tenga una experiencia cómoda y sin estrés desde el primer momento.</p>
                        <p>Proporcionamos atención personalizada y actividades enriquecedoras para mantener a tu perro feliz, saludable y bien educado. Ya sea que necesites un lugar confiable para dejar a tu perro durante el día, una educación efectiva y divertida, o un hospedaje cómodo mientras estás fuera, Parceritos Fieles está aquí para ayudarte.</p>
                        <p>Confía en nosotros para cuidar a tu mejor amigo con el amor y la dedicación que se merece. ¡En Parceritos Fieles, tu perro es nuestra prioridad!</p>
                    </div>
                </div>
            </section>
            <section className="services" id="servicio">
                <div className="container">
                    <h2>Servicios</h2>
                </div>
                <div className="services-wrapper">
                    <Slider {...settings} className="services-slider">
                        <div className="service">
                            <img src={guarderiaImage} alt="Guardería" />
                            <h3>Guardería</h3>
                            <p>En nuestra guardería, tu perro pasa el día jugando y socializando. Lo cuidamos y nos aseguramos de que esté feliz y seguro. ¡Trae a tu perro y deja que se divierta!</p>
                        </div>
                        <div className="service">
                            <img src={colegioImage} alt="Colegio" />
                            <h3>Colegio</h3>
                            <p>En nuestro colegio, enseñamos a tu perro a comportarse mejor. Usamos métodos amables y efectivos para que tu perro aprenda de manera divertida. ¡Ven y mejora la conducta de tu mascota!</p>
                        </div>
                        <div className="service">
                            <img src={hotelImage} alt="Hotel" />
                            <h3>Hotel</h3>
                            <p>En nuestro hotel, tu perro se queda en un lugar cómodo y seguro mientras tú estás fuera. Le damos atención las 24 horas del día para que esté feliz y tranquilo. ¡Viaja con la tranquilidad de que tu perro está bien cuidado!</p>
                        </div>
                    </Slider>
                </div>
            </section>
            <section className="location" id="ubicacion">
                <div className="container">
                    <h2>Ubicación</h2>
                    <center>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d7951.205551718149!2d-74.1458227!3d4.8380667!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3b21d13f61f5d%3A0x17c94c63e82983b!2sCalle%20158%20%2396a%20-%2077%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1694690372840!5m2!1ses!2sco" width={600} height={450} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    </center>
                </div>
            </section>
             {/* Contenido de la página */}
             <section className="opinions" id="opiniones">
            <div className="container">
                <h2>Opiniones</h2>
                <button onClick={() => setModalVisible(true)} className="custom-btn">Agregar Opinión</button>
                <div className="opinions-wrapper">
                    {opinionesPagina.map(opinion => (
                        <div key={opinion.id} className="opinion">
                            <p>{opinion.texto}</p>
                            <h4>- {opinion.nombre}</h4>
                            <p><small>{opinion.fecha} {opinion.hora}</small></p>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button onClick={() => handlePageChange(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</button>
                    <span>Página {paginaActual} de {totalPaginas}</span>
                    <button onClick={() => handlePageChange(paginaActual + 1)} disabled={paginaActual === totalPaginas}>Siguiente</button>
                </div>
            </div>
              {/* Modal para agregar opinión */}
              {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <h2 className="form-title">Agregar Opinión</h2>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={handleNombreChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="texto">Opinión:</label>
                                <textarea
                                    id="texto"
                                    value={texto}
                                    onChange={handleTextoChange}
                                    maxLength={maxCaracteres}
                                    required
                                />
                                <div className="char-counter">
                                    {maxCaracteres - texto.length} caracteres restantes
                                </div>
                            </div>
                            <button type="submit">Enviar Opinión</button>
                            {mensaje && <p>{mensaje}</p>}
                            <br />
                            <button type="button" onClick={() => setModalVisible(false)} className="close-modal">Cerrar</button>
                        </form>
                    </div>
                </div>
            )}
            </section>
                {/* Círculo flotante con WhatsApp */}
                <a href="https://wa.me/1234567890" className="whatsapp-circle" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faWhatsapp} />
                </a>
                 
                {/* Modal para Login */}
                {loginModalVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content login-modal">
                            <div className="login-right-section">
                                <h1>Inicia Sesión</h1>
                                <form id="loginForm" onSubmit={manejarInicioSesion}>
                                    <div className="form-group">
                                        <label htmlFor="email">Correo</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Tu correo"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Contraseña</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="Tu contraseña"
                                            value={contraseña}
                                            onChange={(e) => setContraseña(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="button">Ingresar</button>
                                    <br></br>


                                    <div className="form-links">
                                        <Link to="#">¿Olvidaste tu Contraseña?</Link>
                                        <Link to="#" onClick={handleRegisterClick}>¿No tienes cuenta? Regístrate!</Link>
                                    </div>
                                </form>
                                <button onClick={() => setLoginModalVisible(false)} className="close-modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal para Registro */}
                {registerModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content register-modal">
                        <form id="registerForm" onSubmit={handleRegisterSubmit}>
                            <h1 className="form-title">Regístrate</h1>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Tu nombre"
                                    value={registerNombre}
                                    onChange={handleNameChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido">Apellido</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    placeholder="Tu apellido"
                                    value={registerApellido}
                                    onChange={handleApellidoChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Correo</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Tu correo"
                                    value={registerCorreo}
                                    onChange={(e) => setRegisterCorreo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="celular">Celular</label>
                                <input
                                    type="text"
                                    id="celular"
                                    name="celular"
                                    placeholder="Tu número de celular"
                                    value={registerCelular}
                                    onChange={(e) => setRegisterCelular(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="direccion">Dirección</label>
                                <input
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    placeholder="Tu dirección"
                                    value={registerDireccion}
                                    onChange={(e) => setRegisterDireccion(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipo_documento">Tipo de Documento</label>
                                <select
                                    id="tipo_documento"
                                    name="tipo_documento"
                                    value={registerTipoDocumento}
                                    onChange={(e) => setRegisterTipoDocumento(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un tipo de documento</option>
                                    <option value="CC">C.C</option>
                                    <option value="PPT">PPT</option>
                                    <option value="CE">C.E</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="numero_documento">Número de Documento</label>
                                <input
                                    type="text"
                                    id="numero_documento"
                                    name="numero_documento"
                                    placeholder="Tu número de documento"
                                    value={registerNumeroDocumento}
                                    onChange={(e) => setRegisterNumeroDocumento(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Tu contraseña"
                                    value={registerContraseña}
                                    onChange={(e) => setRegisterContraseña(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm_password">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    placeholder="Confirma tu contraseña"
                                    value={registerConfirmarContraseña}
                                    onChange={(e) => setRegisterConfirmarContraseña(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="button">Registrarse</button>
                            <button type="button" onClick={() => setRegisterModalVisible(false)} className="close-modal">Cerrar</button>
                        </form>
                    </div>
                </div>
            )}
                <Footer />
            </div>
        );
    }

    export default Index;
