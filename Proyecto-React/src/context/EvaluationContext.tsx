import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Aprendiz {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  programa: string;
  ficha: string;
  trimestre: string;
  autorizacion: boolean;
}

export interface Competencia {
  id: string;
  nombre: string;
  icono: string;
  duracionMin: number;
  descripcion: string;
}

export interface PreguntaSalida {
  id: string;
  pregunta: string;
  opciones: string[];
  correctaIndex: number;
}

export interface ResultadoEntrada {
  presentada: boolean;
  global: number;
  porCompetencia: Record<string, number>;
}

export interface ResultadoSalida {
  presentada: boolean;
  puntaje: number; // sobre 200
}

interface EvaluationContextType {
  aprendiz: Aprendiz | null;
  autenticado: boolean;
  competencias: Competencia[];
  preguntasSalida: Record<string, PreguntaSalida[]>;
  entrada: ResultadoEntrada | null;
  salida: Record<string, ResultadoSalida>;
  registrarAprendiz: (data: Aprendiz) => void;
  cerrarSesion: () => void;
  presentarCompetenciaSalida: (competenciaId: string, respuestas: number[]) => number;
}

const STORAGE_KEYS = {
  auth: 'sena_auth',
  aprendiz: 'sena_aprendiz',
  entrada: 'sena_entrada',
  salida: 'sena_salida',
};

export const COMPETENCIAS: Competencia[] = [
  {
    id: 'ciudadana',
    nombre: 'Competencia Ciudadana',
    icono: '🤝',
    duracionMin: 18,
    descripcion: 'Convivencia, democracia y construcción de paz.',
  },
  {
    id: 'cuantitativo',
    nombre: 'Razonamiento Cuantitativo',
    icono: '🔢',
    duracionMin: 20,
    descripcion: 'Resolución de problemas numéricos y matemáticos.',
  },
  {
    id: 'bilinguismo',
    nombre: 'Bilingüismo',
    icono: '🌐',
    duracionMin: 16,
    descripcion: 'Comprensión y uso del inglés como lengua extranjera.',
  },
  {
    id: 'escrita',
    nombre: 'Comunicación Escrita',
    icono: '✍️',
    duracionMin: 20,
    descripcion: 'Producción de textos claros y coherentes.',
  },
  {
    id: 'lectura',
    nombre: 'Lectura Crítica',
    icono: '📖',
    duracionMin: 18,
    descripcion: 'Comprensión e interpretación de textos.',
  },
];

