import React, { useContext } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./authContext";
import Auth from "./pages/auth";
import Calendar from './components/Calendar';
import Header from './components/Header';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    // console.log("Waiting for authentication to finish...");
    return <p>Loading...</p>;  // Prevents immediate redirects
  }
  // console.log("App User:", user);
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
  </AuthProvider>
  )
}

export default App
