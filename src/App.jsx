import React from 'react'
import { Home } from './pages'
import { Route, Routes } from 'react-router-dom'

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
        </Routes>
    )
}

export default App