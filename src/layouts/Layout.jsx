import React from 'react'
import Navegacion from '../components/Navegacion'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <Navegacion />
      <div>
        <Outlet />
      </div>
    
    </>
  )
}