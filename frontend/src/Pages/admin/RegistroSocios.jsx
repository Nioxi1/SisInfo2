import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { 
  UserPlus, 
  Save, 
  ShieldCheck, 
  Headphones,
  User
} from 'lucide-react';
import './RegistroSocios.css';

export default function RegistroSocios() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    dniCodigo: '',
    fechaNacimiento: '',
    telefono: '',
    correoElectronico: '',
    direccionPostal: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Socio registrado con éxito');
    navigate('/admin/socios');
  };

  return (
    <AdminLayout 
      activeTab="socios"
      searchPlaceholder="Buscar socios, pagos o eventos..."
      sidebarBottomType="button"
      headerRightContent={
        <div className="user-profile-badge">
          <div className="user-avatar-dark">
            <User size={18} color="#ffffff" />
          </div>
          <div className="user-avatar-photo">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" 
              alt="Admin Profile" 
            />
          </div>
        </div>
      }
    >
      <div className="registro-socios-container">
        {/* Page Header */}
        <div className="page-header-row">
          <div>
            <h1 className="page-main-title">Registro de Nuevo Socio</h1>
            <p className="page-sub-title">Complete la información para dar de alta a un nuevo miembro del club.</p>
          </div>
          <button 
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/admin/socios')}
          >
            Cancelar
          </button>
        </div>

        {/* Main Form Card */}
        <div className="form-card-container">
          <div className="form-card-header">
            <UserPlus size={20} className="form-header-icon" />
            <h2 className="form-title">Información Personal</h2>
          </div>

          <form onSubmit={handleSubmit} className="registro-form">
            <div className="form-grid">
              {/* Field 1 */}
              <div className="form-group">
                <label className="form-label">NOMBRE COMPLETO *</label>
                <input 
                  type="text" 
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez García"
                  className="form-input"
                  required
                />
              </div>

              {/* Field 2 */}
              <div className="form-group">
                <label className="form-label">DNI/CÓDIGO DE SOCIO *</label>
                <input 
                  type="text" 
                  name="dniCodigo"
                  value={formData.dniCodigo}
                  onChange={handleChange}
                  placeholder="Ej. 12345678X"
                  className="form-input"
                  required
                />
                <span className="field-subtext">Identificador único para el sistema.</span>
              </div>

              {/* Field 3 */}
              <div className="form-group">
                <label className="form-label">FECHA DE NACIMIENTO *</label>
                <input 
                  type="text" 
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  placeholder="mm/dd/yyyy"
                  className="form-input"
                  required
                />
              </div>

              {/* Field 4 */}
              <div className="form-group">
                <label className="form-label">TELÉFONO *</label>
                <input 
                  type="text" 
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                  className="form-input"
                  required
                />
              </div>

              {/* Field 5 (Full Width) */}
              <div className="form-group full-width">
                <label className="form-label">CORREO ELECTRÓNICO *</label>
                <input 
                  type="email" 
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  placeholder="usuario@ejemplo.com"
                  className="form-input"
                  required
                />
                <span className="field-subtext">Se enviará una confirmación de registro a esta dirección.</span>
              </div>

              {/* Field 6 (Full Width) */}
              <div className="form-group full-width">
                <label className="form-label">DIRECCIÓN POSTAL</label>
                <input 
                  type="text" 
                  name="direccionPostal"
                  value={formData.direccionPostal}
                  onChange={handleChange}
                  placeholder="Calle, Número, Piso, Ciudad"
                  className="form-input"
                />
              </div>
            </div>

            <hr className="form-divider" />

            <div className="form-footer">
              <span className="required-notice">* Campos obligatorios</span>
              <button type="submit" className="btn-save-socio">
                <Save size={18} />
                <span>Guardar Socio</span>
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Cards Grid (2 Columns) */}
        <div className="bottom-cards-grid">
          {/* Card 1: Protocolo de Privacidad */}
          <div className="info-box-card bg-privacy-blue">
            <div className="shield-circle-icon">
              <ShieldCheck size={22} color="#1E40AF" />
            </div>
            <div className="info-box-content">
              <h3 className="info-box-title">Protocolo de Privacidad</h3>
              <p className="info-box-text">
                Los datos ingresados están protegidos por el RGPD. Solo el personal administrativo autorizado tiene acceso a esta información.
              </p>
            </div>
          </div>

          {/* Card 2: ¿Necesitas Ayuda? */}
          <div className="info-box-card bg-help-green">
            <div className="info-box-content">
              <h3 className="info-box-title dark-green-text">¿Necesitas Ayuda?</h3>
              <p className="info-box-text dark-green-subtext">
                Contacta con soporte técnico para incidencias en el registro.
              </p>
            </div>
            <Headphones size={80} className="help-watermark-icon" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
