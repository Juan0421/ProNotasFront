import React, { useRef, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import apiUrl from '../api';
import { AlertaInicio } from '../Alertas';
import '../assets/styles/Form.css';
import Swal from 'sweetalert2';
import '../assets/styles/Form.css'
import logo from '../assets/img/logos.png'

export default function FormEstudiante() {
  const token = localStorage.getItem('token')
  const headers = { headers: { 'authorization': `Bearer ${token}` } };
  const email = useRef();
  const password = useRef();
  const passwordConfirmation = useRef();
  const nombre = useRef();
  const apellido = useRef();
  const doc_identidad = useRef();

  const [grados, setGrados] = useState([]);
  const [idGrado, setIdGrados] = useState('');
  useEffect(() => {
    axios.get(apiUrl + 'grados', headers).then((res) => setGrados(res.data.Response)).catch((error) => console.log(error));
  }, []);

  function asignarEmail(e) {
    e.preventDefault();
    const enteredPassword = password.current.value;
    const confirmationPassword = passwordConfirmation.current.value;

    if (enteredPassword !== confirmationPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    } else {
      const data = {
        email: email.current.value.toLowerCase(),
        password: enteredPassword,
      };

      axios
        .post(apiUrl + 'users/signup', data)
        .then(() => {
          crearEstudiante();
        })
        .catch((error) => {
          console.error('Error al asignar email:', error);
        });
    }
  }

  function crearEstudiante(e) {
    if (e) {
      e.preventDefault();
    }
    const data = {
      email_asignado: email.current.value.toLowerCase(),
      nombre: nombre.current.value,
      apellido: apellido.current.value,
      doc_identidad: doc_identidad.current.value,
      grado_pertenece: idGrado,
    };

    axios
      .post(apiUrl + 'estudiantes/new', data, headers)
      .then((response) => {
        AlertaInicio('success', 'Estudiante Creado');
      })
      .catch((error) => {
        console.error('Error al crear estudiante:', error);
        AlertaInicio('error', 'Error al crear estudiante');
      });
  }

  return (
    <>
      <br />

      <div className="contenido">
        <div className="imagen">
          <img src={logo} />
        </div>
        <Form onSubmit={asignarEmail} className="formulario">
          <h2 className='h2'>
            Crear Estudiante
          </h2>
          <div className="box">
            <Form.Group className="mb-3">
              <Form.Control
                ref={email} type="email" required/>
                    <label className='campo'>Asignar Email Instiduiconal</label>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control ref={password} type="password" required />
              <label className='campo'>Contraseña</label>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control ref={passwordConfirmation} type="password"  required />
              <label className='campo'>Confirmar Contraseña</label>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control ref={nombre} type="text"  required />
              <label className='campo'>Nombre</label>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control ref={apellido} type="text" required />
              <label className='campo'>Apellido</label>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control ref={doc_identidad} type="number" required />
              <label className='campo'>Documento de Identidad</label>
              </Form.Group>
               

              <select onClick={(e) => setIdGrados(e.target.value)}>
                <option value="">Seleccione el grado a cursar</option>
                {grados?.map((grado) => (
                  <option key={grado._id} value={grado._id}>
                    {grado.num_grado}
                  </option>
                ))}
              </select>
            
            <Button variant="secondary" type="submit">
              Enviar
            </Button>
          </div>
        </Form>
      </div>
      <br />
    </>
  );
}
