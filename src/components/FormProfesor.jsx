import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import apiUrl from '../api';
import Swal from 'sweetalert2';
import { AlertaInicio } from '../Alertas';
import '../assets/styles/FormProfe.css';
import logo from '../assets/img/logos.png'

export default function FormProfesor() {
    const token = localStorage.getItem('token');
    const headers = { headers: { 'authorization': `Bearer ${token}` } };
    const email = useRef();
    const password = useRef();
    const passwordConfirmation = useRef();
    const nombre = useRef();
    const apellido = useRef();
    const doc_identidad = useRef();

    const [materias, setMaterias] = useState([]);
    const [grados, setGrados] = useState([]);
    const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
    const [gradosSeleccionados, setGradosSeleccionados] = useState([]);

    useEffect(() => {
        axios.get(apiUrl + 'materias', headers)
            .then(res => setMaterias(res.data.Response))
            .catch(res => console.log(res));

        axios.get(apiUrl + 'grados', headers)
            .then(res => setGrados(res.data.Response))
            .catch(res => console.log(res));
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

            axios.post(apiUrl + 'users/signup', data)
                .then(() => {
                    crearProfesor();
                })
                .catch((error) => {
                    console.error('Error al asignar email:', error);
                });
        }
    }

    function crearProfesor(e) {
        if (e) {
            e.preventDefault();
        }
        const data = {
            email_asignado: email.current.value.toLowerCase(),
            nombre: nombre.current.value,
            apellido: apellido.current.value,
            doc_identidad: doc_identidad.current.value,
            materias: materiasSeleccionadas,
            grados: gradosSeleccionados,
        };

        axios.post(apiUrl + 'profesores/new', data, headers)
            .then(res => AlertaInicio('success', 'Profesor Creado'))
            .catch(res => AlertaInicio('error', 'Error al crear Profesor'));
    }

    function eliminarMateria(index) {
        const nuevaListaMaterias = [...materiasSeleccionadas];
        nuevaListaMaterias.splice(index, 1);
        setMateriasSeleccionadas(nuevaListaMaterias);
    }

    function eliminarGrado(index) {
        const nuevaListaGrados = [...gradosSeleccionados];
        nuevaListaGrados.splice(index, 1);
        setGradosSeleccionados(nuevaListaGrados);
    }

    function gradoYaSeleccionado(selectedGrado) {
        return gradosSeleccionados.includes(selectedGrado);
    }

    return (
        <>
            <br />

            <div className='conten'>
                <div className='imagen'>
                    <img src={logo} />
                </div>
                <Form onSubmit={asignarEmail} className="formul">
                    <h2 className="h1">
                        Crear Profesor
                    </h2>
                    <div className='dox'>
                        <Form.Group className="mb-4">
                            <Form.Control
                                ref={email} type="email" required />
                            <label className='campo'>Asignar Email Instiduiconal</label>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Control ref={password} type="password" required />
                            <label className='campo'>Contraseña</label>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Control ref={passwordConfirmation} type="password" required />
                            <label className='campo'>Confirmar Contraseña</label>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Control ref={nombre} type="text" required />
                            <label className='campo'>Nombre</label>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Control ref={apellido} type="text" required />
                            <label className='campo'>Apellido</label>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Control ref={doc_identidad} type="number" required />
                            <label className='campo'>Documento de Identidad</label>
                        </Form.Group>

                        <div className='inputMates'>
                            <div className='contentMates'>
                                {materiasSeleccionadas.map((idMateria, index) => (
                                    <p key={index} className='materiaAdded'>
                                        {materias.find(materia => materia._id === idMateria)?.nombre}
                                        <svg onClick={() => eliminarMateria(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pop">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </p>
                                ))}
                            </div>
                        </div>

                        <select onChange={(e) => {
                            const selectedIndex = e.target.selectedIndex;
                            const selectedOption = e.target.options[selectedIndex];

                            if (selectedIndex === 0) {
                                return;
                            }

                            const idMateria = selectedOption.getAttribute("data-id");

                            if (materiasSeleccionadas.includes(idMateria)) {
                                return;
                            }

                            setMateriasSeleccionadas(prevMaterias => [...prevMaterias, idMateria]);
                            e.target.selectedIndex = 0;
                        }}>
                            <option>Seleccione las materias</option>
                            {materias?.map((materia) => (
                                <option key={materia._id} value={materia._id} data-id={materia._id}>
                                    {materia.nombre}
                                </option>
                            ))}
                        </select>
                        <div className='inputMates'>
                            <div className='contentMates'>
                                {gradosSeleccionados.map((grado, index) => (
                                    <p key={index} className='materiaAdded'>
                                        Grado {grado.num_grado}
                                        <svg onClick={() => eliminarGrado(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pop">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </p>
                                ))}
                            </div>
                        </div>
                        <select onChange={(e) => {
                            const selectedIndex = e.target.selectedIndex;
                            const selectedOption = e.target.options[selectedIndex];

                            if (selectedIndex === 0) {
                                return;
                            }
                            const selectedGrado = grados.find(grado => grado._id === selectedOption.value);
                            if (gradoYaSeleccionado(selectedGrado)) {
                                return;
                            }
                            setGradosSeleccionados(prevGrados => [...prevGrados, selectedGrado]);
                            e.target.selectedIndex = 0;
                        }}>
                            <option>Asignar grados</option>
                            {grados.map(grado =>
                                <option key={grado._id} value={grado._id}>
                                    {grado.num_grado}
                                </option>
                            )}
                        </select>
                        <Button variant="secondary" type="submit">
                            Crear
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
}
