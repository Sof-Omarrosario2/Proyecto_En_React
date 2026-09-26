import React from 'react';
import { useEvaluation } from './context/EvaluationContext';
import RegistroAprendiz from './components/RegistroAprendiz';
import DashboardAprendiz from './components/DashboardAprendiz';

export default function App() {
  const { autenticado } = useEvaluation();

  return <div className="app-root">{autenticado ? <DashboardAprendiz /> : <RegistroAprendiz />}</div>;
}
