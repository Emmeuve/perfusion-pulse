/**
 * Datos de Referencia para Perfusion Pulse
 * Incluye cánulas, oxigenadores, medicamentos y soluciones
 */

// ============================================
// TIPOS
// ============================================

export interface Cannula {
  id: string;
  name: string;
  type: 'arterial_central' | 'arterial_femoral' | 'venous_central' | 'venous_femoral';
  fr: number;
  manufacturer: string;
  minFlow?: number;
  maxFlow?: number;
  pressureDrop?: number; // mmHg
  comments?: string;
  ageGroup?: 'adult' | 'pediatric' | 'neonatal';
}

export interface Oxygenator {
  id: string;
  name: string;
  manufacturer: string;
  type: 'CEC' | 'ECMO';
  maxFlowRate: number; // L/min
  minFlowRate: number; // L/min
  primingVolume: number; // ml
  surfaceArea: number; // m²
  gasTransferRate?: number; // ml O2/min
  comments?: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  dosage: string;
  route: string;
  indications: string[];
  contraindications?: string[];
  sideEffects?: string[];
}

export interface Solution {
  id: string;
  name: string;
  components: {
    name: string;
    concentration: number;
    unit: string;
  }[];
  osmolarity?: number;
  pH?: number;
  indication: string;
}

// ============================================
// CÁNULAS ADULTOS - CEC
// ============================================

export const cannulasAdultCEC: Cannula[] = [
  // Arteriales Centrales
  {
    id: 'ac_eopa_22',
    name: 'EOPA',
    type: 'arterial_central',
    fr: 22,
    manufacturer: 'MEDTRONIC',
    minFlow: 4.5,
    maxFlow: 6.0,
    pressureDrop: 15,
    comments: 'Cánula de punta redondeada, óptima para anastomosis',
    ageGroup: 'adult',
  },
  {
    id: 'ac_ezglide_24',
    name: 'Ezglide',
    type: 'arterial_central',
    fr: 24,
    manufacturer: 'EDWARDS',
    minFlow: 5.0,
    maxFlow: 6.5,
    pressureDrop: 12,
    comments: 'Facilita inserción, punta flexible',
    ageGroup: 'adult',
  },
  {
    id: 'ac_straight_22',
    name: 'Punta Recta',
    type: 'arterial_central',
    fr: 22,
    manufacturer: 'MEDTRONIC',
    minFlow: 4.5,
    maxFlow: 6.0,
    pressureDrop: 18,
    comments: 'Tradicional, rigidez controlada',
    ageGroup: 'adult',
  },

  // Arteriales Femorales
  {
    id: 'af_medtronic_19',
    name: 'Canula Arterial Femoral',
    type: 'arterial_femoral',
    fr: 19,
    manufacturer: 'MEDTRONIC',
    minFlow: 4.0,
    maxFlow: 5.5,
    pressureDrop: 20,
    ageGroup: 'adult',
  },
  {
    id: 'af_maquet_18',
    name: 'Canula Arterial Femoral',
    type: 'arterial_femoral',
    fr: 18,
    manufacturer: 'MAQUET',
    minFlow: 3.8,
    maxFlow: 5.2,
    pressureDrop: 22,
    ageGroup: 'adult',
  },

  // Venosas Centrales - Cánula Única
  {
    id: 'vc_vacuum_28',
    name: 'Canula de Vacío Simple',
    type: 'venous_central',
    fr: 28,
    manufacturer: 'MEDTRONIC',
    maxFlow: 5.5,
    pressureDrop: 8,
    comments: 'Requiere succión controlada',
    ageGroup: 'adult',
  },
  {
    id: 'vc_vacuum_double_29',
    name: 'Canula de Vacío Doble/Triple Estadio',
    type: 'venous_central',
    fr: 29,
    manufacturer: 'MEDTRONIC',
    maxFlow: 6.2,
    pressureDrop: 6,
    comments: 'Mejor drenaje, múltiples orificios',
    ageGroup: 'adult',
  },

  // Venosas Centrales - Bicava
  {
    id: 'vc_bicava_medtronic_24',
    name: 'Canula Maleable/Preformada',
    type: 'venous_central',
    fr: 24,
    manufacturer: 'MEDTRONIC',
    maxFlow: 4.8,
    pressureDrop: 10,
    comments: 'Adaptable a diferentes anatomías',
    ageGroup: 'adult',
  },
  {
    id: 'vc_bicava_medtronic_26',
    name: 'Canula Maleable/Preformada',
    type: 'venous_central',
    fr: 26,
    manufacturer: 'MEDTRONIC',
    maxFlow: 5.2,
    pressureDrop: 9,
    ageGroup: 'adult',
  },
  {
    id: 'vc_bicava_livanova_24',
    name: 'Canula Maleable/Preformada',
    type: 'venous_central',
    fr: 24,
    manufacturer: 'LIVANOVA',
    maxFlow: 4.8,
    pressureDrop: 11,
    ageGroup: 'adult',
  },
  {
    id: 'vc_bicava_livanova_28',
    name: 'Canula Maleable/Preformada',
    type: 'venous_central',
    fr: 28,
    manufacturer: 'LIVANOVA',
    maxFlow: 5.5,
    pressureDrop: 7,
    ageGroup: 'adult',
  },

  // Venosas Femorales
  {
    id: 'vf_medtronic_27',
    name: 'Canula Venosa Femoral',
    type: 'venous_femoral',
    fr: 27,
    manufacturer: 'MEDTRONIC',
    maxFlow: 5.2,
    pressureDrop: 9,
    ageGroup: 'adult',
  },
  {
    id: 'vf_maquet_26',
    name: 'Canula Venosa Femoral',
    type: 'venous_femoral',
    fr: 26,
    manufacturer: 'MAQUET',
    maxFlow: 4.8,
    pressureDrop: 11,
    ageGroup: 'adult',
  },
];

