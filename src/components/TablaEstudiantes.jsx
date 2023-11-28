import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import apiUrl from '../api';
import { Link } from 'react-router-dom';
import '../assets/styles/Estudi.css'


export default function TablaEstudiantes() {
    const token = localStorage.getItem('token');
    const headers = { headers: { 'authorization': `Bearer ${token}` } };
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCurso, setFiltroCurso] = useState('');
    const [grados, setGrados] = useState([]);
    useEffect(() => {
        axios.get(apiUrl + 'estudiantes', headers)
            .then((res) => setEstudiantes(res.data.Response))
            .catch((error) => console.log(error));

        axios.get(apiUrl + 'grados/profesor', headers)
            .then(res => setGrados(res.data.Response))
            .catch(res => console.log(res));
    }, []);
    useEffect(() => {
        const estudiantesFiltrados = filtrarEstudiantes();
        setEstudiantesFiltrados(estudiantesFiltrados);
    }, [estudiantes, grados, filtroNombre, filtroCurso]);
    const estudiantesActivos = estudiantes.filter(estudiante => estudiante.is_active === true);
    const filtrarEstudiantes = () => {
        const estudiantesEnGrados = estudiantesActivos.filter(estudiante =>
            grados.some(grado => estudiante?.grado_pertenece?.num_grado === grado.num_grado)
        );
        return estudiantesEnGrados.filter((estudiante) => {
            const nombreEstudiante = estudiante.nombre.toLowerCase();
            const nombreFiltro = filtroNombre.toLowerCase();
            const cursoFiltro = filtroCurso !== '' ? parseInt(filtroCurso, 10) : '';

            return nombreEstudiante.includes(nombreFiltro) && (cursoFiltro === '' || estudiante.grado_pertenece.num_grado === cursoFiltro);
        });
    };
    return (
        <>
            <div>
                <label htmlFor="filtroNombre">Filtrar por Nombre: </label>
                <input
                    type="text"
                    id="filtroNombre"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="filtroCurso">Filtrar por Curso: </label>
                <select className='list'
                    id="filtroCurso"
                    value={filtroCurso}
                    onChange={(e) => setFiltroCurso(e.target.value)}
                >
                    <option className='list' value="">Todos</option>
                    {grados.map(grado=>(
                         <option key={grado._id} value={grado.num_grado}>{grado.num_grado}</option>
                    ))}
                </select>
            </div>

            <Table className="mt-4" striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Gmail</th>
                        <th>Curso</th>
                        <th>Inspeccionar</th>
                    </tr>
                </thead>
                {estudiantesFiltrados.map((estudiante) => (
                    <tbody key={estudiante._id}>
                        <tr>
                            <td>{estudiante.nombre}</td>
                            <td>{estudiante.user_id.email}</td>
                            <td>{estudiante?.grado_pertenece?.num_grado}°</td>
                            <td className="fila bg-dark">
                                <Link to={`/detalle/${estudiante._id}`}>Inspeccionar</Link>
                            </td>
                        </tr>
                    </tbody>
                ))}
            </Table>
        </>
    );
}
