import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './global/index.css'
import ErrorElement from './global/errorElement.jsx'
import NotFoundPage from './global/NotFoundPage.jsx'
import RootLayout from './RootLayout.jsx'
import Home from './Home/Home.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import Register from './Auth/Register/Register.jsx'
import { registerAction } from './Auth/Register/registerAction.jsx'
import Login from './Auth/Login/Login.jsx'

const router = createBrowserRouter([
  {path: '/', element:<RootLayout />, errorElement: <ErrorElement />, children: [
    {path: '/', element:<Home />},
    {path: '/register', element:<Register />, action:registerAction},
    {path: '/login', element:<Login />},
    {path: '/dashboard', element:<Dashboard />},
    {path: '*', element:<NotFoundPage />}
  ]},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
