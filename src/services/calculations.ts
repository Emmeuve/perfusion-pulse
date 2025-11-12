/**
 * Servicio de Cálculos para Perfusión Cardiovascular
 * Incluye funciones para CEC Adulto, CEC Pediátrico, ECMO y análisis hemodinámico
 */

// ============================================
// CEC ADULTO - CÁLCULOS BÁSICOS
// ============================================

/**
 * Calcula la superficie corporal (SC) usando la fórmula de DuBois
 * @param height Altura en cm
 * @param weight Peso en kg
 * @returns Superficie corporal en m²
 */
export const calculateSurfaceArea = (height: number, weight: number): number => {
  if (height <= 0 || weight <= 0) throw new Error('Altura y peso deben ser mayores a 0');
  const sc = (Math.pow(height, 0.725) * Math.pow(weight, 0.425)) / 3131;
  return parseFloat(sc.toFixed(2));
};

/**
 * Calcula la volemia total para CEC adulto
 * @param weight Peso en kg
 * @param volumeOption Opción de volemia ('70', '75', '80', 'custom')
 * @param customValue Valor personalizado si volumeOption es 'custom'
 * @returns Volemia total en ml
 */
export const calculateTotalVolume = (
  weight: number,
  volumeOption: string,
  customValue?: number
): number => {
  const volumeMap: { [key: string]: number } = {
    '70': 70,
    '75': 75,
    '80': 80,
  };

  const volumePerKg = volumeMap[volumeOption] || customValue || 75;
  if (!volumePerKg) throw new Error('Opción de volemia no válida');

  const totalVolume = weight * volumePerKg;
  return parseFloat(totalVolume.toFixed(0));
};

/**
 * Calcula el flujo cardíaco usando índice cardíaco
 * @param weight Peso en kg
 * @param indexCardiac Índice cardíaco seleccionado (2.4, 2.6, 2.8, custom)
 * @param customValue Valor personalizado si indexCardiac es 'custom'
 * @returns Flujo en L/min
 */
export const calculateFlow = (
  weight: number,
  indexCardiac: string | number,
  customValue?: number
): number => {
  const indexMap: { [key: string]: number } = {
    '2.4': 2.4,
    '2.6': 2.6,
    '2.8': 2.8,
  };

  let index: number;
  if (typeof indexCardiac === 'number') {
    index = indexCardiac;
  } else {
    index = indexMap[indexCardiac] || customValue || 2.6;
  }

  const sc = calculateSurfaceArea(170, weight); // Asume 170cm default si no se pasa altura
  const flow = sc * index;
  return parseFloat(flow.toFixed(2));
};

/**
 * Calcula el hematocrito post-priming (S/S)
 * @param patientHct Hematocrito del paciente (%)
 * @param primingVolume Volumen de priming (ml)
 * @param desiredHct Hematocrito deseado (%)
 * @param totalVolume Volemia total (ml)
 * @returns Hematocrito post-priming (%)
 */
export const calculatePostPrimingHct = (
  patientHct: number,
  primingVolume: number,
  desiredHct: number,
  totalVolume: number
): number => {
  // Fórmula simplificada
  const finalHct = (patientHct * (totalVolume - primingVolume)) / totalVolume;
  return parseFloat(finalHct.toFixed(1));
};

/**
 * Calcula flujo cerebral estimado
 * @param weight Peso en kg
 * @returns Flujo cerebral en ml/min
 */
export const calculateCerebralFlow = (weight: number): number => {
  // Aproximadamente 50 ml/min/kg
  const cerebralFlow = weight * 50;
  return parseFloat(cerebralFlow.toFixed(0));
};

/**
 * Calcula flujo coronario estimado
 * @param weight Peso en kg
 * @returns Flujo coronario en ml/min
 */
export const calculateCoronaryFlow = (weight: number): number => {
  // Aproximadamente 60 ml/min/kg
  const coronaryFlow = weight * 60;
  return parseFloat(coronaryFlow.toFixed(0));
};

// ============================================
// CEC PEDIÁTRICO - CÁLCULOS
// ============================================

/**
 * Obtiene volemia según edad pediátrica
 * @param ageYears Edad en años
 * @returns Volemia recomendada en ml/kg
 */
