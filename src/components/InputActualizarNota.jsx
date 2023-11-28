import React from 'react';
import { useRef } from 'react';
import { AlertaInicio } from '../Alertas';
import apiUrl from '../api';
import axios from 'axios';
import '../assets/styles/inputUpd.css'
export default function InputActualizarNota({ state, notaIndex, notasUpd, notaId, actualizarNotas  }) {
  const nota = useRef();
  const token = localStorage.getItem('token');
  const headers = { headers: { 'authorization': `Bearer ${token}` } };

  async function actualizarNota(e) {
    e.preventDefault()
    const nuevasNotas = [...notasUpd];
    const valorNota = nuevasNotas[notaIndex] = nota.current.value;

    if (valorNota === '') {
      AlertaInicio('error', 'Campo de notas Vacío');
    } else {
      const data = {
        nota: nuevasNotas
      };

      axios.put(apiUrl + `notas/${notaId}`, data, headers)
        .then(res =>{
          AlertaInicio('success', 'Nota Actualizada')
          actualizarNotas(nuevasNotas);
        } )
        .catch(res => AlertaInicio('error', 'Error al crear la nota'));
    }
  }

  return (
    <>
      <div className="modal" style={{ display: state ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Actualizar Nota</h5>
              <button type="button" className="btn-close" onClick={state}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={actualizarNota}>
                <input
                  ref={nota}
                  type="number"
                  className="form-control boton"
                  placeholder="Inserte la actualización de la nota (1-5)"
                  min="0"
                  max="5"
                  step="0.1"
                />
                <button type="submit" className="btn btn-save-changes">Guardar cambios</button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={state}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