// ============================================
// CÁNULAS PEDIÁTRICAS
// ============================================

export const cannulasPediatric: Cannula[] = [
  {
    id: 'pc_medtronic_14',
    name: 'Canula Pediátrica',
    type: 'arterial_central',
    fr: 14,
    manufacturer: 'MEDTRONIC',
    minFlow: 1.5,
    maxFlow: 2.5,
    ageGroup: 'pediatric',
  },
  {
    id: 'pc_medtronic_16',
    name: 'Canula Pediátrica',
    type: 'arterial_central',
    fr: 16,
    manufacturer: 'MEDTRONIC',
    minFlow: 2.0,
    maxFlow: 3.0,
    ageGroup: 'pediatric',
  },
  {
    id: 'pv_medtronic_18',
    name: 'Canula Venosa Pediátrica',
    type: 'venous_central',
    fr: 18,
    manufacturer: 'MEDTRONIC',
    maxFlow: 3.0,
    ageGroup: 'pediatric',
  },
  {
    id: 'pv_medtronic_20',
    name: 'Canula Venosa Pediátrica',
    type: 'venous_central',
    fr: 20,
    manufacturer: 'MEDTRONIC',
    maxFlow: 3.8,
    ageGroup: 'pediatric',
  },
];

// ============================================
// CÁNULAS NEONATALES - ECMO
// ============================================

export const cannulasNeonatal: Cannula[] = [
  {
    id: 'nec_medtronic_10',
    name: 'Canula Arterial Neonatal',
    type: 'arterial_central',
    fr: 10,
    manufacturer: 'MEDTRONIC',
    minFlow: 0.4,
    maxFlow: 0.8,
    ageGroup: 'neonatal',
  },
  {
    id: 'nec_medtronic_12',
    name: 'Canula Arterial Neonatal',
    type: 'arterial_central',
    fr: 12,
    manufacturer: 'MEDTRONIC',
    minFlow: 0.6,
    maxFlow: 1.2,
    ageGroup: 'neonatal',
  },
  {
    id: 'nev_medtronic_12',
    name: 'Canula Venosa Neonatal',
    type: 'venous_central',
    fr: 12,
    manufacturer: 'MEDTRONIC',
    maxFlow: 1.0,
    ageGroup: 'neonatal',
  },
];

// ============================================
// OXIGENADORES - CEC
// ============================================

export const oxygenatorsCEC: Oxygenator[] = [
  {
    id: 'ox_cec_capiox_220',
    name: 'Capiox RX220',
    manufacturer: 'TERUMO',
    type: 'CEC',
    maxFlowRate: 6.5,
    minFlowRate: 0.3,
    primingVolume: 205,
    surfaceArea: 2.2,
    gasTransferRate: 800,
    comments: 'Óptimo para cirugía convencional adulta',
  },
  {
    id: 'ox_cec_capiox_400',
    name: 'Capiox RX400',
    manufacturer: 'TERUMO',
    type: 'CEC',
    maxFlowRate: 10.0,
    minFlowRate: 0.5,
    primingVolume: 310,
    surfaceArea: 4.0,
    gasTransferRate: 1200,
    comments: 'Para cirugía valvular complejas',
  },
  {
    id: 'ox_cec_affinity',
    name: 'Affinity RP',
    manufacturer: 'MEDTRONIC',
    type: 'CEC',
    maxFlowRate: 8.0,
    minFlowRate: 0.4,
    primingVolume: 180,
    surfaceArea: 2.0,
    gasTransferRate: 850,
    comments: 'Bajo perfil de hemólisis',
  },
  {
    id: 'ox_cec_quadrox',
    name: 'Quadrox-i',
    manufacturer: 'MAQUET',
    type: 'CEC',
    maxFlowRate: 8.5,
    minFlowRate: 0.5,
    primingVolume: 220,
    surfaceArea: 2.2,
    gasTransferRate: 900,
  },
];

