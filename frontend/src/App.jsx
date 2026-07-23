import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Inicio from './Pages/Inicio';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </BrowserRouter>
  );
}
