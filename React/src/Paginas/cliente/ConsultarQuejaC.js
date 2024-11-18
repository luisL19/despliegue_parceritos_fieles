import React, { useState, useEffect, useCallback, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net';
import NavBarCliente from '../../components/navBarCliente';
import Footer from '../../components/footer';
import Swal from 'sweetalert2';
import './consultarQuejasC.css';

const ConsultarQuejasC = () => {
  const [quejas, setQuejas] = useState([]);
  const tableRef = useRef(null);
  const userId = localStorage.getItem('usuarioId');

  // Fetch quejas desde el backend
  const fetchQuejas = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/clientes/${userId}/quejas`);
      const data = await response.json();

      if (response.ok) {
        setQuejas(data.reverse());
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener las quejas',
          text: data.error || 'No se pudieron cargar las quejas.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al obtener las quejas',
        text: 'Ocurrió un problema al intentar cargar las quejas.',
      });
    }
  }, [userId]);

  useEffect(() => {
    fetchQuejas();
  }, [fetchQuejas]);

  // Inicializar DataTables
  useEffect(() => {
    if (quejas.length > 0 && tableRef.current) {
      $(tableRef.current).DataTable({
        data: quejas,
        columns: [
          { title: 'ID', data: 'id_Queja' },
          {
            title: 'Fecha',
            data: 'fecha',
            render: (data) => (data ? new Date(data).toLocaleDateString() : 'Fecha desconocida'),
          },
          { title: 'Contenido', data: 'contenido' },
          {
            title: 'Acciones',
            data: 'id_Queja',
            render: (data) =>
              `<button class="btn btn-primary actualizar-btn" data-id="${data}">Editar</button>`,
          },
        ],
        language: {
          url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json',
        },
        responsive: true,
        destroy: true,
      });
    }

    return () => {
      // Destruir instancia de DataTables al desmontar el componente
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, [quejas]);

  return (
    <div className="page-container">
      <NavBarCliente />
      <main>
        <section className="container">
          <div className="content">
            <h2 className="fade-in">Consultar Quejas</h2>
            <div className="table-wrapper">
              <table ref={tableRef} className="display" style={{ width: '100%' }}></table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ConsultarQuejasC;
