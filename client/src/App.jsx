import {Routes, Route, Link} from 'react-router-dom';
import { useState } from 'react'
import NotFound from './pages/NotFound.jsx';
function App() {
  

  return (
    <Routes>
     <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
