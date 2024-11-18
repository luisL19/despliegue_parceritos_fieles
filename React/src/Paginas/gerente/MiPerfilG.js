import React, { useEffect, useState } from 'react';
import NavBar from '../../components/navBarGerente';
import Footer from '../../components/footer';
import axios from 'axios';
import Imagen from '../../assets/Imagenes/usuario.png';
import './MiPerfilG.css'

const MiPerfilG = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const id = localStorage.getItem('usuarioId');
      if (id) {
        try {
          const respuesta = await axios.get(`http://localhost:3002/Usuarios/`);
          const usuarios = respuesta.data;
          const usuarioEncontrado = usuarios.find(user => user.id === id);
          setUsuario(usuarioEncontrado);
        } catch (error) {
          console.error('Error al obtener el perfil:', error);
        }
      }
    };

    fetchUsuario();
  }, []);

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="miPerfilG-container">
        <section className="miPerfilG-profileSection">
          <h1>Perfil Gerente</h1>
          <div className="miPerfilG-profilePic">
            <img src={Imagen} alt="Profile" />
          </div>
          <div className="miPerfilG-infoGrid">
            <div className="miPerfilG-infoItem">
              <i className="icon-user" />
              <p><strong>Nombre</strong><br />{usuario.Nombre}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-user" />
              <p><strong>Apellido</strong><br />{usuario.Apellido}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-email" />
              <p><strong>Correo</strong><br />{usuario.Correo}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-phone" />
              <p><strong>Celular</strong><br />{usuario.Celular}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-document" />
              <p><strong>Tipo documento</strong><br />{usuario.TipoDocumento}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-lock" />
              <p><strong>Contraseña</strong><br />********</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-address" />
              <p><strong>Dirección</strong><br />{usuario.Direccion}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-document" />
              <p><strong>Numero documento</strong><br />{usuario.NumeroDocumento}</p>
            </div>
          </div>
          <br />
          <div style={{ textAlign: 'center' }}>
            <a className="miPerfilG-button" href="/actualizarDatosG">Actualizar Datos</a>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default MiPerfilG;
