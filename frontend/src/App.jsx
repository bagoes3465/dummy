import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PhotoboothApp from './pages/PhotoboothApp'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhotoboothApp />} />
      </Routes>
    </Router>
  )
}
