import React, { useState } from 'react';
import { useEvaluation, Aprendiz } from '../context/EvaluationContext';

interface FormErrors {
  nombreCompleto?: string;
  numeroDocumento?: string;
  correo?: string;
  ficha?: string;
  autorizacion?: string;
}

export default function RegistroAprendiz() {
  const { registrarAprendiz } = useEvaluation();

  const [formData, setFormData] = useState<Aprendiz>({
    nombreCompleto: '',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '',
    correo: '',
    programa: 'Análisis y Desarrollo de Software (ADSO)',
    ficha: '',
    trimestre: 'Trimestre VI',
    autorizacion: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validarFormulario = (): FormErrors => {
    const nuevosErrores: FormErrors = {};
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fichaRegex = /^\d{7}$/;

    if (!formData.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = 'El nombre completo es obligatorio.';
    }
    if (!formData.numeroDocumento.trim()) {
      nuevosErrores.numeroDocumento = 'El número de documento es obligatorio.';
    }
    if (!correoRegex.test(formData.correo)) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido.';
    }
    if (!fichaRegex.test(formData.ficha)) {
      nuevosErrores.ficha = 'La ficha debe tener exactamente 7 dígitos.';
    }
    if (!formData.autorizacion) {
      nuevosErrores.autorizacion = 'Debes autorizar el tratamiento de tus datos.';
    }
    return nuevosErrores;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nuevosErrores = validarFormulario();
    setErrors(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      registrarAprendiz(formData);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-panel-izquierdo">
        <span className="registro-badge">SENA</span>
        <h1 className="registro-titulo">
          Sistema de Gestión y Evaluación Académica T&amp;T
        </h1>
        <p className="registro-subtitulo">
          Consulta y presenta tus pruebas de entrada y simulacros tipo ICFES
          desde un solo lugar.
        </p>
        <div className="registro-tip">
          <p className="registro-tip-titulo">💡 ¿Por qué presentar estas pruebas?</p>
          <p className="registro-tip-texto">
            La prueba de entrada mide cómo llegas al programa. El simulacro de
            salida evalúa las 5 competencias tipo ICFES antes de tu Saber T&amp;T
            oficial.
          </p>
        </div>
      </div>

      <div className="registro-panel-derecho">
        <form className="registro-form" onSubmit={handleSubmit} noValidate>
          <h2 className="registro-form-titulo">Registro de Aprendiz</h2>
          <p className="registro-form-descripcion">
            Completa tus datos para ingresar al sistema. Esta información se
            guarda localmente en este prototipo.
          </p>

          <div className="registro-form-fila">
            <div className="form-group">
              <label htmlFor="nombreCompleto">Nombre completo *</label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                placeholder="Ej: Juan Pérez"
                value={formData.nombreCompleto}
                onChange={handleChange}
                className={errors.nombreCompleto ? 'input-error' : ''}
              />
              {errors.nombreCompleto && (
                <span className="mensaje-error">{errors.nombreCompleto}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="tipoDocumento">Tipo de documento *</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
              >
                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                <option value="Cédula de extranjería">Cédula de extranjería</option>
              </select>
            </div>
          </div>

          <div className="registro-form-fila">
            <div className="form-group">
              <label htmlFor="numeroDocumento">Número de documento *</label>
              <input
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                placeholder="Ej: 1020304050"
                value={formData.numeroDocumento}
                onChange={handleChange}
                className={errors.numeroDocumento ? 'input-error' : ''}
              />
              {errors.numeroDocumento && (
                <span className="mensaje-error">{errors.numeroDocumento}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo personal *</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="ejemplo@gmail.com"
                value={formData.correo}
                onChange={handleChange}
                className={errors.correo ? 'input-error' : ''}
              />
              {errors.correo && <span className="mensaje-error">{errors.correo}</span>}
            </div>
          </div>

          <div className="registro-form-fila">
            <div className="form-group">
              <label htmlFor="programa">Programa / Tecnólogo *</label>
              <select
                id="programa"
                name="programa"
                value={formData.programa}
                onChange={handleChange}
              >
                <option value="Análisis y Desarrollo de Software (ADSO)">
                  Análisis y Desarrollo de Software (ADSO)
                </option>
                <option value="Gestión Administrativa">Gestión Administrativa</option>
                <option value="Multimedia">Multimedia</option>
                <option value="Contabilidad y Finanzas">Contabilidad y Finanzas</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ficha">Ficha *</label>
              <input
                type="text"
                id="ficha"
                name="ficha"
                placeholder="Ej: 2758901"
                maxLength={7}
                value={formData.ficha}
                onChange={handleChange}
                className={errors.ficha ? 'input-error' : ''}
              />
              {errors.ficha && <span className="mensaje-error">{errors.ficha}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="trimestre">Trimestre actual</label>
            <select
              id="trimestre"
              name="trimestre"
              value={formData.trimestre}
              onChange={handleChange}
            >
              <option value="Trimestre I">Trimestre I</option>
              <option value="Trimestre V">Trimestre V</option>
              <option value="Trimestre VI">Trimestre VI</option>
            </select>
          </div>

          <div className="form-group form-group-checkbox">
            <label htmlFor="autorizacion">
              <input
                type="checkbox"
                id="autorizacion"
                name="autorizacion"
                checked={formData.autorizacion}
                onChange={handleChange}
              />
              Autorizo el tratamiento de mis datos personales con fines académicos.
            </label>
            {errors.autorizacion && (
              <span className="mensaje-error">{errors.autorizacion}</span>
            )}
          </div>

          <button type="submit" className="boton-primario boton-ancho-completo">
            Ingresar al sistema
          </button>

          <p className="registro-form-ayuda">
            ¿No puedes ingresar? <a href="#contacto">Contacta a tu instructor</a>
          </p>
        </form>
      </div>
    </div>
  );
}
