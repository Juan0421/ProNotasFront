import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import apiUrl from '../api';
import { AlertaInicio } from '../Alertas';
import InputActualizarNota from './InputActualizarNota';
import Table from 'react-bootstrap/Table';
import '../assets/styles/DetalleEstudiante.css';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function DetalleEstudiante() {
  const token = localStorage.getItem('token');
  const headers = { headers: { 'authorization': `Bearer ${token}` } };

  const { id } = useParams();
  const nota = useRef();

  const [materias, setMaterias] = useState([]);
  const [periodos, setPeridos] = useState([]);
  const [estudiante, setEstudiante] = useState([]);
  const [idMateria, setIdMateria] = useState('');
  const [idPeriodo, setIdPeriodo] = useState('');

  const [notasUpd, setNotasUpd] = useState(0);
  const [notaIndex, setNotaIndex] = useState(0);
  const [idNota, setIdNota] = useState('');
  const [showInput, setShowInput] = useState(false);

  const [resultadoArray, setResultadoArray] = useState(null);


  async function montarPromedio(){
    const data={
      notaFinal:resultadoArray
    }

    Swal.fire({
      title: "Estas seguro?",
      text: "No podras revertir este cambio",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Subir Promedio"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.patch(apiUrl+'notas/final',data ,headers )
        Swal.fire({
          title: "Listo!",
          text: "Los promedios han sido montados en plataforma",
          icon: "success"
        });
      }
    });
   
  }

  function openCloseInput() {
    setShowInput(!showInput);
  }

  function capturarNota(notas, notaIndex) {
    notas.map((nota) => {
      setIdNota(nota._id);
      const actualizacionNotas = [...nota.nota];
      setNotaIndex(notaIndex);
      setNotasUpd(actualizacionNotas);
    });
    openCloseInput();
  }

  function actualizarNotasDespuesDeActualizar(nuevasNotas) {
    setNotasUpd(nuevasNotas);
  }

  const notasPorPeriodo = {};

  estudiante?.notas?.forEach((nota) => {
    if (!notasPorPeriodo[nota.periodo_id.numero_p]) {
      notasPorPeriodo[nota.periodo_id.numero_p] = [];
    }
    notasPorPeriodo[nota.periodo_id.numero_p].push(nota);
  });

  const maxCantidadNotas = Math.max(
    ...Object.values(notasPorPeriodo).map((periodo) =>
      Math.max(...periodo.map((nota) => nota.nota.length))
    )
  );

  useEffect(() => {
    axios.get(apiUrl + 'profesores/one', headers)
      .then((res) => setMaterias(res.data.Response.materias))
      .catch((error) => console.log(error));

    axios.get(apiUrl + 'periodos')
      .then((res) => setPeridos(res.data.Response))
      .catch((error) => console.log(error));

    axios.get(apiUrl + `estudiantes/${id}`)
      .then((res) => setEstudiante(res.data.Response))
      .catch((error) => console.log(error));
  }, [notasUpd]);

  function calcularPromedio(notas) {
    const suma = notas.reduce((total, nota) => total + nota.nota.reduce((acc, value) => acc + value, 0), 0);
    const cantidadNotas = notas.reduce((total, nota) => total + nota.nota.length, 0);

    return cantidadNotas > 0 ? suma / cantidadNotas : 0;
  }


  function armarArrayDeNotasConPromedio() {
    const todasLasNotas = estudiante?.notas || [];

    // Crear un array de objetos con ID y promedio
    const arrayResultado = todasLasNotas.map((nota) => ({
      id: nota._id,
      promedio: calcularPromedio([nota]).toFixed(2),
    }));
    setResultadoArray(arrayResultado);

    if(arrayResultado){
      montarPromedio()
    }
  }

  function crearNota(e) {
    e.preventDefault();

    const data = {
      nota: nota.current.value,
      estudiante_id: id,
      periodo_id: idPeriodo,
    };

    axios.post(apiUrl + `notas/new/${idMateria}`, data, headers)
      .then((res) => {
        AlertaInicio('success', 'Nota Asignada');
        setNotasUpd(notasUpd + 1);
      })
      .catch((error) => {
        AlertaInicio('error', 'Error al Asignar Nota');
      });
  }
  
  return (
    <>
      <div className='tableContenido'>
        <h2 className='pr2'>Información del Usuario</h2>
        <h4>
          {estudiante?.nombre} {estudiante?.apellido} Grado:{estudiante?.grado_pertenece?.num_grado}°
        </h4>

        {showInput && <InputActualizarNota notaIndex={notaIndex} notasUpd={notasUpd} notaId={idNota} state={openCloseInput} actualizarNotas={actualizarNotasDespuesDeActualizar} />}

        {Object.keys(notasPorPeriodo).map((periodo) => (
          <div key={periodo}>
            <h3>Periodo {periodo}</h3>
            <Table className="mt-4" striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Materias</th>
                  {Array.from({ length: maxCantidadNotas }).map((_, index) => (
                    <th key={index}>{`Nota${index + 1}`}</th>
                  ))}
                  <th>Promedio</th>
                </tr>
              </thead>
              <tbody>
                {notasPorPeriodo[periodo].map((nota) => (
                  <tr key={nota._id}>
                    <td>{nota.materia_id.nombre}</td>
                    {Array.from({ length: maxCantidadNotas }).map((_, index) => (
                      <td className='contNota' key={index}>
                        {nota.nota[index] !== undefined ? nota.nota[index] : '-'}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pencil" onClick={() => capturarNota(notasPorPeriodo[periodo], index)}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </td>
                    ))}
                    <td>
                      {nota.nota.length > 0
                        ? (nota.nota.reduce((acc, nota) => acc + nota, 0) / nota.nota.length).toFixed(2)
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ))}
      

      <form onSubmit={crearNota}>
        <input
          ref={nota}
          type="number"
          placeholder="Inserte una nota"
          min="1"
          max="5"
          step="0.1"
        />
        <select className='sele' onClick={(e) => setIdMateria(e.target.value)}>
          <option value="">Seleccionar Materia</option>
          {materias.map((m) => (
            <option key={m._id} value={m._id}>
              {m.nombre}
            </option>
          ))}
        </select>
        <select className='sele' onClick={(e) => setIdPeriodo(e.target.value)}>
          <option value="">Seleccionar Periodo</option>
          {periodos.map((p) => (
            <option key={p._id} value={p._id}>
              {p.numero_p}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary"> Crear Nota</button>
      </form>
    

      {estudiante?.notas?.length !== 0 ?  (

      <button onClick={armarArrayDeNotasConPromedio}>
       Montar notas
      </button>):('')
         }
     </div>
    </>
  );
}
