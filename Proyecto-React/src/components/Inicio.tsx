import React from 'react';
import { useEvaluation } from '../context/EvaluationContext';

interface InicioProps {
  onNavegar: (vista: 'evaluacion' | 'resultados') => void;
}

export default function Inicio({ onNavegar }: InicioProps) {
  const { aprendiz, competencias, salida } = useEvaluation();

  const presentadas = competencias.filter((comp) => salida[comp.id]?.presentada).length;
  const porcentajeAvance = (presentadas / competencias.length) * 100;
  const primerNombre = aprendiz?.nombreCompleto.split(' ')[0] || 'Aprendiz';

  return (
    <div className="inicio-container">
      <h1 className="inicio-saludo">Hola, {primerNombre} 👋</h1>
      <p className="inicio-info">
        Ficha {aprendiz?.ficha} · {aprendiz?.programa} · {aprendiz?.trimestre}
      </p>

      <div className="inicio-tarjetas">
        <div className="tarjeta">
          <div className="tarjeta-encabezado">
            <span className="tarjeta-icono tarjeta-icono-naranja">📝</span>
            <span className="badge badge-pendiente">
              {presentadas === competencias.length ? 'Completado' : 'Pendiente'}
            </span>
          </div>
          <h3 className="tarjeta-titulo">Simulacro de Salida</h3>
          <p className="tarjeta-descripcion">Activada por Coordinación T&amp;T</p>
          <p className="tarjeta-texto">
            Debes presentar las {competencias.length} competencias antes de tu
            Saber T&amp;T oficial. Vas {presentadas} de {competencias.length}{' '}
            completadas.
          </p>
          <div className="barra-progreso">
            <div
              className="barra-progreso-relleno"
              style={{ width: `${porcentajeAvance}%` }}
            />
          </div>
          <button
            type="button"
            className="boton-primario boton-ancho-completo"
            onClick={() => onNavegar('evaluacion')}
          >
            Iniciar Evaluación
          </button>
        </div>

        <div className="tarjeta">
          <div className="tarjeta-encabezado">
            <span className="tarjeta-icono tarjeta-icono-morado">📊</span>
            <span className="badge badge-disponible">Disponibles</span>
          </div>
          <h3 className="tarjeta-titulo">Resultados</h3>
          <p className="tarjeta-descripcion">Histórico de pruebas presentadas</p>
          <p className="tarjeta-texto">
            Consulta el histórico de tus pruebas presentadas y tu evolución
            comparando entrada vs. salida.
          </p>
          <button
            type="button"
            className="boton-secundario boton-ancho-completo"
            onClick={() => onNavegar('resultados')}
          >
            Ver Resultados
          </button>
        </div>
      </div>

      <div className="inicio-recordatorio">
        💡 <strong>Recuerda:</strong> en el simulacro de salida debes responder
        las {competencias.length} competencias para obtener tu promedio de
        ficha.
      </div>
    </div>
  );
}
