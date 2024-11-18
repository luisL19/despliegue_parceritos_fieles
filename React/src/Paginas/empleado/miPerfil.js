import React, { useEffect, useState } from 'react';
import NavBar from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import axios from 'axios';
import styled from 'styled-components';
import Imagen from '../../assets/Imagenes/usuario.png'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
`;

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileSection = styled.section`
  background: #f4f4f4;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: black;
  text-align: center;
  margin-bottom: 20px;
`;

const ProfilePic = styled.div`
  text-align: center;
  margin-bottom: 20px;

  img {
    border-radius: 50%;
    width: 120px;
    height: 120px;
    object-fit: cover;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Dos columnas */
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  i {
    font-size: 24px;
    margin-right: 10px;
    color: #007bff;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const Button = styled.a`
  display: inline-block;
  background-color: #39c21b;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #45b00b;
  }
`;

const MiPerfil = () => {
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
    <Wrapper>
      <NavBar />
      <MainContent>
        <Container>
          <ProfileSection>
            <Title>Perfil Empleado</Title>
            <ProfilePic>
              <img src={Imagen} alt="Profile" />
            </ProfilePic>
            <InfoGrid>
              <InfoItem>
                <i className="icon-user" />
                <p><strong>Nombre</strong><br />{usuario.Nombre}</p>
              </InfoItem>
              <InfoItem>
                <i className="icon-user" />
                <p><strong>Apellido</strong><br />{usuario.Apellido}</p>
              </InfoItem>
              <InfoItem>
                <i className="icon-email" />
                <p><strong>Correo</strong><br />{usuario.Correo}</p>
              </InfoItem>
              <InfoItem>
                <i className="icon-phone" />
                <p><strong>Celular</strong><br />{usuario.Celular}</p>
              </InfoItem>
              <InfoItem>
                <i className="icon-document" />
                <p><strong>Tipo documento</strong><br />{usuario.TipoDocumento}</p>
              </InfoItem>
              <InfoItem>
                <i className="icon-lock" />
                <p><strong>Contraseña</strong><br />********</p>
              </InfoItem>
              <InfoItem>
                <i className="icon-address" />
                <p><strong>Dirección</strong><br />{usuario.Direccion}</p>
              </InfoItem>
              <InfoItem>
                <i className="icon-document" />
                <p><strong>Numero documento</strong><br />{usuario.NumeroDocumento}</p>
              </InfoItem>
            </InfoGrid>
            <div style={{ textAlign: 'center' }}>
              <Button href="/actualizarDatosE">Actualizar Datos</Button>
            </div>
          </ProfileSection>
        </Container>
      </MainContent>
      <Footer />
    </Wrapper>
  );
}

export default MiPerfil;
