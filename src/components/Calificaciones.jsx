import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiUrl from '../api';
import Table from 'react-bootstrap/Table';
import { useParams } from 'react-router-dom';
import Pdf from './Pdf';
import aplausos from '../assets/sonidos/aplausos.mp3'
import '../assets/styles/CalifiEstilos.css'

export default function Calificaciones() {
    const { id } = useParams();
    const [estudiante, setEstudiante] = useState({});
    const [notas, setNotas] = useState({});
    const [objetoNotas, setObjetoNotas] = useState({});
    const [sumatoriaPromediosParciales, setSumatoriaPromediosParciales] = useState(0);

    useEffect(() => {
        axios.get(apiUrl + `estudiantes/calificaciones/${id}`)
            .then(res => setEstudiante(res.data.Response))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        // Organizar las notas por período
        const notasPorPeriodoTemp = {};

        estudiante?.notas?.forEach((nota) => {
            const periodo = `periodo#${nota.periodo_id.numero_p}`;

            if (!notasPorPeriodoTemp[periodo]) {
                notasPorPeriodoTemp[periodo] = {
                    notas: [],
                    valor_p: nota.periodo_id.valor_p,
                    promedioPeriodo: 0,
                    cantidadPromedios: 0,
                };
            }
            notasPorPeriodoTemp[periodo].notas.push(nota);
        });

        // Calcular el promedio de cada período
        Object.keys(notasPorPeriodoTemp).forEach((periodo) => {
            notasPorPeriodoTemp[periodo].notas.forEach((nota) => {
                const promedio = nota.nota.reduce((acc, nota) => acc + nota, 0) / nota.nota.length;
                notasPorPeriodoTemp[periodo].promedioPeriodo += promedio;
                notasPorPeriodoTemp[periodo].cantidadPromedios++;
            });
        });

        setNotas(notasPorPeriodoTemp);
    }, [estudiante]);

    useEffect(() => {
        // Crear el objetoNotas con la estructura deseada
        const objetoNotasTemp = {};
        let sumatoriaPromedios = 0;

        // Encontrar el número máximo de notas entre todas las materias
        const maxNumGrades = Math.max(...Object.values(notas).map(periodo => periodo.notas[0]?.nota.length || 0));

        Object.keys(notas).forEach((periodo) => {
            objetoNotasTemp[periodo] = {
                notas: [],
                valor_p: notas[periodo].valor_p,
                promedioPeriodo: 0,
                cantidadPromedios: notas[periodo].cantidadPromedios,
            };

            // Agregar las notas al objeto
            notas[periodo].notas.forEach((nota) => {
                const notasMateria = nota.nota.map((n) => n.toString());
                const promedio = (nota.nota.reduce((acc, n) => acc + n, 0) / nota.nota.length).toFixed(2);

                // Rellenar con '-' para igualar el número de notas
                const notasPadded = Array.from({ length: maxNumGrades }).map((_, index) => nota.nota[index] || '-');

                objetoNotasTemp[periodo].notas.push({
                    materia: nota.materia_id.nombre,
                    notas: notasPadded,
                    promedio: promedio,
                    emoji: getEmojiFromPromedio(promedio),
                });

                // Acumular el promedio de cada materia
                objetoNotasTemp[periodo].promedioPeriodo += parseFloat(promedio);
            });

            // Calcular el promedio total dividiendo la sumatoria de los promedios entre la cantidad total de materias
            objetoNotasTemp[periodo].promedioPeriodo /= objetoNotasTemp[periodo].cantidadPromedios;
            objetoNotasTemp[periodo].promedioPeriodo = objetoNotasTemp[periodo].promedioPeriodo.toFixed(2);

            // Sumar al total de promedios parciales
            sumatoriaPromedios += parseFloat((objetoNotasTemp[periodo].promedioPeriodo * notas[periodo].valor_p).toFixed(2));
        });

        // Actualizar la sumatoria de promedios parciales
        setSumatoriaPromediosParciales(sumatoriaPromedios);

        setObjetoNotas(objetoNotasTemp);
    }, [notas]);

    const getEmojiFromPromedio = (promedio) => {
        if (promedio >= 1 && promedio <= 2.9) {
            return '😭'; // Emoji triste
        } else if (promedio >= 3.0 && promedio <= 3.7) {
            return '😐'; // Emoji neutral
        } else if (promedio >= 3.8 && promedio <= 5) {
            return '🥳'; // Emoji feliz
        }
        return '';
    };
    const handleEmojiClick = (emoji) => {
        console.log(`Emoji clickeado: ${emoji}`);
    };

    async function reproducirSonido(emoji) {
        try {
            const { default: audioFile } = await import('../assets/sonidos/aplausos.mp3');
            const { default: audioFile2 } = await import('../assets/sonidos/relax.mp3')
            const { default: audioFile3 } = await import('../assets/sonidos/sad.mp3')
            if (emoji === '🥳') {
                const aplausos = new Audio(audioFile);
                await aplausos.load();
                aplausos.play();
            } else if (emoji === '😐') {
                const meditacion = new Audio(audioFile2);
                await meditacion.load();
                meditacion.play();
            } else if (emoji === '😭') {
                const sad = new Audio(audioFile3);
                await sad.load();
                sad.play();
            }


        } catch (error) {
            console.error('Error al reproducir el sonido:', error);
        }
    }

    return (
        <div className='tableContenido'>
            {estudiante?.notas?.length === 0 ? (<div>No tienes notas </div>) : (
                <>
            
                    {Object.keys(objetoNotas).map((periodo) => {
                        // Find the maximum number of grades across all subjects
                        const maxNumGrades = Math.max(...objetoNotas[periodo].notas.map(nota => nota.notas.length));

                        return (
                        
                            <div key={periodo}>
                                <h3>{periodo}</h3>
                                <Table className="mt-4" striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>Materia</th>
                                            {Array.from({ length: maxNumGrades }).map((_, index) => (
                                                <th key={index}>{`Nota${index + 1}`}</th>
                                            ))}
                                            <th>Promedio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {objetoNotas[periodo].notas.map((nota, index) => (
                                            <tr key={index}>
                                                <td>{nota.materia}</td>
                                                {Array.from({ length: maxNumGrades }).map((_, index) => (
                                                    <td key={index}>{nota.notas[index] || '-'}</td>
                                                ))}
                                                <td>
                                                    <span
                                                        style={{ cursor: 'pointer', marginRight: '8px' }}
                                                        onClick={() => reproducirSonido(nota.emoji)}
                                                    >
                                                        {nota.emoji}
                                                    </span>
                                                    {nota.promedio}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <div className='pro'>
                                <p >Promedio Final del Período: {objetoNotas[periodo].promedioPeriodo}</p>
                                <p >Promedio parcial: {((objetoNotas[periodo].promedioPeriodo) * objetoNotas[periodo].valor_p).toFixed(2)}</p>
                                </div>
                            </div>
                        );
                    })}

                    <div>
                        <h3>Sumatoria de Promedios Parciales</h3>
                        <p>{sumatoriaPromediosParciales.toFixed(2)}</p>
                    </div>

                       <div className='btn'>
                        <Pdf notas={objetoNotas} notaFinal={sumatoriaPromediosParciales.toFixed(2)} />
                        </div>
                </>
            )}
        </div>
    );
}
