import {Routes, Route, Link} from 'react-router-dom';
import { useState } from 'react'
import NotFound from './pages/NotFoundPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
function App() {
  

  return (
    <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path="/login" element={<LoginPage />} />
     <Route path="/contact" element={<ContactPage />} />

     <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
