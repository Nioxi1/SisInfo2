import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import InicioAdm from './Pages/admin/InicioAdm';
import GestionSocios from './Pages/admin/GestionSocios';
import RegistroSocios from './Pages/admin/RegistroSocios';
import GestionPistas from './Pages/admin/GestionPistas';
import RegistroPista from './Pages/admin/RegistroPista';
import './App.css';
import NuevaReserva from './Pages/admin/NuevaReserva';
import LimiteReservas from './Pages/admin/LimiteReservas';
import ControlOcupacion from './Pages/admin/ControlOcupacion';
import ControlInasistencias from './Pages/admin/ControlInasistencias';
import GeneracionFacturas from './Pages/admin/GeneracionFacturas';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/inicioAdm" element={<InicioAdm />} />
        <Route path="/inicio" element={<InicioAdm />} />
        <Route path="/admin" element={<Navigate to="/inicioAdm" replace />} />
        <Route path="/admin/inicio" element={<InicioAdm />} />
        
        <Route path="/socios" element={<GestionSocios />} />
        <Route path="/gestion-socios" element={<GestionSocios />} />
        <Route path="/admin/socios" element={<GestionSocios />} />
        
        <Route path="/registroSocios" element={<RegistroSocios />} />
        <Route path="/registro-socios" element={<RegistroSocios />} />
        <Route path="/admin/registro-socios" element={<RegistroSocios />} />

        {/* Pistas Routes */}
        <Route path="/pistas" element={<GestionPistas />} />
        <Route path="/gestion-pistas" element={<GestionPistas />} />
        <Route path="/admin/pistas" element={<GestionPistas />} />

        <Route path="/pistas/nueva" element={<RegistroPista />} />
        <Route path="/registroPista" element={<RegistroPista />} />
        <Route path="/registro-pista" element={<RegistroPista />} />

        <Route path="/pistas/editar/:id" element={<RegistroPista />} />
        
        <Route path="/admin/reservas/nueva" element={<NuevaReserva />} />
        <Route path="/admin/reservas/limite" element={<LimiteReservas />} />

        {/* Reservas — Control de ocupación (HU5) */}
        <Route path="/admin/reservas/ocupacion" element={<ControlOcupacion />} />
        <Route path="/reservas" element={<ControlOcupacion />} />

        <Route
path="/admin/inasistencias"
  element={<ControlInasistencias />}
/>
<Route
  path="/admin/facturas"
  element={<GeneracionFacturas />}
/>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}