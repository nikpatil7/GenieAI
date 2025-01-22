//import React from 'react'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
import { useMemo } from 'react';
import {CssBaseline, ThemeProvider,createTheme} from '@mui/material';
import {Toaster} from "react-hot-toast";

import { themeSettings} from './theme';
import Summary from './pages/Summary';
import Paragraph from './pages/paragraph';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const theme = useMemo(() => createTheme(themeSettings(),[]));
  return (
    <>
     <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Navbar />
      <Toaster/>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/Register' element={<Register/>} />
        <Route path='/login' element={<Login />}/>
        <Route 
          path="/summary" 
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          } 
        />
        <Route 
            path="/paragraph" 
            element={
              <ProtectedRoute>
                <Paragraph /> 
              </ProtectedRoute>
            } 
          />
      </Routes>
     </ThemeProvider>
     
    </>
    
  );
}

export default App;
