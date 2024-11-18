import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBarEmpleado from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import Imagen from '../../assets/Imagenes/perro2perfil.jpeg';

const VerPerfilMascota = () => {
  const [mascota, setMascota] = useState(null);
  const [dueno, setDueno] = useState(null);

  useEffect(() => {
    const fetchMascota = async () => {
      const id = localStorage.getItem('mascotaId');
      if (!id) {
        console.error('No se encontró el ID de la mascota en el localStorage');
        return;
      }

      try {
        const respuestaMascota = await axios.get(`http://localhost:3002/Mascotas/${id}`);
        setMascota(respuestaMascota.data);

        const idUsuario = respuestaMascota.data.usuarioId;
        const respuestaDueno = await axios.get(`http://localhost:3002/Usuarios/${idUsuario}`);
        setDueno(respuestaDueno.data);
      } catch (error) {
        console.error('Error al obtener los detalles:', error);
      }
    };

    fetchMascota();
  }, []);

  if (!mascota || !dueno) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  return (
    <div style={styles.body}>
      <NavBarEmpleado />
      <div style={styles.container}>
        <center>
          <div style={styles.userImg}>
            <h1 style={styles.title}>Perfil de la Mascota</h1>
            <img src={Imagen} alt="img" style={styles.img} />
          </div>
        </center>

        {/* Sección de contenedores en columnas */}
        <div style={styles.columnsContainer}>
          {/* Columna de la mascota */}
          <div style={styles.infoSection}>
            <h2 style={styles.subtitle}>Detalles de la Mascota</h2>
            <div style={styles.infoItem}>
              <i className="fa-solid fa-paw" style={styles.icon} />
              <div style={styles.infoText}>
                <span style={styles.infoLabel}>Nombre:</span>
                <span>{mascota.nombre}</span>
              </div>
            </div>
            <div style={styles.infoItem}>
              <i className="fa-solid fa-paw" style={styles.icon} />
              <div style={styles.infoText}>
                <span style={styles.infoLabel}>Edad:</span>
                <span>{mascota.edad} años</span>
              </div>
            </div>
            <div style={styles.infoItem}>
              <i className="fa-solid fa-paw" style={styles.icon} />
              <div style={styles.infoText}>
                <span style={styles.infoLabel}>Peso:</span>
                <span>{mascota.peso} Kg</span>
              </div>
            </div>
            <div style={styles.infoItem}>
              <i className="fa-solid fa-paw" style={styles.icon} />
              <div style={styles.infoText}>
                <span style={styles.infoLabel}>Raza:</span>
                <span>{mascota.raza}</span>
              </div>
            </div>
          </div>

          {/* Columna del dueño */}
          <div style={styles.infoSection}>
            <h2 style={styles.subtitle}>Detalles del Dueño</h2>
            <div style={styles.infoItem}>
              <i className="fa-solid fa-user" style={styles.icon} />
              <div style={styles.infoText}>
                <span style={styles.infoLabel}>Nombre:</span>
                <span>{dueno.Nombre} {dueno.Apellido}</span>
              </div>
            </div>
            <div style={styles.infoItem}>
              <i className="fa-solid fa-envelope" style={styles.icon} />
              <div style={styles.infoText}>
                <span style={styles.infoLabel}>Correo:</span>
                <span>{dueno.Correo}</span>
              </div>
            </div>
            <div style={styles.infoItem}>
              <i className="fa-solid fa-phone" style={styles.icon} />
              <div style={styles.infoText}>
                <span style={styles.infoLabel}>Celular:</span>
                <span>{dueno.Celular}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    fontFamily: 'sans-serif',
    backgroundImage: 'url("../../assets/Imagenes/fondohuellas.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
  },
  container: {
    maxWidth: '60%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#ffffffd9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  userImg: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    color: 'black',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  img: {
    width: '30%',
    height: 'auto',
    borderRadius: '8px',
    border: '4px solid #000',
  },
  columnsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  subtitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
  },
  infoSection: {
    flex: '1',
    margin: '0 10px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  },
  icon: {
    marginRight: '15px',
    fontSize: '24px',
    color: '#333',
  },
  infoText: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    flex: 1,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '20px',
    color: '#333',
  },
};

export default VerPerfilMascota;
