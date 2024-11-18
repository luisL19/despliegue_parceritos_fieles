import React, { useEffect, useState } from 'react';
import NavBar from '../../components/navBarGerente';
import Footer from '../../components/footer';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './actualizarMisDatosG.css';

const ActualizarMisDatosG = () => {
  const [usuario, setUsuario] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (usuario) {
      try {
        await axios.put(`http://localhost:3002/Usuarios/${usuario.id}`, {
          Nombre: event.target.nombre.value,
          Apellido: event.target.apellido.value,
          Correo: event.target.correo.value,
          Contraseña: event.target.contraseña.value,
          Celular: event.target.celular.value,
          Direccion: event.target.direccion.value,
          TipoDocumento: usuario.TipoDocumento, // No editable
          NumeroDocumento: usuario.NumeroDocumento // No editable
        });
        alert('Datos actualizados exitosamente');
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
        alert('Error al actualizar los datos');
      }
    }
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container-actualizar-datos">
        <div className="form-section-actualizar-datos">
          <h2>Actualizar Datos</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-container-actualizar-datos">
              <div className="form-group-actualizar-datos">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  defaultValue={usuario.Nombre}
                  disabled
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  defaultValue={usuario.Apellido}
                  disabled
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  defaultValue={usuario.Correo}
                  required
                />
              </div>
              <div className="form-group-actualizar-datos password-container-actualizar-datos">
                <label htmlFor="contraseña">Contraseña:</label>
                <div className="password-container-actualizar-datos">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contraseña"
                    name="contraseña"
                    defaultValue={usuario.Contraseña}
                    required
                  />
                  <span
                    className="eye-icon-actualizar-datos"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="celular">Celular:</label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  defaultValue={usuario.Celular}
                  required
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  defaultValue={usuario.Direccion}
                  required
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="tipo_documento">Tipo documento:</label>
                <input
                  type="text"
                  id="tipo_documento"
                  name="tipo_documento"
                  defaultValue={usuario.TipoDocumento}
                  disabled
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="numero_documento">Número Documento:</label>
                <input
                  type="text"
                  id="numero_documento"
                  name="numero_documento"
                  defaultValue={usuario.NumeroDocumento}
                  disabled
                />
              </div>
            </div>
            <center>
              <button type="submit" className="button-actualizar-datos">Guardar</button>
            </center>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActualizarMisDatosG;
