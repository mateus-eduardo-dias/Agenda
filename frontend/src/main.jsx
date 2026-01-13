import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './global/index.css'
import ErrorElement from './global/errorElement.jsx'
import Home from './Home/Home.jsx'
import NotFoundPage from './global/NotFoundPage.jsx'
import RootLayout from './RootLayout.jsx'

const router = createBrowserRouter([
  {path: '/', element:<RootLayout />, errorElement: <ErrorElement />, children: [
    {path: '/', element:<Home />},
    {path: '/dashboard', element:<NotFoundPage />},
    {path: '*', element:<NotFoundPage />}
  ]},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
