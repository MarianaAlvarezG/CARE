import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Account from './components/Account';
import Login from './components/Login';
import Registration from './components/Registration';
import UserDash from './components/UserDash';
import AdminDash from './components/AdminDash';
import Error from './components/Error';
import Error2 from './components/Error2';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/account" />} />
      <Route path="/auth/error2" element={<Error2/>} />
      <Route path="/auth/account" element={<Account />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Registration />} />
      <Route path="/auth/dashboard/user" element={<UserDash />} />
      <Route path="/auth/dashboard/admin" element={<AdminDash />} />
      <Route path="/auth/error" element={<Error />} />
      
    </Routes>
  );
};

export default App;
