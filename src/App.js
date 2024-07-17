import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';

import Dashboard from './pages/Dashboard';
import LogAkses from './pages/LogAkses';
import ScanPage from './pages/Scan';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DataPas from './pages/DataPas';
import Personal from './pages/Personal';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} /> 
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/logakses' element={<LogAkses />} />
        <Route path='/datapas' element={<DataPas />} />
        <Route path='/scan' element={<ScanPage />} />
        <Route path='/datapersonal' element={<Personal />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
      <RefreshOnNavigate />
    </BrowserRouter>
  );
};

const RefreshOnNavigate = () => {
  const location = useLocation();
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathname) {
      window.location.reload();
      setPrevPathname(location.pathname);
    }
  }, [location, prevPathname]);

  return null;
};

export default App;
