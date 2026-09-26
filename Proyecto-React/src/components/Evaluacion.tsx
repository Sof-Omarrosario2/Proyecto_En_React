import React, { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';

const NOMBRES_CORTOS: Record<string, string> = {
  ciudadana: 'C. Ciudadana',
  cuantitativo: 'R. Cuantitativo',
  bilinguismo: 'Bilingüismo',
  escrita: 'Com. Escrita',
  lectura: 'L. Crítica',
};

export default function Evaluacion() {
  const { competencias, preguntasSalida, entrada, salida, presentarCompetenciaSalida } =
    useEvaluation();

  const [competenciaActiva, setCompetenciaActiva] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [puntajeObtenido, setPuntajeObtenido] = useState<number | null>(null);

  const presentadas = competencias.filter((comp) => salida[comp.id]?.presentada).length;

  const iniciarCompetencia = (competenciaId: string) => {
    setCompetenciaActiva(competenciaId);
    setRespuestas({});
    setPuntajeObtenido(null);
  };

  const seleccionarRespuesta = (preguntaIndex: number, opcionIndex: number) => {
    setRespuestas((prev) => ({ ...prev, [preguntaIndex]: opcionIndex }));
  };

  const enviarRespuestas = () => {
    if (!competenciaActiva) return;
    const preguntas = preguntasSalida[competenciaActiva] || [];
    const listaRespuestas = preguntas.map((_, index) => respuestas[index] ?? -1);
    const puntaje = presentarCompetenciaSalida(competenciaActiva, listaRespuestas);
    setPuntajeObtenido(puntaje);
  };

  const cerrarQuiz = () => {
    setCompetenciaActiva(null);
    setRespuestas({});
    setPuntajeObtenido(null);
  };

  const preguntasActivas = competenciaActiva ? preguntasSalida[competenciaActiva] || [] : [];
  const todasRespondidas =
    preguntasActivas.length > 0 &&
    preguntasActivas.every((_, index) => respuestas[index] !== undefined);

  return (
    <div className="evaluacion-container">
      <div className="panel">
        <div className="panel-encabezado">
          <div>
            <h2 className="panel-titulo">Prueba de Entrada</h2>
            <p className="panel-subtitulo">
              Se aplica una única vez, al ingresar al programa (trimestre I-II).
              Conformada por 15 preguntas distribuidas en 5 secciones (una por
              competencia de salida).
            </p>
          </div>
          {entrada?.presentada && <span className="badge badge-verde">● Presentada</span>}
        </div>

        {entrada?.presentada && (
          <div className="entrada-resultado">
            <div className="entrada-resultado-global">
              <span className="entrada-resultado-numero">{entrada.global}%</span>
              <span className="entrada-resultado-texto">Resultado global</span>
            </div>
            <div className="entrada-resultado-detalle">
              <p className="entrada-resultado-detalle-titulo">
                Desglose por competencia (15 preguntas · 3 c/u)
              </p>
              {competencias.map((comp) => (
                <div className="entrada-barra-fila" key={comp.id}>
                  <span className="entrada-barra-etiqueta">{comp.nombre}</span>
                  <div className="entrada-barra-fondo">
                    <div
                      className="entrada-barra-relleno"
                      style={{ width: `${entrada.porCompetencia[comp.id]}%` }}
                    />
                  </div>
                  <span className="entrada-barra-porcentaje">
                    {entrada.porCompetencia[comp.id]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-encabezado">
          <div>
            <h2 className="panel-titulo">Simulacro de Salida</h2>
            <p className="panel-subtitulo">
              Selecciona la competencia que vas a presentar (trimestre VI-VII).
              Puntaje máximo por competencia: 200 pts.
            </p>
          </div>
          <span className="panel-contador">
            {presentadas}/{competencias.length}
            <span className="panel-contador-texto">presentadas</span>
          </span>
        </div>

        <div className="lista-competencias">
          {competencias.map((comp) => {
            const resultado = salida[comp.id];
            return (
              <div className="competencia-fila" key={comp.id}>
                <span className="competencia-icono">{comp.icono}</span>
                <div className="competencia-info">
                  <p className="competencia-nombre">{comp.nombre}</p>
                  <p className="competencia-descripcion">
                    ⏱ {comp.duracionMin} min · {comp.descripcion}
                  </p>
                </div>
                {resultado?.presentada ? (
                  <span className="badge badge-verde">{resultado.puntaje} pts</span>
                ) : (
                  <span className="badge badge-pendiente">Pendiente</span>
                )}
                <button
                  type="button"
                  className="boton-primario"
                  onClick={() => iniciarCompetencia(comp.id)}
                >
                  {resultado?.presentada ? 'Ver' : 'Iniciar'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {competenciaActiva && (
        <div className="quiz-superposicion">
          <div className="quiz-modal">
            <div className="quiz-modal-encabezado">
              <h3>{NOMBRES_CORTOS[competenciaActiva]} · Simulacro</h3>
              <button type="button" className="quiz-cerrar" onClick={cerrarQuiz}>
                ✕
              </button>
            </div>

            {puntajeObtenido === null ? (
              <div className="quiz-preguntas">
                {preguntasActivas.map((pregunta, preguntaIndex) => (
                  <div className="quiz-pregunta" key={pregunta.id}>
                    <p className="quiz-pregunta-texto">
                      {preguntaIndex + 1}. {pregunta.pregunta}
                    </p>
                    <div className="quiz-opciones">
                      {pregunta.opciones.map((opcion, opcionIndex) => (
                        <label className="quiz-opcion" key={opcionIndex}>
                          <input
                            type="radio"
                            name={`pregunta-${preguntaIndex}`}
                            checked={respuestas[preguntaIndex] === opcionIndex}
                            onChange={() => seleccionarRespuesta(preguntaIndex, opcionIndex)}
                          />
                          {opcion}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="boton-primario boton-ancho-completo"
                  disabled={!todasRespondidas}
                  onClick={enviarRespuestas}
                >
                  Finalizar y calificar
                </button>
              </div>
            ) : (
              <div className="quiz-resultado">
                <span className="quiz-resultado-numero">{puntajeObtenido}/200</span>
                <p className="quiz-resultado-texto">
                  Competencia presentada correctamente.
                </p>
                <button type="button" className="boton-primario" onClick={cerrarQuiz}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