export const getPediatricVolumeByAge = (ageYears: number): number => {
  const volumeByAge: { [key: string]: number } = {
    'neonato': 85,
    'lactante': 80,
    '1-3': 75,
    '3-10': 70,
    '>10': 65,
  };

  if (ageYears < 0.1) return volumeByAge['neonato'];
  if (ageYears < 1) return volumeByAge['lactante'];
  if (ageYears < 3) return volumeByAge['1-3'];
  if (ageYears < 10) return volumeByAge['3-10'];
  return volumeByAge['>10'];
};

/**
 * Calcula Z-score para válvulas cardíacas
 * @param annulusDiameter Diámetro del anillo (mm)
 * @param bsa Área de superficie corporal (m²)
 * @returns Z-score
 */
export const calculateZScore = (annulusDiameter: number, bsa: number): number => {
  // Fórmula simplificada Z-score
  const expectedDiameter = 10 + bsa * 20;
  const zScore = (annulusDiameter - expectedDiameter) / 3;
  return parseFloat(zScore.toFixed(1));
};

// ============================================
// ECMO - CÁLCULOS
// ============================================

/**
 * Calcula flujo ECMO según peso y tipo
 * @param weight Peso en kg
 * @param height Altura en cm
 * @param type Tipo de ECMO ('VA' o 'VV')
 * @returns Flujo recomendado en L/min
 */
export const calculateECMOFlow = (
  weight: number,
  height: number,
  type: 'VA' | 'VV'
): number => {
  const sc = calculateSurfaceArea(height, weight);
  const baseFlow = type === 'VA' ? 2.4 : 2.2;
  const flow = sc * baseFlow;
  return parseFloat(flow.toFixed(2));
};

/**
 * Calcula caída de hematocrito con priming ECMO
 * @param patientHct Hematocrito inicial (%)
 * @param primingVolume Volumen de priming (ml)
 * @param patientBloodVolume Volumen de sangre del paciente (ml)
 * @returns Hematocrito post-priming (%)
 */
export const calculateECMOHctDrop = (
  patientHct: number,
  primingVolume: number,
  patientBloodVolume: number
): number => {
  const totalVolume = primingVolume + patientBloodVolume;
  const hctAfterPriming = (patientHct * patientBloodVolume) / totalVolume;
  return parseFloat(hctAfterPriming.toFixed(1));
};

// ============================================
// ANÁLISIS HEMODINÁMICO - GDP
// ============================================

/**
 * Calcula DO2 (Aporte de Oxígeno)
 * @param hemoglobin Hemoglobina (g/dL)
 * @param SaO2 Saturación arterial (%)
 * @param cardiacOutput Gasto cardíaco (L/min)
 * @returns DO2 en ml O2/min
 */
export const calculateDO2 = (
  hemoglobin: number,
  SaO2: number,
  cardiacOutput: number
): number => {
  // DO2 = (Hb × SaO2 × 1.34 + PaO2 × 0.003) × CO × 10
  const SaO2Decimal = SaO2 / 100;
  const do2 = (hemoglobin * SaO2Decimal * 1.34 + 0.3) * cardiacOutput * 10;
  return parseFloat(do2.toFixed(0));
};

/**
 * Calcula VO2 (Consumo de Oxígeno)
 * @param hemoglobin Hemoglobina (g/dL)
 * @param SaO2 Saturación arterial (%)
 * @param SvO2 Saturación venosa (%)
 * @param cardiacOutput Gasto cardíaco (L/min)
 * @returns VO2 en ml O2/min
 */
export const calculateVO2 = (
  hemoglobin: number,
  SaO2: number,
  SvO2: number,
  cardiacOutput: number
): number => {
  const SaO2Decimal = SaO2 / 100;
  const SvO2Decimal = SvO2 / 100;
  const CaO2 = hemoglobin * SaO2Decimal * 1.34;
  const CvO2 = hemoglobin * SvO2Decimal * 1.34;
  const vo2 = (CaO2 - CvO2) * cardiacOutput * 10;
  return parseFloat(vo2.toFixed(0));
};

/**
 * Calcula Extracción de O2 (CEO2)
 * @param DO2 Aporte de oxígeno (ml O2/min)
 * @param VO2 Consumo de oxígeno (ml O2/min)
 * @returns CEO2 (%)
 */
