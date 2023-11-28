import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../api';
import '../assets/styles/NavbarEstilo.css'
import { AlertaInicio } from '../Alertas';
export default function Navegacion() {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id')
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  function cerrarSesion() {
    axios.post(apiUrl + 'users/signout', null, { headers: { 'authorization': `Bearer ${token}` } })
      .then(res => {
        console.log(res);
        localStorage.clear();
        AlertaInicio('success', 'Has cerrado sesión');
        navigate('/');
      })
      .catch(error => {
        AlertaInicio('error', error.response.data.Response);
      });
  }

  return (
    <div className='borde'>
      <div className='nav'>
        <Link to={'/'}>Home</Link>
        {role === '3' && <Link to={'/tablaUser'}>Usuarios</Link>}
        {role==='2' && <Link to={`/calificaciones/${id}`}>Calificaciones</Link>}
        {role === '1' && <Link to={'/estudiantes'}>Estudiantes</Link>}

        {role === '3' && (
          <>
            <div className='' onClick={() => setShowDropdown(!showDropdown)}>
              <span className='down' >
                Agregar Usuario
              </span>
              {showDropdown && <div className='d-flex flex-column position-fixed dropmenu'>
                <Link to={'/newProfesor'}>Profesor</Link>
                <Link to={'/newEstudiante'}>Estudiante</Link>
              </div> }
             
            </div>

          </>

        )}

        {token ? null : <Link to={'/inicio'}>Iniciar Sesion</Link>}
        {token && <div className='text-primary cerrarSesion' onClick={cerrarSesion}>Cerrar Sesion</div>}
      </div>
    </div>
  );
}
