import React from 'react'
import ReactDOM from 'react-dom/client'
import router from './routes/routes.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)