// ============================================
// OXIGENADORES - ECMO
// ============================================

export const oxygenatorsECMO: Oxygenator[] = [
  {
    id: 'ox_ecmo_capiox_sx10',
    name: 'Capiox SX10',
    manufacturer: 'TERUMO',
    type: 'ECMO',
    maxFlowRate: 3.5,
    minFlowRate: 0.2,
    primingVolume: 105,
    surfaceArea: 1.0,
    gasTransferRate: 400,
    comments: 'Adecuado para neonatos',
  },
  {
    id: 'ox_ecmo_capiox_sx20',
    name: 'Capiox SX20',
    manufacturer: 'TERUMO',
    type: 'ECMO',
    maxFlowRate: 5.0,
    minFlowRate: 0.3,
    primingVolume: 150,
    surfaceArea: 2.0,
    gasTransferRate: 600,
    comments: 'Para pediatría',
  },
  {
    id: 'ox_ecmo_alung',
    name: 'ALung Hemolung',
    manufacturer: 'ALUNG',
    type: 'ECMO',
    maxFlowRate: 8.0,
    minFlowRate: 0.5,
    primingVolume: 280,
    surfaceArea: 1.3,
    gasTransferRate: 1000,
    comments: 'Oxigenador compacto de última generación',
  },
];

// ============================================
// MEDICAMENTOS COMUNES EN PERFUSIÓN
// ============================================

export const medications: Medication[] = [
  {
    id: 'med_heparina',
    name: 'Heparina Sódica',
    genericName: 'Heparin Sodium',
    category: 'Anticoagulante',
    dosage: '50-100 UI/kg dosis inicial, mantención 300-400 UI/kg',
    route: 'IV',
    indications: ['Anticoagulación sistémica durante CEC', 'ECMO'],
    sideEffects: ['Trombocitopenia inducida por heparina', 'Hemorragia'],
  },
  {
    id: 'med_protamina',
    name: 'Sulfato de Protamina',
    genericName: 'Protamine Sulfate',
    category: 'Antídoto',
    dosage: '1 mg por 100 UI de heparina residual',
    route: 'IV',
    indications: ['Reversión de anticoagulación con heparina'],
  },
  {
    id: 'med_fenol',
    name: 'Fentolamina',
    genericName: 'Phentolamine',
    category: 'Vasodilatador',
    dosage: '1-5 mg IV',
    route: 'IV',
    indications: ['Crisis hipertensiva', 'Reacción simpatomimética'],
  },
  {
    id: 'med_dopamina',
    name: 'Dopamina',
    genericName: 'Dopamine',
    category: 'Inotrópico',
    dosage: '2-20 mcg/kg/min',
    route: 'IV',
    indications: ['Soporte inotrópico', 'Hipotensión'],
  },
  {
    id: 'med_milrinona',
    name: 'Milrinona',
    genericName: 'Milrinone',
    category: 'Inodilatador',
    dosage: '0.25-0.75 mcg/kg/min',
    route: 'IV',
    indications: ['Insuficiencia cardíaca', 'Post-CEC'],
  },
  {
    id: 'med_adrenalina',
    name: 'Epinefrina',
    genericName: 'Epinephrine',
    category: 'Simpaticomimético',
    dosage: '0.01-0.1 mcg/kg/min',
    route: 'IV',
    indications: ['Shock cardiogénico', 'Paro cardíaco'],
  },
];

// ============================================
// SOLUCIONES IV
// ============================================