const PREGUNTAS_SALIDA: Record<string, PreguntaSalida[]> = {
  ciudadana: [
    { id: 'c1', pregunta: '¿Cuál es un mecanismo de participación ciudadana en Colombia?', opciones: ['Referendo', 'Impuesto predial', 'Licencia de conducción', 'Registro civil'], correctaIndex: 0 },
    { id: 'c2', pregunta: 'La democracia participativa se caracteriza por:', opciones: ['Involucrar activamente a los ciudadanos en decisiones públicas', 'Delegar todo el poder en un solo líder', 'Eliminar la Constitución', 'Prohibir el voto'], correctaIndex: 0 },
    { id: 'c3', pregunta: 'El respeto a la diferencia promueve principalmente:', opciones: ['La discriminación', 'La convivencia pacífica', 'El conflicto', 'El aislamiento'], correctaIndex: 1 },
    { id: 'c4', pregunta: 'Un valor fundamental para la construcción de paz es:', opciones: ['La violencia', 'La exclusión', 'El diálogo', 'La indiferencia'], correctaIndex: 2 },
    { id: 'c5', pregunta: 'La Constitución Política de Colombia vigente es del año:', opciones: ['1991', '1886', '2001', '1810'], correctaIndex: 0 },
  ],
  cuantitativo: [
    { id: 'q1', pregunta: 'Si un producto cuesta $40.000 y tiene 25% de descuento, ¿cuál es el precio final?', opciones: ['$35.000', '$30.000', '$32.000', '$28.000'], correctaIndex: 1 },
    { id: 'q2', pregunta: '¿Cuál es el resultado de 15% de 200?', opciones: ['20', '25', '30', '35'], correctaIndex: 2 },
    { id: 'q3', pregunta: 'Una empresa produce 120 unidades en 4 horas. ¿Cuántas produce en 1 hora?', opciones: ['25', '30', '35', '40'], correctaIndex: 1 },
    { id: 'q4', pregunta: 'Si x + 8 = 20, ¿cuál es el valor de x?', opciones: ['8', '10', '12', '14'], correctaIndex: 2 },
    { id: 'q5', pregunta: '¿Cuál fracción es equivalente a 0.75?', opciones: ['1/2', '2/3', '3/4', '4/5'], correctaIndex: 2 },
  ],
  bilinguismo: [
    { id: 'b1', pregunta: 'Choose the correct translation for "Aprendiz":', opciones: ['Teacher', 'Learner', 'Manager', 'Worker'], correctaIndex: 1 },
    { id: 'b2', pregunta: 'Complete: "She ___ to the SENA every day."', opciones: ['go', 'going', 'goes', 'gone'], correctaIndex: 2 },
    { id: 'b3', pregunta: 'What is the opposite of "increase"?', opciones: ['raise', 'grow', 'decrease', 'expand'], correctaIndex: 2 },
    { id: 'b4', pregunta: 'Choose the correct sentence:', opciones: ['He don\'t like it', 'He no like it', 'He not like it', 'He doesn\'t like it'], correctaIndex: 3 },
    { id: 'b5', pregunta: '"Deadline" means:', opciones: ['Fecha límite', 'Vacaciones', 'Reunión', 'Descanso'], correctaIndex: 0 },
  ],
  escrita: [
    { id: 'e1', pregunta: 'Un texto argumentativo se caracteriza por:', opciones: ['Presentar una tesis y argumentos que la sustenten', 'Narrar hechos en orden cronológico', 'Describir un lugar', 'Dar instrucciones'], correctaIndex: 0 },
    { id: 'e2', pregunta: 'La coherencia textual se refiere a:', opciones: ['El uso de mayúsculas', 'La relación lógica entre las ideas del texto', 'La longitud del texto', 'El tipo de letra'], correctaIndex: 1 },
    { id: 'e3', pregunta: '¿Cuál es un conector de causa?', opciones: ['Porque', 'Sin embargo', 'Además', 'Finalmente'], correctaIndex: 0 },
    { id: 'e4', pregunta: 'Seleccione la ortografía correcta:', opciones: ['Exaustivo', 'Esaustivo', 'Exhaustivo', 'Echaustivo'], correctaIndex: 2 },
    { id: 'e5', pregunta: 'Un párrafo bien estructurado debe tener:', opciones: ['Idea principal e ideas secundarias', 'Solo una palabra', 'Únicamente preguntas', 'Solo números'], correctaIndex: 0 },
  ],
  lectura: [
    { id: 'l1', pregunta: 'La idea principal de un texto se encuentra generalmente en:', opciones: ['Introducción o conclusión', 'Pie de página', 'Títulos de imágenes', 'Bibliografía'], correctaIndex: 0 },
    { id: 'l2', pregunta: 'Inferir un texto significa:', opciones: ['Copiar el texto', 'Deducir información no explícita', 'Memorizar el texto', 'Ignorar el texto'], correctaIndex: 1 },
    { id: 'l3', pregunta: 'Un texto informativo tiene como propósito principal:', opciones: ['Informar de manera objetiva', 'Persuadir emocionalmente', 'Narrar una historia ficticia', 'Expresar sentimientos'], correctaIndex: 0 },
    { id: 'l4', pregunta: 'La intención comunicativa del autor se identifica a través de:', opciones: ['El propósito y tono del texto', 'La extensión del texto', 'El número de párrafos', 'El tipo de papel'], correctaIndex: 0 },
    { id: 'l5', pregunta: 'Un argumento sólido se apoya en:', opciones: ['Opiniones sin sustento', 'Rumores', 'Evidencias y datos verificables', 'Suposiciones'], correctaIndex: 2 },
  ],
};

