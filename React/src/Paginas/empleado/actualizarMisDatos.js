import React, { useEffect, useState } from 'react';
import NavBar from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import axios from 'axios';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Ensures the container takes at least the height of the viewport */
`;

const FormSection = styled.div`
  background: #f4f4f4;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px; /* Limits the maximum width of the form */
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers the content horizontally */
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  width: 100%; /* Ensure the form groups take the full width of their container */

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  input[disabled] {
    background: #e9ecef;
  }

  .password-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-container input {
    padding-right: 40px;
  }

  .password-container .eye-icon {
    position: absolute;
    right: 10px;
    cursor: pointer;
    font-size: 1.2em;
  }
`;

const Button = styled.button`
  background-color: #36bf18;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: block;
  width: 100%;
  max-width: 200px;
  margin: 20px auto 0; /* Center the button and add margin */
  
  &:hover {
    background-color: #28a10d;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
`;

const ActualizarMisDatos = () => {
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
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      });

      swalWithBootstrapButtons.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.put(`http://localhost:3002/Usuarios/${usuario.id}`, {
              Nombre: usuario.Nombre, // No editable
              Apellido: usuario.Apellido, // No editable
              Correo: event.target.correo.value,
              Contraseña: event.target.contraseña.value,
              Celular: event.target.celular.value,
              Direccion: event.target.direccion.value,
              TipoDocumento: usuario.TipoDocumento, // No editable
              NumeroDocumento: usuario.NumeroDocumento // No editable
            });
            swalWithBootstrapButtons.fire({
              title: 'Actualizado!',
              text: 'Tus datos han sido actualizados.',
              icon: 'success'
            });
          } catch (error) {
            console.error('Error al actualizar los datos:', error);
            swalWithBootstrapButtons.fire({
              title: 'Error',
              text: 'Hubo un problema al actualizar los datos.',
              icon: 'error'
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelado',
            text: 'Tus datos no han sido actualizados.',
            icon: 'error'
          });
        }
      });
    }
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <NavBar />
      <Container>
        <FormSection>
          <h2>Actualizar Datos</h2>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={usuario.Nombre}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={usuario.Apellido}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  defaultValue={usuario.Correo}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="contraseña">Contraseña:</label>
                <div className="password-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contraseña"
                    name="contraseña"
                    defaultValue={usuario.Contraseña}
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </FormGroup>
              <FormGroup>
                <label htmlFor="celular">Celular:</label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  defaultValue={usuario.Celular}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  defaultValue={usuario.Direccion}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="tipo_documento">Tipo documento:</label>
                <input
                  type="text"
                  id="tipo_documento"
                  name="tipo_documento"
                  defaultValue={usuario.TipoDocumento}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="numero_documento">Número Documento:</label>
                <input
                  type="text"
                  id="numero_documento"
                  name="numero_documento"
                  defaultValue={usuario.NumeroDocumento}
                  disabled
                />
              </FormGroup>
            </FormGrid>
            <Button type="submit">Guardar</Button>
          </form>
        </FormSection>
      </Container>
      <Footer />
    </div>
  );
};

export default ActualizarMisDatos;
