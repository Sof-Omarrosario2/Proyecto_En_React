# Sistema de Gestión y Evaluación Académica T&T - SENA

Aplicación React TypeScript para gestionar evaluaciones académicas tipo ICFES en plataforma SENA.

## 🎯 Características

- ✅ **Registro de Aprendices** con validaciones completas
- ✅ **Ficha de 7 dígitos** (actualizado)
- ✅ **Placeholders en todos los campos** de entrada
- ✅ **Prueba de Entrada** (15 preguntas)
- ✅ **Simulacros de Salida** (5 competencias × 5 preguntas)
- ✅ **Comparativa Entrada vs Salida**
- ✅ **LocalStorage** para persistencia de datos
- ✅ **Responsive Design** (mobile, tablet, desktop)
- ✅ **UI Moderna** con diseño profesional

## 🗂️ Estructura del Proyecto

```
src/
├── components/              # Componentes consolidados
│   ├── RegistroAprendiz.tsx
│   ├── DashboardAprendiz.tsx
│   └── EvaluacionAprendiz.tsx (próximamente)
│
├── context/                 # Contextos de estado
│   └── EvaluationContext.tsx
│
├── styles/                  # CSS consolidados
│   ├── RegistroAprendiz.css
│   ├── DashboardAprendiz.css
│   └── ...
│
├── App.tsx                  # Componente principal
├── main.tsx                 # Punto de entrada
└── index.css                # Estilos globales
```

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

## 📋 Datos de Prueba

```
Nombre:         Walter Martínez García
Documento:      1023040050
Email:          walter@gmail.com
Ficha:          2758901 (7 dígitos)
Programa:       ADSO
Trimestre:      VI
Autorización:   ✓ (marcar)
```

## 🎨 Características Implementadas

### Registro
- ✅ Todos los campos tienen placeholder
- ✅ Validación en tiempo real
- ✅ Ficha de 7 dígitos
- ✅ Mensajes de error claros
- ✅ Datos guardados en LocalStorage

### Dashboard
- ✅ Navegación funcional
- ✅ Estado del aprendiz
- ✅ Progreso visual
- ✅ Acceso a evaluación y resultados

### Evaluaciones
- ✅ Prueba de entrada (15 preguntas)
- ✅ Simulacros de salida (5 competencias)
- ✅ Almacenamiento de respuestas
- ✅ Cálculo automático de puntajes

## 🎯 Tecnologías

- **React 18** con TypeScript
- **Vite** como build tool
- **Context API** para estado global
- **LocalStorage** para persistencia
- **CSS3** responsive

## 📱 Responsive

Funciona correctamente en:
- Computador (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Móvil (320px+)

## 💾 LocalStorage

Se guardan automáticamente:
- `sena_auth` → Estado de autenticación
- `sena_aprendiz` → Datos del aprendiz
- `sena_entrada` → Prueba de entrada
- `sena_salida` → Simulacros completados

## 🔐 Seguridad

- Validaciones en cliente
- Datos locales solo
- Sin comunicación con servidor
- Autorización de datos obligatoria

## 📝 Notas

- Este es un prototipo/MVP con datos simulados
- Los datos se almacenan SOLO en el navegador
- No requiere servidor backend
- Perfecto para desarrollo y demostración

---

**¡Lista para usar! 🚀**
