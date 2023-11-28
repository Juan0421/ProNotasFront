import {createBrowserRouter } from "react-router-dom";
import Navegacion from "../components/Navegacion";
import TablaUser from "../components/TablaUser";
import InicioSesion from "../pages/InicioSesion";
import Layout from "../layouts/Layout";
import App from "../App";
import FormProfesor from "../components/FormProfesor";
import Estudiantes from "../pages/Estudiantes";
import DetalleEstudiante from "../components/DetalleEstudiante";
import FormEstudiante from "../components/FormEstudiante";
import Calificaciones from "../components/Calificaciones";

const router = createBrowserRouter([
  {
    path:'/', element:<Layout/>,
    children:[
      {path:'/', element:<App/>},
      {path:'/navegacion', element:<Navegacion/>},
      {path:'/tablaUser', element:<TablaUser/>},
      {path:'/inicio', element:<InicioSesion/>},
      {path:'/newProfesor', element:<FormProfesor/>},
      {path:'/estudiantes', element:<Estudiantes/>},
      {path:`/detalle/:id`, element:<DetalleEstudiante/>},
      {path:'/newEstudiante',element:<FormEstudiante/>},
      {path:'/calificaciones/:id', element:<Calificaciones/>}
    ]

  }
  
    
  

  ])

export default router