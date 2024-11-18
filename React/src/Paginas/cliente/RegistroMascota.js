import React, { useState,  useEffect} from 'react';
import NavBarCliente from '../../components/navBarCliente'; // Asegúrate de que esta ruta es correcta
import Footer from '../../components/footer'; // Asegúrate de que esta ruta es correcta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './registrar_mascota.css'; // Asegúrate de que esta ruta es correcta
import Swal from 'sweetalert2';
import axios from 'axios';

const RegistroMascota = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    enfermedades: '',
    peso: '',
    edad: '',
    sexo: '',
    esterilizado: ''
  });

  const [showTitle, setShowTitle] = useState(false);

    // Controla la animación del título
    useEffect(() => {
      setShowTitle(true); // Activa el título después de montar el componente
    }, []);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'nombre') {
      formattedValue = value.toLowerCase().replace(/^\w/, c => c.toUpperCase());
    } else if (name === 'edad' && parseInt(value, 10) < 0) {
      formattedValue = '';
      Swal.fire({
        icon: 'warning',
        title: 'Edad Inválida',
        text: 'La edad no puede ser negativa.',
        confirmButtonText: 'Aceptar'
      });
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  // Manejo de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Obtén el ID del usuario desde el localStorage
    const usuarioId = localStorage.getItem('usuarioId');
  
    if (!usuarioId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el ID del usuario.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    // Limpia los valores antes de enviarlos
    const cleanFormData = {
      nombre: formData.nombre.trim(),
      raza: formData.raza.trim(),
      enfermedades: formData.enfermedades.trim(),
      peso: parseInt(formData.peso.trim(), 10),  // Asegura que peso sea un número entero
      edad: parseInt(formData.edad, 10),         // Asegura que edad sea un número entero
      sexo: formData.sexo.trim(),
      esterilizado: formData.esterilizado.trim(),
      id_Usuario: usuarioId
    };
  
    try {
      const response = await axios.post('http://localhost:5000/registrar-mascota', cleanFormData);  // Asegúrate de que la URL sea correcta
  
      if (response.status === 201) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Mascota registrada exitosamente',
          showConfirmButton: false,
          timer: 1500
        });
        setFormData({
          nombre: '',
          raza: '',
          enfermedades: '',
          peso: '',
          edad: '',
          sexo: '',
          esterilizado: '',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al registrar la mascota. Por favor, intente nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error('Error de red:', error.response || error.message);  // Verifica más detalles sobre el error
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo registrar la mascota. Inténtelo de nuevo más tarde.',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className="page-container">
      <NavBarCliente />
      <div className="container-2" style={{ marginTop: '40px' }}>
        <h2 className={`title ${showTitle ? 'fade-in' : ''}`}>Registro de Mascotas</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                placeholder="Ingrese el nombre" 
                value={formData.nombre}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="raza">Raza:</label>
              <input 
                type="text" 
                id="raza" 
                name="raza" 
                placeholder="Ingrese la raza" 
                value={formData.raza}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="enfermedades">Enfermedades:</label>
              <input 
                type="text" 
                id="enfermedades" 
                name="enfermedades" 
                placeholder="Ingrese si tiene enfermedades" 
                value={formData.enfermedades}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="peso">Peso:</label>
              <input 
                type="text" 
                id="peso" 
                name="peso" 
                placeholder="Ingrese el peso" 
                value={formData.peso}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="edad">Edad:</label>
              <input 
                type="number" 
                id="edad" 
                name="edad" 
                placeholder="Ingrese la edad" 
                value={formData.edad}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="sexo">Sexo</label>
              <select 
                id="sexo" 
                name="sexo" 
                value={formData.sexo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label htmlFor="esterilizado">¿Está Esterilizad@?</label>
              <select 
                id="esterilizado" 
                name="esterilizado" 
                value={formData.esterilizado}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <center>
            <button className="boton" type="submit">Guardar</button>
          </center>
        </form>
      </div>
      <Footer />
      <a 
        href="https://wa.me/3103409688" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" />
      </a>
    </div>
  );
};

export default RegistroMascota;
