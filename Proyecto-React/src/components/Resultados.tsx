import React from 'react';
import { useEvaluation } from '../context/EvaluationContext';

const NOMBRES_CORTOS: Record<string, string> = {
  ciudadana: 'C. Ciudadana',
  cuantitativo: 'R. Cuantitativo',
  bilinguismo: 'Bilingüismo',
  escrita: 'Com. Escrita',
  lectura: 'L. Crítica',
};

interface ResultadosProps {
  onNavegar: (vista: 'evaluacion') => void;
}

export default function Resultados({ onNavegar }: ResultadosProps) {
  const { competencias, entrada, salida } = useEvaluation();

  const presentadas = competencias.filter((comp) => salida[comp.id]?.presentada);
  const promedioSimulacro =
    presentadas.length > 0
      ? Math.round(
          presentadas.reduce((total, comp) => total + salida[comp.id].puntaje, 0) /
            presentadas.length
        )
      : 0;

  return (
    <div className="resultados-container">
      <div className="resultados-tarjetas">
        <div className="tarjeta-stat">
          <p className="tarjeta-stat-titulo">Prueba de Entrada</p>
          <p className="tarjeta-stat-numero numero-verde">{entrada?.global ?? 0}%</p>
          <p className="tarjeta-stat-nota">15 preguntas · ya presentada</p>
        </div>
        <div className="tarjeta-stat">
          <p className="tarjeta-stat-titulo">Promedio Simulacro</p>
          <p className="tarjeta-stat-numero numero-azul">{promedioSimulacro}/200</p>
          <p className="tarjeta-stat-nota">Sobre competencias presentadas</p>
        </div>
        <div className="tarjeta-stat">
          <p className="tarjeta-stat-titulo">Competencias presentadas</p>
          <p className="tarjeta-stat-numero numero-naranja">
            {presentadas.length}/{competencias.length}
          </p>
          <p className="tarjeta-stat-nota">Avance del simulacro de salida</p>
        </div>
      </div>

      <div className="resultados-paneles">
        <div className="panel">
          <h3 className="panel-titulo">Puntaje por competencia presentada (sobre 200)</h3>
          {presentadas.length === 0 ? (
            <div className="resultados-vacio">
              <span className="resultados-vacio-icono">📊</span>
              <p>Aún no has presentado competencias de salida.</p>
              <button
                type="button"
                className="boton-primario"
                onClick={() => onNavegar('evaluacion')}
              >
                Ir a evaluación
              </button>
            </div>
          ) : (
            <div className="grafica-barras">
              {presentadas.map((comp) => (
                <div className="grafica-barra-columna" key={comp.id}>
                  <div
                    className="grafica-barra grafica-barra-azul"
                    style={{ height: `${(salida[comp.id].puntaje / 200) * 100}%` }}
                  />
                  <span className="grafica-barra-etiqueta">
                    {NOMBRES_CORTOS[comp.id]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h3 className="panel-titulo">Entrada vs Salida</h3>
          <p className="panel-subtitulo">
            Comparación normalizada a % (entrada vs salida / 200).
          </p>
          <div className="grafica-leyenda">
            <span className="leyenda-item">
              <span className="leyenda-color leyenda-naranja" /> Entrada (%)
            </span>
            <span className="leyenda-item">
              <span className="leyenda-color leyenda-azul" /> Salida (%)
            </span>
          </div>
          <div className="grafica-barras grafica-barras-dobles">
            {competencias.map((comp) => {
              const entradaPct = entrada?.porCompetencia[comp.id] ?? 0;
              const salidaPct = salida[comp.id]?.presentada
                ? (salida[comp.id].puntaje / 200) * 100
                : 0;
              return (
                <div className="grafica-barra-grupo" key={comp.id}>
                  <div className="grafica-barra-par">
                    <div
                      className="grafica-barra grafica-barra-naranja"
                      style={{ height: `${entradaPct}%` }}
                    />
                    <div
                      className="grafica-barra grafica-barra-azul"
                      style={{ height: `${salidaPct}%` }}
                    />
                  </div>
                  <span className="grafica-barra-etiqueta">
                    {NOMBRES_CORTOS[comp.id]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-titulo">Detalle por competencia</h3>
        <table className="tabla-detalle">
          <thead>
            <tr>
              <th>Competencia</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Diferencia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {competencias.map((comp) => {
              const entradaPct = entrada?.porCompetencia[comp.id];
              const resultadoSalida = salida[comp.id];
              const salidaPct = resultadoSalida?.presentada
                ? Math.round((resultadoSalida.puntaje / 200) * 100)
                : null;
              const diferencia =
                entradaPct !== undefined && salidaPct !== null
                  ? salidaPct - entradaPct
                  : null;
              return (
                <tr key={comp.id}>
                  <td>{NOMBRES_CORTOS[comp.id]}</td>
                  <td>{entradaPct !== undefined ? `${entradaPct}%` : '—'}</td>
                  <td>{salidaPct !== null ? `${salidaPct}%` : '—'}</td>
                  <td>{diferencia !== null ? `${diferencia > 0 ? '+' : ''}${diferencia}%` : '—'}</td>
                  <td>
                    <span
                      className={`badge ${
                        resultadoSalida?.presentada ? 'badge-verde' : 'badge-pendiente'
                      }`}
                    >
                      {resultadoSalida?.presentada ? 'Completada' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