function generarResultadoEntrada(seed: string): ResultadoEntrada {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  const porCompetencia: Record<string, number> = {};
  let suma = 0;
  COMPETENCIAS.forEach((comp, index) => {
    const valor = 60 + ((hash + index * 137) % 36); // rango 60-95
    porCompetencia[comp.id] = valor;
    suma += valor;
  });
  const global = Math.round(suma / COMPETENCIAS.length);
  return { presentada: true, global, porCompetencia };
}

function salidaInicial(): Record<string, ResultadoSalida> {
  const inicial: Record<string, ResultadoSalida> = {};
  COMPETENCIAS.forEach((comp) => {
    inicial[comp.id] = { presentada: false, puntaje: 0 };
  });
  return inicial;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export function EvaluationProvider({ children }: { children: React.ReactNode }) {
  const [aprendiz, setAprendiz] = useState<Aprendiz | null>(null);
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [entrada, setEntrada] = useState<ResultadoEntrada | null>(null);
  const [salida, setSalida] = useState<Record<string, ResultadoSalida>>(salidaInicial());

  useEffect(() => {
    const authGuardado = localStorage.getItem(STORAGE_KEYS.auth);
    const aprendizGuardado = localStorage.getItem(STORAGE_KEYS.aprendiz);
    const entradaGuardada = localStorage.getItem(STORAGE_KEYS.entrada);
    const salidaGuardada = localStorage.getItem(STORAGE_KEYS.salida);

    if (authGuardado === 'true' && aprendizGuardado) {
      setAutenticado(true);
      setAprendiz(JSON.parse(aprendizGuardado));
    }
    if (entradaGuardada) {
      setEntrada(JSON.parse(entradaGuardada));
    }
    if (salidaGuardada) {
      setSalida(JSON.parse(salidaGuardada));
    }
  }, []);

  const registrarAprendiz = (data: Aprendiz) => {
    const resultadoEntrada = generarResultadoEntrada(data.numeroDocumento + data.ficha);
    setAprendiz(data);
    setAutenticado(true);
    setEntrada(resultadoEntrada);
    localStorage.setItem(STORAGE_KEYS.auth, 'true');
    localStorage.setItem(STORAGE_KEYS.aprendiz, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEYS.entrada, JSON.stringify(resultadoEntrada));
  };

  const cerrarSesion = () => {
    setAprendiz(null);
    setAutenticado(false);
    setEntrada(null);
    setSalida(salidaInicial());
    localStorage.removeItem(STORAGE_KEYS.auth);
    localStorage.removeItem(STORAGE_KEYS.aprendiz);
    localStorage.removeItem(STORAGE_KEYS.entrada);
    localStorage.removeItem(STORAGE_KEYS.salida);
  };

  const presentarCompetenciaSalida = (competenciaId: string, respuestas: number[]): number => {
    const preguntas = PREGUNTAS_SALIDA[competenciaId] || [];
    const correctas = preguntas.reduce((total, pregunta, index) => {
      return respuestas[index] === pregunta.correctaIndex ? total + 1 : total;
    }, 0);
    const puntaje = correctas * 40;
    const nuevaSalida = { ...salida, [competenciaId]: { presentada: true, puntaje } };
    setSalida(nuevaSalida);
    localStorage.setItem(STORAGE_KEYS.salida, JSON.stringify(nuevaSalida));
    return puntaje;
  };

  const value: EvaluationContextType = {
    aprendiz,
    autenticado,
    competencias: COMPETENCIAS,
    preguntasSalida: PREGUNTAS_SALIDA,
    entrada,
    salida,
    registrarAprendiz,
    cerrarSesion,
    presentarCompetenciaSalida,
  };

  return <EvaluationContext.Provider value={value}>{children}</EvaluationContext.Provider>;
}

export function useEvaluation(): EvaluationContextType {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation debe usarse dentro de un EvaluationProvider');
  }
  return context;
}
