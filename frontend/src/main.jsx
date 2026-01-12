import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import ErrorElement from './errorElement.jsx'
import Home from './Home/Home.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import NotFoundPage from './NotFoundPage.jsx'

const router = createBrowserRouter([
  {path: '/', element:<Home />, errorElement: <ErrorElement />},
  {path: '*', element:<NotFoundPage />, errorElement: <ErrorElement />}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <main>
      <RouterProvider router={router} />
    </main>
    <Footer />
  </StrictMode>,
)
