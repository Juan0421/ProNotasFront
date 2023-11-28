import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Pdf({ notas, notaFinal }) {

    function generate() {
        // Crear una instancia de jsPDF
        const doc = new jsPDF();

        // Iterar sobre los periodos y construir las tablas en el PDF
        Object.keys(notas).forEach((periodo, index) => {
            const data = [['Materia', 'Notas', 'Promedio']];

            // Agregar filas de datos para cada materia
            notas[periodo].notas.forEach((nota) => {
                // Filtrar las notas que son '-'
                const filteredNotas = nota.notas.filter((n) => n !== '-');

                const row = [
                    nota.materia,
                    filteredNotas.join('  |  '),
                    nota.promedio,
                ];
                data.push(row);
            });

            // Agregar la tabla al documento PDF
            const startY = index === 0 ? 20 : doc.autoTable.previous.finalY + 10; // Separación entre tablas
            doc.text(`Periodo ${periodo}`, 14, startY);
            doc.autoTable({
                head: [data[0]], // Cabecera de la tabla
                body: data.slice(1), // Cuerpo de la tabla (sin la cabecera)
                startY: startY + 10,
            });
        });

        // Agregar la nota final al final del PDF
        const finalY = doc.autoTable.previous.finalY + 10;
        doc.text(`Nota Final: ${notaFinal}`, 14, finalY);

        // Guardar el documento
        doc.save('Reporte academico.pdf');
    }

    return (
        <div>
            <button onClick={generate}>Descargar reporte academico</button>
        </div>
    );
}
