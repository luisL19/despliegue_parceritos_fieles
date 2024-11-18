import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBarCliente from '../../components/navBarCliente';
import Footer from '../../components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './PerfilMascota.css';
import Swal from 'sweetalert2';
import PerroImg from '../../assets/Imagenes/perro2.jpeg';

const PerfilMascota = () => {
  const { id } = useParams(); // Obtenemos el id de la mascota desde la URL
  const [mascota, setMascota] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('usuarioId'); // Obtener userId desde localStorage

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mascotas/perfil', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, userId }) // Enviar id de la mascota y userId en el cuerpo
        });

        if (response.ok) {
          const data = await response.json();
          setMascota(data);
        } else {
          console.error('Error al obtener la mascota:', response.status);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    if (userId) {
      fetchMascota();
    } else {
      console.log('Usuario ID no encontrado en localStorage');
    }
  }, [id, userId]);

  // Función para eliminar la mascota
  const handleEliminar = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch('http://localhost:5000/api/mascotas/eliminar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, userId }) // Enviar id de la mascota y userId en el cuerpo
        });

        if (response.ok) {
          await Swal.fire({
            title: "Eliminado!",
            text: "La mascota ha sido eliminada.",
            icon: "success"
          });
          navigate('/consultar-mascota'); // Redirige después de eliminar
        } else {
          console.error('Error al eliminar la mascota:', response.status);
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la mascota. Inténtelo de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }
      } catch (error) {
        console.error('Error de red:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo eliminar la mascota. Inténtelo de nuevo más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };

  return (
    <div className="page-container">
      <NavBarCliente />
      <div className="container-2">
        {mascota ? (
          <>
            <h1>Perfil de la Mascota</h1>
            <center>
              <div className="user-img">
                <img src={PerroImg} alt="Perfil de la mascota" />
              </div>
            </center>
            <div className="info-section">
              <div className="info-ite">
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Nombre<br />{mascota.nombre}</span>
                </div>
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Edad<br />{mascota.edad} años</span>
                </div>
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Peso<br />{mascota.peso} kg</span>
                </div>
              </div>
              <div className="info-ite2">
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Raza<br />{mascota.raza}</span>
                </div>
                <div className="info-item">
                  <i className="fa-solid fa-paw" />
                  <span>Enfermedades<br />{mascota.enfermedades || "No tiene"}</span>
                </div>
                <div className="info-item-direc">
                  <i className="fa-solid fa-paw" />
                  <span>Esterilizado<br />{mascota.esterilizado === 'si' ? 'Sí' : 'No'}</span>
                </div>
              </div>
            </div>
            <div className="boton">
              <center>
                <button onClick={handleEliminar} className="button">Eliminar</button>
              </center>
            </div>
          </>
        ) : (
          <p>Cargando perfil de la mascota...</p>
        )}
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

export default PerfilMascota;
