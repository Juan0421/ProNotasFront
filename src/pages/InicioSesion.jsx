import '../assets/styles/Estilo.css'
import apiUrl from '../api'
import axios from 'axios'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {AlertaInicio} from '../Alertas'


export default function InicioSesion() {
  const email = useRef()
  const password = useRef()
  const navigate = useNavigate()


  function signIn(e){
    e.preventDefault()
    const data={
      email:email.current.value,
      password:password.current.value
    }
   axios.post(apiUrl + 'users/signin', data)
   .then(res =>{
    const token = res.data.token
    const role = res.data.user.role
    const email = res.data.user.email
    const id = res.data.user.id
    localStorage.setItem('token', token)
    localStorage.setItem('role',role)
    localStorage.setItem('email', email)
    localStorage.setItem('id',id )
    AlertaInicio('success', 'Has iniciado sesion!')
    navigate('/')
   })
   .catch(err =>{
    AlertaInicio('error', err.response.data.Response) 
   }
    ) 
  }

 



  return (
    <div className="login-box">
    <h1 className='titulo'>Inicio De Sesion</h1>
  
    <form>
      <div className="user-box">
        <input  ref={email} type="email"  name="email" required/>
        <label className='campo'>Usuario</label>
      </div>
      <br />
      <div className="user-box">
        <input  ref={password} type="password"  name="password" required/>
        <label className='campo'>Contraseña</label>
      </div>
      <a className='boton' onClick={signIn} type="submit">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      Iniciar
    </a>
    </form>
    </div>
  )
}