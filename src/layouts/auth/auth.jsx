import React from 'react'
import { Outlet } from 'react-router-dom'

function Auth() {

  document.body.classList.add('bg-account')
  return (
    <div className="page login-page">
      <Outlet />
    </div>

  )
}

export default Auth