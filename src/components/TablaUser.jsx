import Table from 'react-bootstrap/Table';
import axios from 'axios';
import apiUrl from '../api';
import { useEffect, useState } from 'react';
import SwitchProfes from './SwitchProfes';
import SwitchEstudiantes from './SwitchEstudiantes';
export default function TablaUser() {
  const token = localStorage.getItem('token')
  const headers = { headers: { 'authorization': `Bearer ${token}` } };
  const [estudiantes, setEstudiantes] = useState([]);
  const [profesores, setProfesores] = useState([])
  const [updEstudiantes, setUpdEstudiantes]=useState()
  const [updProfes, setUpdProfes]=useState()

  useEffect(() => {
    axios.get(apiUrl + 'estudiantes', headers)
      .then(res => setEstudiantes(res.data.Response))
      .catch(error => console.log(error));

    axios.get(apiUrl + 'profesores', headers).then(res => setProfesores(res.data.Response)).catch(res => console.log(res))
  }, [updProfes, updEstudiantes]);
 

  function handleSwitchChange(profeId, isActive) {
    const updatedProfes = profesores.map(profe => {
      if (profe._id === profeId) {
        return { ...profe, active: isActive }
      }
      return profe
    })
    setProfesores(updatedProfes)
    setUpdProfes(updatedProfes)
  }


  function handleSwitchChangeForStudents(EstudianteId, isActive) {
    const updatedEstudiantes = estudiantes.map(est => {
      if (est._id === EstudianteId) {
        return { ...est, active: isActive }
      }
      return est
    })
    setEstudiantes(updatedEstudiantes)
    setUpdEstudiantes(updatedEstudiantes)
  }
  



  return (
    <>
      <h2>Estudiantes</h2>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Doc.identidad</th>
            <th>Email</th>
            <th>Grado</th>
            <th>Estado</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map(est => (
            <tr key={est._id}>
              <td>{est.nombre}</td>
              <td>{est.apellido}</td>
              <td>{est.doc_identidad}</td>
              <td>{est.user_id.email}</td>
              <td>{est.grado_pertenece.num_grado}°</td>
              <td>{est.is_active ? 'Activo' : 'Inactivo'}</td>
              <td>
                <SwitchEstudiantes
                 isActive={est.is_active}
                 id={est._id}
                 onSwitchChange={handleSwitchChangeForStudents}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Profesores</h2>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Doc.identidad</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map(profe => (
            <tr key={profe._id}>
              <td>{profe.nombre}</td>
              <td>{profe.apellido}</td>
              <td>{profe.doc_identidad}</td>
              <td>{profe?.user_id?.email}</td>
              <td>{profe.is_active ? 'Activo' : 'Inactivo'}</td>
              <td>
              <SwitchProfes
                isActive={profe.is_active}
                id={profe._id}
                onSwitchChange={handleSwitchChange}
                 />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </>
  );
}
