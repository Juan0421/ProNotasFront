import React from 'react'
import axios from 'axios';
import apiUrl from '../api';
import { Form } from 'react-bootstrap';

export default function SwitchEstudiantes({isActive, id, onSwitchChange }) {
    const token = localStorage.getItem('token')
  const headers = { headers: { 'authorization': `Bearer ${token}` } };

  const handleCheckboxChange=async()=>{
    const is_active = !isActive

    let data = {
        active:is_active
    }
    await axios.put(apiUrl + `estudiantes/${id}`, data)
    onSwitchChange(id, isActive)
}
  return (
    <Form.Check type='switch' id="custom-switch" checked={isActive} onChange={handleCheckboxChange}/>
  )
}