export const calculateCEO2 = (DO2: number, VO2: number): number => {
  if (DO2 === 0) throw new Error('DO2 debe ser mayor a 0');
  const ceo2 = (VO2 / DO2) * 100;
  return parseFloat(ceo2.toFixed(1));
};

/**
 * Calcula Contenido de O2 Arterial (CaO2)
 * @param hemoglobin Hemoglobina (g/dL)
 * @param SaO2 Saturación arterial (%)
 * @param PaO2 Presión parcial O2 (mmHg)
 * @returns CaO2 en ml O2/100ml sangre
 */
export const calculateCaO2 = (
  hemoglobin: number,
  SaO2: number,
  PaO2: number = 100
): number => {
  const SaO2Decimal = SaO2 / 100;
  const cao2 = hemoglobin * SaO2Decimal * 1.34 + PaO2 * 0.003;
  return parseFloat(cao2.toFixed(2));
};

/**
 * Calcula Contenido de O2 Venoso (CvO2)
 * @param hemoglobin Hemoglobina (g/dL)
 * @param SvO2 Saturación venosa (%)
 * @param PvO2 Presión parcial venosa O2 (mmHg)
 * @returns CvO2 en ml O2/100ml sangre
 */
export const calculateCvO2 = (
  hemoglobin: number,
  SvO2: number,
  PvO2: number = 40
): number => {
  const SvO2Decimal = SvO2 / 100;
  const cvo2 = hemoglobin * SvO2Decimal * 1.34 + PvO2 * 0.003;
  return parseFloat(cvo2.toFixed(2));
};

/**
 * Calcula índice cardíaco a partir de gasto cardíaco
 * @param cardiacOutput Gasto cardíaco (L/min)
 * @param bsa Área de superficie corporal (m²)
 * @returns Índice cardíaco (L/min/m²)
 */
export const calculateCardiacIndex = (cardiacOutput: number, bsa: number): number => {
  if (bsa === 0) throw new Error('BSA debe ser mayor a 0');
  const ci = cardiacOutput / bsa;
  return parseFloat(ci.toFixed(2));
};

// ============================================
// CORRECCIÓN DE ELECTROLITOS
// ============================================

/**
 * Calcula déficit de potasio
 * @param actualK Potasio actual (mEq/L)
 * @param desiredK Potasio deseado (mEq/L)
 * @param weight Peso en kg
 * @returns Déficit en mEq
 */
export const calculatePotassiumDeficit = (
  actualK: number,
  desiredK: number,
  weight: number
): number => {
  // Factor de distribución del potasio: 0.4-0.6 L/kg
  const distributionFactor = 0.5;
  const deficit = (desiredK - actualK) * weight * distributionFactor;
  return parseFloat(deficit.toFixed(1));
};

/**
 * Calcula déficit de bicarbonato
 * @param actualHCO3 Bicarbonato actual (mEq/L)
 * @param desiredHCO3 Bicarbonato deseado (mEq/L)
 * @param weight Peso en kg
 * @returns Déficit en mEq
 */
export const calculateBicarbonateDeficit = (
  actualHCO3: number,
  desiredHCO3: number,
  weight: number
): number => {
  // Factor de distribución del HCO3: 0.5 L/kg
  const distributionFactor = 0.5;
  const deficit = (desiredHCO3 - actualHCO3) * weight * distributionFactor;
  return parseFloat(deficit.toFixed(1));
};

// ============================================
// UTILIDADES DE VALIDACIÓN
// ============================================

/**
 * Valida rango de valores médicos
 * @param value Valor a validar
 * @param min Valor mínimo
 * @param max Valor máximo
 * @param fieldName Nombre del campo para mensaje de error
 * @returns true si es válido
 */
export const validateRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string
): boolean => {
  if (value < min || value > max) {
    throw new Error(`${fieldName} debe estar entre ${min} y ${max}`);
  }
  return true;
};

/**
 * Valida que todos los valores requeridos estén presentes
 * @param data Objeto con datos
 * @param requiredFields Array de campos requeridos
 * @returns true si todos están presentes
 */
export const validateRequiredFields = (
  data: { [key: string]: any },
  requiredFields: string[]
): boolean => {
  const missing = requiredFields.filter(field => !data[field] && data[field] !== 0);
  if (missing.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`);  // ✅ Correcto
  }
  return true;
};