export const solutions: Solution[] = [
  {
    id: 'sol_sf09',
    name: 'Suero Fisiológico 0.9%',
    components: [
      { name: 'Sodio (Na+)', concentration: 154, unit: 'mEq/L' },
      { name: 'Cloro (Cl-)', concentration: 154, unit: 'mEq/L' },
    ],
    osmolarity: 308,
    pH: 5.5,
    indication: 'Cristaloide isotónico, uso general',
  },
  {
    id: 'sol_rl',
    name: 'Ringer Lactato (RL)',
    components: [
      { name: 'Sodio (Na+)', concentration: 130, unit: 'mEq/L' },
      { name: 'Potasio (K+)', concentration: 4, unit: 'mEq/L' },
      { name: 'Calcio (Ca2+)', concentration: 3, unit: 'mEq/L' },
      { name: 'Cloro (Cl-)', concentration: 109, unit: 'mEq/L' },
      { name: 'Lactato', concentration: 28, unit: 'mEq/L' },
    ],
    osmolarity: 273,
    pH: 6.5,
    indication: 'Cristaloide fisiológico, primera línea',
  },
  {
    id: 'sol_plasmalyte',
    name: 'Plasmalyte A',
    components: [
      { name: 'Sodio (Na+)', concentration: 140, unit: 'mEq/L' },
      { name: 'Potasio (K+)', concentration: 5, unit: 'mEq/L' },
      { name: 'Magnesio (Mg2+)', concentration: 3, unit: 'mEq/L' },
      { name: 'Cloro (Cl-)', concentration: 98, unit: 'mEq/L' },
      { name: 'Acetato', concentration: 27, unit: 'mEq/L' },
      { name: 'Gluconato', concentration: 23, unit: 'mEq/L' },
    ],
    osmolarity: 294,
    pH: 7.4,
    indication: 'Cristaloide fisiológico avanzado',
  },
  {
    id: 'sol_albumina5',
    name: 'Albúmina Humana 5%',
    components: [
      { name: 'Albúmina plasmática humana', concentration: 50, unit: 'g/L' },
    ],
    osmolarity: 308,
    pH: 6.4,
    indication: 'Coloide natural, cirugía cardiovascular',
  },
];

// ============================================
// CARDIOPLEGIAS
// ============================================

export const cardioplegias = {
  bretschneider: {
    name: 'Solución Bretschneider',
    components: [
      'Sodium: 110 mEq/L',
      'Potassium: 16 mEq/L',
      'Calcium: 0.5 mEq/L',
      'Magnesium: 30 mEq/L',
      'Chloride: 100 mEq/L',
      'Acetate: 60 mEq/L',
      'Histidine: 198 mEq/L',
      'Tryptophan: 2 mEq/L',
      'Ketoglutarate: 1 mEq/L',
    ],
    temperature: '4°C',
    flow: '50-100 ml/min',
    indication: 'Protección miocárdica óptima, hasta 8 horas',
  },
  
  saintsol: {
    name: 'Solución Saint Thomas',
    components: [
      'Sodium: 120 mEq/L',
      'Potassium: 16 mEq/L',
      'Calcium: 1.2 mEq/L',
      'Magnesium: 16 mEq/L',
      'Chloride: 160 mEq/L',
    ],
    temperature: '4°C',
    flow: '50-100 ml/min',
    indication: 'Cardioplejia estándar para CEC',
  },

  del_nido: {
    name: 'Cardioplejia del Nido',
    components: [
      'Sodium: 120 mEq/L',
      'Potassium: 16 mEq/L',
      'Calcium: 1.2 mEq/L',
      'Magnesium: 16 mEq/L',
      'Chloride: 160 mEq/L',
      'Bicarbonate: 10 mEq/L',
    ],
    temperature: '4°C',
    flow: '50 ml/min',
    indication: 'Cardioplejia pediátrica, una sola dosis',
  },
};

// ============================================
// VALORES NORMALES
// ============================================

export const normalValues = {
  hemodynamic: {
    'Presión Arterial Media (PAM)': { value: '70-100 mmHg', unit: 'mmHg' },
    'Presión Venosa Central (PVC)': { value: '2-8 cmH2O', unit: 'cmH2O' },
    'Gasto Cardíaco (GC)': { value: '4-8 L/min', unit: 'L/min' },
    'Índice Cardíaco (IC)': { value: '2.4-4.2 L/min/m²', unit: 'L/min/m²' },
    'Saturación O2 Arterial (SaO2)': { value: '95-100%', unit: '%' },
    'Saturación O2 Venosa (SvO2)': { value: '60-80%', unit: '%' },
  },
  
  laboratory: {
    'Hemoglobina': { value: '12-16 g/dL', unit: 'g/dL' },
    'Hematocrito': { value: '36-46%', unit: '%' },
    'Potasio': { value: '3.5-5.0 mEq/L', unit: 'mEq/L' },
    'Sodio': { value: '135-145 mEq/L', unit: 'mEq/L' },
    'Calcio': { value: '8.5-10.5 mg/dL', unit: 'mg/dL' },
    'pH Arterial': { value: '7.35-7.45', unit: 'pH' },
    'PaO2': { value: '80-100 mmHg', unit: 'mmHg' },
    'PaCO2': { value: '35-45 mmHg', unit: 'mmHg' },
    'HCO3': { value: '22-26 mEq/L', unit: 'mEq/L' },
    'Lactato': { value: '<2 mmol/L', unit: 'mmol/L' },
  },
};

// ============================================
// EXPORTAR TODOS LOS DATOS
// ============================================

export const allCannulas = [
  ...cannulasAdultCEC,
  ...cannulasPediatric,
  ...cannulasNeonatal,
];

export const allOxygenators = [
  ...oxygenatorsCEC,
  ...oxygenatorsECMO,
];