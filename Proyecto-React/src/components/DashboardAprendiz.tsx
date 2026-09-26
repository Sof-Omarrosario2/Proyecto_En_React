import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import Inicio from './Inicio';
import Evaluacion from './Evaluacion';
import Resultados from './Resultados';

type Vista = 'inicio' | 'evaluacion' | 'resultados';

export default function DashboardAprendiz() {
  const { aprendiz, cerrarSesion } = useEvaluation();
  const [vistaActiva, setVistaActiva] = useState<Vista>('inicio');

  const inicial = aprendiz?.nombreCompleto.charAt(0).toUpperCase() || 'A';
  const primerNombre = aprendiz?.nombreCompleto.split(' ')[0] || 'Aprendiz';

  const menuItems: { id: Vista; etiqueta: string; icono: string }[] = [
    { id: 'inicio', etiqueta: 'Inicio', icono: '🏠' },
    { id: 'evaluacion', etiqueta: 'Evaluación', icono: '📝' },
    { id: 'resultados', etiqueta: 'Resultados', icono: '📊' },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <nav className="dashboard-menu">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`dashboard-menu-item ${
                vistaActiva === item.id ? 'dashboard-menu-item-activo' : ''
              }`}
              onClick={() => setVistaActiva(item.id)}
            >
              <span>{item.icono}</span> {item.etiqueta}
            </button>
          ))}
        </nav>
        <button type="button" className="dashboard-cerrar-sesion" onClick={cerrarSesion}>
          ↩ Cerrar sesión
        </button>
      </aside>

      <div className="dashboard-contenido">
        <header className="dashboard-header">
          <div className="dashboard-header-marca">
            <span className="dashboard-logo">SENA</span>
            <div>
              <p className="dashboard-header-titulo">Sistema de Evaluación T&amp;T</p>
              <p className="dashboard-header-subtitulo">Módulo Aprendiz</p>
            </div>
          </div>
          <div className="dashboard-header-usuario">
            <span className="badge badge-rol">Aprendiz</span>
            <span className="dashboard-avatar">{inicial}</span>
            <div>
              <p className="dashboard-usuario-nombre">{primerNombre}</p>
              <p className="dashboard-usuario-info">
                Ficha {aprendiz?.ficha} · {aprendiz?.programa}
              </p>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          {vistaActiva === 'inicio' && <Inicio onNavegar={setVistaActiva} />}
          {vistaActiva === 'evaluacion' && <Evaluacion />}
          {vistaActiva === 'resultados' && <Resultados onNavegar={setVistaActiva} />}
        </main>
      </div>
    </div>
  );
}
