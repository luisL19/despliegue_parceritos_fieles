import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBarEmpleado from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Importa el icono de perfil

const ConsultarMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [razaFiltro, setRazaFiltro] = useState('');
  const [sexoFiltro, setSexoFiltro] = useState('');
  const [edadMinFiltro, setEdadMinFiltro] = useState('');
  const [edadMaxFiltro, setEdadMaxFiltro] = useState('');

  useEffect(() => {
    const obtenerMascotas = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/empleados/consultar-mascotas');
        setMascotas(respuesta.data);
      } catch (error) {
        console.error('Error al obtener las mascotas:', error);
      }
    };

    obtenerMascotas();
  }, []);

  const filtrarMascotas = () => {
    return mascotas.filter((mascota) => {
      const cumpleRaza = razaFiltro ? mascota.raza.includes(razaFiltro) : true;
      const cumpleSexo = sexoFiltro ? mascota.sexo === sexoFiltro : true;
      const cumpleEdadMin = edadMinFiltro ? mascota.edad >= parseInt(edadMinFiltro) : true;
      const cumpleEdadMax = edadMaxFiltro ? mascota.edad <= parseInt(edadMaxFiltro) : true;

      return cumpleRaza && cumpleSexo && cumpleEdadMin && cumpleEdadMax;
    });
  };

  const verPerfil = (id) => {
    localStorage.setItem('mascotaId', id);
    window.location.href = '/verPerfilMascota';
  };

  const styles = {
    body: {
      margin: 0,
      fontFamily: 'sans-serif',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '20px',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      borderRadius: '10px',
      width: '95%',
      maxWidth: '1200px',
    },
    filters: {
      marginBottom: '20px',
      display: 'flex',
      gap: '15px',
      width: '100%',
      justifyContent: 'space-around',
    },
    filterInput: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      width: '100%',
    },
    tableContainer: {
      padding: '20px',
      borderRadius: '5px',
      width: '100%',
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
      color: 'black',
    },
    th: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#bfbcbcbf',
      fontWeight: 'bold',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    button: {
      backgroundColor: 'transparent', // Fondo transparente por defecto
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0', // Elimina el padding para que solo se vea el icono
    },
    buttonHover: {
      backgroundColor: '#4CAF50', // Fondo verde cuando se pasa el ratón
    },
    icon: {
      fontSize: '30px', // Tamaño del icono
      color: '#000', // Color del icono
    }
  };

  return (
    <div style={styles.body}>
      <NavBarEmpleado />
      <section style={styles.container}>
        <div style={styles.content}>
          <h2>Consultar Mascotas</h2>
          <div style={styles.filters}>
            <input
              type="text"
              placeholder="Filtrar por Raza"
              style={styles.filterInput}
              value={razaFiltro}
              onChange={(e) => setRazaFiltro(e.target.value)}
            />
            <select
              style={styles.filterInput}
              value={sexoFiltro}
              onChange={(e) => setSexoFiltro(e.target.value)}
            >
              <option value="">Todos los sexos</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
            <input
              type="number"
              placeholder="Edad mínima"
              style={styles.filterInput}
              value={edadMinFiltro}
              onChange={(e) => setEdadMinFiltro(e.target.value)}
            />
            <input
              type="number"
              placeholder="Edad máxima"
              style={styles.filterInput}
              value={edadMaxFiltro}
              onChange={(e) => setEdadMaxFiltro(e.target.value)}
            />
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Raza</th>
                  <th style={styles.th}>Edad</th>
                  <th style={styles.th}>Sexo</th>
                  <th style={styles.th}>Enfermedades</th>
                  <th style={styles.th}>Peso</th>
                  <th style={styles.th}>Esterilizado</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtrarMascotas().map((mascota) => (
                  <tr key={mascota.id}>
                    <td style={styles.td}>{mascota.nombre_mascota}</td>
                    <td style={styles.td}>{mascota.raza}</td>
                    <td style={styles.td}>{mascota.edad} años</td>
                    <td style={styles.td}>{mascota.sexo}</td>
                    <td style={styles.td}>{mascota.enfermedades}</td>
                    <td style={styles.td}>{mascota.peso}</td>
                    <td style={styles.td}>{mascota.esterilizado ? 'Sí' : 'No'}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.button}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                        onClick={() => verPerfil(mascota.id)}
                      >
                        <FontAwesomeIcon icon={faUser} style={styles.icon} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ConsultarMascotas;
