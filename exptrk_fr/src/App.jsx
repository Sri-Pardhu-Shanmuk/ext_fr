import { useState } from 'react'

import './App.css'
import Navbar from './pages/navbar'
import Dashboard from './pages/dashboard'
import TransactionsPage from './pages/transactions'
import ReportsPage from './pages/reports'
import { Routes,Route } from 'react-router-dom'
import LoginPage from './pages/login_page'
import RegisterPage from './pages/register_page'

function App() {


  return (
    <div className="App">

      
      
      <Routes>
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/' element={<LoginPage/>} />
        
        <Route path='/dashboard' element={
          <>
          <Navbar />
          <Dashboard/>
          </>
          
          } /> 
        <Route path='/transactions' element={
          <>
          <Navbar />
          <TransactionsPage/>
          </>
          
          } /> 
        <Route path='/reports' element={
          <>
          <Navbar />
          <ReportsPage/>
          </>
          
          } /> 
      </Routes>
      
    </div>
  )
  
}

export default App
