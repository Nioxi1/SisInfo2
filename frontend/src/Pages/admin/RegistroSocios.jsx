import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { sociosService } from '../../services/sociosService';
import { 
  UserPlus, 
  Save, 
  ShieldCheck, 
  Headphones,
  User,
  CheckCircle,
  AlertCircle,
  Loader2
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
    direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};

    // Nombre Completo
    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es obligatorio.';
    } else if (formData.nombreCompleto.trim().length < 3) {
      newErrors.nombreCompleto = 'El nombre completo debe tener al menos 3 caracteres.';
    }

    // DNI / Código
    if (!formData.dniCodigo.trim()) {
      newErrors.dniCodigo = 'El DNI / Código de socio es obligatorio.';
    } else if (formData.dniCodigo.trim().length < 4) {
      newErrors.dniCodigo = 'Debe ingresar un DNI o código válido (mínimo 4 caracteres).';
    }

    // Fecha de Nacimiento / Alta
    if (!formData.fechaNacimiento.trim()) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    }

    // Teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
    } else if (formData.telefono.trim().length < 6) {
      newErrors.telefono = 'Ingrese un número de teléfono válido.';
    }

    // Correo Electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correoElectronico.trim()) {
      newErrors.correoElectronico = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.correoElectronico.trim())) {
      newErrors.correoElectronico = 'Formato de correo electrónico inválido (ejemplo@dominio.com).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Split nombreCompleto
      const parts = formData.nombreCompleto.trim().split(' ');
      const nombre = parts[0] || '';
      const apellidos = parts.slice(1).join(' ') || parts[0];

      // Format DNI & Generate Codigo
      const dniClean = formData.dniCodigo.trim().toUpperCase();
      const codigoClean = dniClean.startsWith('SOC-') 
        ? dniClean 
        : `SOC-${Math.floor(100 + Math.random() * 900)}`;

      // Parse fecha
      let fechaAlta = formData.fechaNacimiento.trim();
      if (fechaAlta.includes('/')) {
        const dateParts = fechaAlta.split('/');
        if (dateParts.length === 3) {
          // If DD/MM/YYYY -> YYYY-MM-DD
          fechaAlta = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
        }
      }

      const payload = {
        codigo: codigoClean,
        nombre: nombre,
        apellidos: apellidos,
        email: formData.correoElectronico.trim(),
        telefono: formData.telefono.trim(),
        dni: dniClean,
        fecha_alta: fechaAlta || new Date().toISOString().split('T')[0]
      };

      await sociosService.crear(payload);

      setSuccessMessage('¡Socio registrado exitosamente en la base de datos!');
      
      // Navigate to /socios after 1.5 seconds
      setTimeout(() => {
        navigate('/socios');
      }, 1500);

    } catch (err) {
      console.error('Error al guardar socio:', err);
      if (err.response && err.response.data) {
        const apiMsg = err.response.data.message || 'Ocurrió un error al guardar el socio.';
        const apiErrors = err.response.data.errors;
        if (apiErrors) {
          const firstErrKey = Object.keys(apiErrors)[0];
          setServerError(`${apiMsg} (${apiErrors[firstErrKey][0]})`);
        } else {
          setServerError(apiMsg);
        }
      } else {
        setServerError('No se pudo conectar con el servidor backend. Verifique su conexión.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={() => navigate('/socios')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>

        {/* Global Notifications */}
        {successMessage && (
          <div className="notification-banner banner-success">
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {serverError && (
          <div className="notification-banner banner-error">
            <AlertCircle size={20} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Main Form Card */}
        <div className="form-card-container">
          <div className="form-card-header">
            <UserPlus size={20} className="form-header-icon" />
            <h2 className="form-title">Información Personal</h2>
          </div>

          <form onSubmit={handleSubmit} className="registro-form" noValidate>
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
                  className={`form-input ${errors.nombreCompleto ? 'input-invalid' : ''}`}
                />
                {errors.nombreCompleto && (
                  <span className="error-message-text">{errors.nombreCompleto}</span>
                )}
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
                  className={`form-input ${errors.dniCodigo ? 'input-invalid' : ''}`}
                />
                {errors.dniCodigo ? (
                  <span className="error-message-text">{errors.dniCodigo}</span>
                ) : (
                  <span className="field-subtext">Identificador único para el sistema.</span>
                )}
              </div>

              {/* Field 3 */}
              <div className="form-group">
                <label className="form-label">FECHA DE NACIMIENTO *</label>
                <input 
                  type="date" 
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className={`form-input ${errors.fechaNacimiento ? 'input-invalid' : ''}`}
                />
                {errors.fechaNacimiento && (
                  <span className="error-message-text">{errors.fechaNacimiento}</span>
                )}
              </div>

              {/* Field 4 */}
              <div className="form-group">
                <label className="form-label">TELÉFONO *</label>
                <input 
                  type="tel" 
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                  className={`form-input ${errors.telefono ? 'input-invalid' : ''}`}
                />
                {errors.telefono && (
                  <span className="error-message-text">{errors.telefono}</span>
                )}
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
                  className={`form-input ${errors.correoElectronico ? 'input-invalid' : ''}`}
                />
                {errors.correoElectronico ? (
                  <span className="error-message-text">{errors.correoElectronico}</span>
                ) : (
                  <span className="field-subtext">Se enviará una confirmación de registro a esta dirección.</span>
                )}
              </div>

              {/* Field 6 (Full Width) */}
              <div className="form-group full-width">
                <label className="form-label">DIRECCIÓN POSTAL</label>
                <input 
                  type="text" 
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle, Número, Piso, Ciudad"
                  className="form-input"
                />
              </div>
            </div>

            <hr className="form-divider" />

            <div className="form-footer">
              <span className="required-notice">* Campos obligatorios</span>
              <button 
                type="submit" 
                className="btn-save-socio"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="spinner-icon" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Guardar Socio</span>
                  </>
                )}
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
