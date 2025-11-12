# 🫀 Perfusion Pulse

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Emmeuve/perfusion-pulse)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

Aplicación web especializada para perfusionistas cardiovasculares que integra **cálculos clínicos**, **protocolos de cebado**, **gestión de transporte ECMO móvil** y **herramientas de referencia rápida**.

**[🌐 Ver en Vivo](https://perfusion-pulse.vercel.app)** | **[📖 Documentación](./PROJECT_STRUCTURE.md)** | **[🛠️ Implementación](./IMPLEMENTATION_GUIDE.md)**

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Módulos](#módulos)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura de Proyecto](#estructura-de-proyecto)
- [Configuración](#configuración)
- [Contribuciones](#contribuciones)
- [Soporte](#soporte)
- [Licencia](#licencia)

---

## ✨ Características

### ✅ Funcionalidades Principales

- **Cálculos CEC Adulto**: Superficie corporal, volemia, flujo, hematocrito post-priming
- **Cálculos CEC Pediátrico**: Parámetros por edad, Z-válvulas, recomendaciones pediátricas
- **Cálculos ECMO**: Flujo ECMO, caída de hematocrito, protocolos de cebado
- **Transporte ECMO Móvil**: Checklists personalizables, registro de tiempos, informes ELSO
- **Análisis Hemodinámico (GDP)**: DO2, VO2, CEO2, índice cardíaco
- **Corrección de Electrolitos**: Cálculo de déficit de K+ y HCO3-
- **Conversiones**: 10+ conversiones médicas comunes
- **Soluciones IV**: Composición y comparativa de soluciones
- **Cardioplegias**: Fórmulas y protocolos de protección miocárdica
- **Valores Normales**: Tablas de referencia hemodinamias y laboratorios
- **Dosis de Medicamentos**: Catálogo de medicamentos comunes

### 🎯 Beneficios

✓ Interfaz intuitiva y fácil de usar
✓ Cálculos confiables y verificados clínicamente
✓ Almacenamiento en tiempo real (Firebase)
✓ Funciona offline con sincronización
✓ Diseño responsivo (móvil, tablet, desktop)
✓ Acceso rápido a información crítica
✓ Generación de reportes e informes

---

## 🏥 Módulos

### 1. **CEC Adulto**
Cálculos especializados para circulación extracorpórea en pacientes adultos.

**Datos de entrada:**
- Peso, talla, hematocrito deseado
- Volumen de cebado
- Opción de volemia e índice cardíaco

**Resultados:**
- Superficie corporal (SC)
- Volemia total
- Flujo de bomba
- Hematocrito post-priming
- Flujo cerebral y coronario

### 2. **CEC Pediátrica**
Cálculos adaptados para población pediátrica (neonatos, lactantes, niños).

**Características especiales:**
- Cálculo automático de edad (años + meses)
- Z-válvulas para evaluación valvular
- Parámetros ajustados por edad
- Recomendaciones pediátricas específicas

### 3. **ECMO**
Gestión integral de soporte ECMO.

**Subsecciones:**
- **Cálculos ECMO**: Flujo según tipo (VA/VV), caída de hematocrito
- **Protocolos de Cebado**: Instrucciones neonatal y pediátrico paso a paso
- **Transporte Móvil**: Sistema completo de registro y checklists

### 4. **Transporte ECMO Móvil** ⭐
Sistema completo para rescate y transporte de pacientes en ECMO.

**Características:**
- ✓ Checklists pre-transporte personalizables
- ✓ Alertas si ítems obligatorios no están verificados
- ✓ Registro automático de 7 hitos de tiempo críticos
- ✓ Generación de informe ELSO 2025
- ✓ Almacenamiento persistente en Firebase
- ✓ Posibilidad de editar tiempos retroactivamente

**Hitos de tiempo:**
1. Salida del hospital origen
2. Llegada al aeropuerto (origen)
3. Llegada al hospital de procedencia
4. Entrada en ECMO
5. Salida del hospital de procedencia
6. Llegada al aeropuerto (destino)
7. Llegada al hospital de destino

### 5. **Corrección de Electrolitos (ELP)**
Calculadora para correcciones de potasio y bicarbonato.

**Incluye:**
- Cálculo de déficit con factor de distribución
- Recomendaciones de volumen según concentración
- Alertas clínicas
- Valores de referencia

### 6. **Conversiones**
Herramienta de equivalencias médicas (10+ conversiones).

**Disponibles:**
- mg ↔ μg
- Fr ↔ Pulgadas
- mEq ↔ mg (Sodio, Potasio)
- cm ↔ Pulgadas
- kg ↔ lb

### 7. **Valores Normales**
Tablas de referencia rápida.

**Incluye:**
- Valores hemodinámicos
- Exámenes de laboratorio
- Índices cardíacos
- Parámetros de oxigenación

### 8. **Soluciones IV**
Información detallada de soluciones.

**Cubiertas:**
- Suero fisiológico 0.9%
- Ringer lactato
- Ringer USP
- Plasmalyte
- Albúmina 5%
- Cardioplegias (Bretschneider, Saint Thomas, Del Nido)

---

## 🛠 Stack Tecnológico

| Herramienta | Versión | Propósito |
|------------|---------|----------|
| **React** | 18+ | Framework UI |
| **TypeScript** | 5+ | Tipado estático |
| **Vite** | 5+ | Bundler y dev server |
| **Tailwind CSS** | 3+ | Estilos responsivos |
| **shadcn/ui** | Latest | Componentes accesibles |
| **Firebase** | 9+ | Base de datos real-time |
| **Supabase** | Latest | Alternativa/Complemento |
| **Lucide React** | Latest | Iconografía |

### Compatibilidad
- ✓ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✓ Dispositivos móviles (iOS, Android)
- ✓ Tablets y desktop
- ✓ Funcionalidad offline mejorada

---

## 📦 Instalación

### Requisitos Previos
- Node.js 16+ y npm/yarn instalados
- Cuenta Firebase configurada
- Git instalado

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/Emmeuve/perfusion-pulse.git
cd perfusion-pulse

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# Editar .env.local con tus credenciales Firebase
# VITE_FIREBASE_API_KEY=xxxxx
# VITE_FIREBASE_AUTH_DOMAIN=xxxxx
# VITE_FIREBASE_PROJECT_ID=xxxxx
# etc...

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:5173
```

### Para Producción

```bash
# Build para producción
npm run build

# Preview local del build
npm run preview

# Deploy a Vercel (automático con GitHub)
# Solo hacer push a main y Vercel se encarga
```

---

## 🚀 Uso

### Flujo General

#### 1. **CEC Adulto - Paso a Paso**

```
1. Ir a "CEC Adulto"
2. Ingresar datos del paciente:
   - Peso (kg)
   - Altura (cm)
   - Hematocrito actual (%)
   - Volumen de cebado (mL)
3. Seleccionar:
   - Volemia recomendada (70/75/80 mL/kg)
   - Índice cardíaco (2.0/2.2/2.4/2.6 L/min/m²)
4. Los cálculos se actualizan automáticamente
5. (Opcional) Guardar cálculo si hay paciente seleccionado
```

#### 2. **Transporte ECMO Móvil - Paso a Paso**

```
1. Ir a "ECMO" → "Transporte Móvil"
2. Registrar datos del paciente
3. Completar checklist pre-transporte:
   - ✓ Verificar oxigenador
   - ✓ Comprobar anticoagulación
   - ✓ Revisar conexiones
   - ✓ Etc. (items con * son obligatorios)
4. Si hay items sin verificar, aparece alerta
5. Registrar hitos de tiempo:
   - Click en "Salida del Hospital"
   - Se registra automáticamente hora actual
   - Puede editarse si es necesario
6. Al finalizar, generar informe ELSO
7. Datos se guardan automáticamente en Firebase
```

#### 3. **Conversiones - Uso Rápido**

```
1. Ir a "Conversiones"
2. Seleccionar tipo de conversión (ej: mg → μg)
3. Ingresar valor
4. Click "Convertir" o presionar Enter
5. Resultado aparece instantáneamente
6. Botón "Copiar" para llevar al portapapeles
```

---

## 📁 Estructura de Proyecto

```
perfusion-pulse/
├── src/
│   ├── components/
│   │   ├── perfusion/
│   │   │   ├── AdultCPBCalculations.tsx      ✅ Refactorizado
│   │   │   ├── PediatricCPBCalculations.tsx  ✅ Refactorizado
│   │   │   ├── ECMOCalculations.tsx          ✅ Refactorizado
│   │   │   ├── ConversionesCard.tsx          ✅ Refactorizado
│   │   │   ├── CorreccionELPCard.tsx         ✅ Refactorizado
│   │   │   ├── SolucionesCard.tsx            ✅ Refactorizado
│   │   │   └── SupabasePing.tsx
│   │   ├── patient/
│   │   │   ├── PatientForm.tsx
│   │   │   ├── PatientList.tsx
│   │   │   ├── PatientHistory.tsx
│   │   │   └── PatientManager.tsx
│   │   └── ui/
│   │       └── (componentes shadcn/ui)
│   ├── services/
│   │   ├── calculations.ts                   ✅ 30+ funciones
│   │   ├── firebase.ts
│   │   ├── storage.ts
│   │   └── conversions.ts
│   ├── data/
│   │   └── index.ts                          ✅ Datos centralizados
│   ├── types/
│   │   └── index.ts                          ✅ 20+ interfaces
│   ├── hooks/
│   │   ├── usePatients.ts
│   │   └── (otros hooks)
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example
├── .env.local (⚠️ NO incluir en Git)
├── README.md                                  ← Estás aquí
├── PROJECT_STRUCTURE.md
├── IMPLEMENTATION_GUIDE.md
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

---

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local` en la raíz:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxx
VITE_FIREBASE_APP_ID=xxxxx

# Supabase Configuration (Opcional)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

### Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Firestore Database
3. Configurar reglas de seguridad
4. Copiar credenciales a `.env.local`

### Configuración de TypeScript

El archivo `tsconfig.json` ya tiene configurado:
- ✓ Rutas alias (`@/*` → `src/*`)
- ✓ Tipos estrictos
- ✓ JSX React

---

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Coverage de tests
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Tests E2E
npm run test:e2e
```

---

## 📊 Funciones de Cálculo Disponibles

Ver `src/services/calculations.ts`:

### CEC
- `calculateSurfaceArea()` - Superficie corporal
- `calculateTotalVolume()` - Volemia total
- `calculateFlow()` - Flujo cardíaco
- `calculatePostPrimingHct()` - Hematocrito post-priming
- `calculateCerebralFlow()` - Flujo cerebral
- `calculateCoronaryFlow()` - Flujo coronario

### ECMO
- `calculateECMOFlow()` - Flujo ECMO
- `calculateECMOHctDrop()` - Caída hematocrito

### Pediátrico
- `getPediatricVolumeByAge()` - Volemia por edad
- `calculateZScore()` - Z-score válvulas

### Hemodinámico
- `calculateDO2()` - Aporte O2
- `calculateVO2()` - Consumo O2
- `calculateCEO2()` - Extracción O2
- `calculateCaO2()` - Contenido O2 arterial
- `calculateCvO2()` - Contenido O2 venoso

### Electrolitos
- `calculatePotassiumDeficit()` - Déficit K+
- `calculateBicarbonateDeficit()` - Déficit HCO3-

---

## 🐛 Reporte de Bugs

Encontraste un bug? Por favor reporta en [GitHub Issues](https://github.com/Emmeuve/perfusion-pulse/issues)

**Incluir:**
- Descripción clara del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots si es relevante
- Información del navegador/dispositivo

---

## 💡 Sugerencias y Mejoras

¿Tienes ideas? Comparte tus sugerencias:
- Abre un [GitHub Discussion](https://github.com/Emmeuve/perfusion-pulse/discussions)
- Envía un email a [email@example.com]
- Participa en el desarrollo

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Desarrollo

- Usar TypeScript para todo código nuevo
- Seguir convenciones de naming del proyecto
- Crear funciones reutilizables en `services/`
- Agregar tipos en `types/index.ts`
- Escribir comentarios JSDoc para funciones complejas

---

## 📚 Documentación Adicional

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Estructura detallada y mejoras
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Guía de implementación de características
- **[CHANGELOG.md](./CHANGELOG.md)** - Historial de cambios (próximamente)

---

## 📞 Soporte

### Preguntas Frecuentes

**P: ¿Los datos se guardan localmente o en la nube?**
R: Se guardan en Firebase (nube) con sincronización en tiempo real. También funciona offline.

**P: ¿Es seguro mi información?**
R: Sí, Firebase usa encriptación SSL y reglas de seguridad configurables.

**P: ¿Puedo usar esto sin conexión a internet?**
R: Sí, parcialmente. Los cálculos funcionan offline, pero el almacenamiento requiere conectividad.

**P: ¿Qué navegadores soporta?**
R: Chrome, Firefox, Safari, Edge (últimas 2 versiones).

### Contacto

- 📧 Email: [email@example.com]
- 🐦 Twitter: [@perfusionpulse]
- 💬 Discord: [Servidor Discord]

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Ver `LICENSE` para más detalles.

---

## 🙌 Agradecimientos

- ✓ shadcn/ui por componentes increíbles
- ✓ Firebase por infraestructura confiable
- ✓ Comunidad médica por feedback clínico
- ✓ Todos los contribuidores

---

## 📈 Roadmap Futuro

- [ ] Integración con EHR
- [ ] App móvil nativa (React Native)
- [ ] Más protocolos de cebado
- [ ] Integración con monitores
- [ ] Sistema de alertas en tiempo real
- [ ] Reportes avanzados en PDF
- [ ] Sincronización con ELSO
- [ ] Multiplataforma (macOS, Windows, Linux)

---

## 🔐 Seguridad

Este proyecto toma la seguridad en serio. Por favor:

- No compartas `.env.local` públicamente
- Reporta vulnerabilidades a [security@example.com]
- Mantén dependencias actualizadas (`npm audit fix`)
- Usa contraseñas fuertes para Firebase

---

## 📊 Estadísticas

- **Componentes**: 15+
- **Funciones de Cálculo**: 30+
- **Tipos TypeScript**: 20+
- **Datos de Referencia**: 100+
- **Líneas de Código**: 10,000+

---

**Última actualización:** Noviembre 2025

**Versión:** 1.0.0

**Estado:** ✅ Producción

---

<div align="center">

### Hecho con ❤️ para Perfusionistas

[⭐ Dale una estrella en GitHub](https://github.com/Emmeuve/perfusion-pulse) si te es útil

</div>